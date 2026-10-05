param([Parameter(Mandatory=$true)][ValidateSet('CreateDisabled','Enable','Pause','Status','History')][string]$Action)

$ErrorActionPreference = 'Stop'
function Assert-PrivateSchedulerPath([string]$Path,[string]$CurrentSid,[bool]$Directory=$false) {
  $item = Get-Item -LiteralPath $Path
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Private scheduler paths must not be reparse points.' }
  $acl = Get-Acl -LiteralPath $item.FullName
  $rules = $acl.GetAccessRules($true,$true,[Security.Principal.SecurityIdentifier])
  $identities = @($rules | ForEach-Object { $_.IdentityReference.Value } | Select-Object -Unique)
  if (($Directory -and -not $acl.AreAccessRulesProtected) -or $rules.Count -ne 2 -or $identities.Count -ne 2 -or @($rules | Where-Object { $_.AccessControlType -ne 'Allow' -or $_.IdentityReference.Value -notin @($CurrentSid,'S-1-5-18') -or ($_.FileSystemRights -band [Security.AccessControl.FileSystemRights]::FullControl) -ne [Security.AccessControl.FileSystemRights]::FullControl }).Count) { throw 'Private scheduler credential ACL must allow only its owner and SYSTEM.' }
}
function Get-AuthorizedSchedulerTarget($Deployment) {
  try { $origin = [uri]$Deployment.url } catch { throw 'Invalid private deployment URL.' }
  if ($Deployment.projectName -ne 'hidroflorestas-accounts-homologation' -or $Deployment.teamId -ne 'team_YqedIK09zOGFeZ8M84kra0oM' -or -not $origin.IsAbsoluteUri -or $origin.Scheme -ne 'https' -or $origin.Host -ne 'hidroflorestas-accounts-homologatio.vercel.app' -or $origin.Port -ne 443 -or $origin.PathAndQuery -ne '/' -or $origin.UserInfo -or $origin.Fragment) { throw 'Stable authorized homologation URL differs from the deployment record.' }
  return 'https://hidroflorestas-accounts-homologatio.vercel.app/api/internal/mail/process'
}
function Assert-SchedulerConfiguration($Job,[string]$ExpectedAuthorization) {
  if (-not $ExpectedAuthorization -or $Job.url -ne 'https://hidroflorestas-accounts-homologatio.vercel.app/api/internal/mail/process' -or $Job.title -ne 'HidroFlorestas accounts homologation worker' -or $Job.requestMethod -ne 1 -or $Job.requestTimeout -ne 30 -or $Job.saveResponses -isnot [bool] -or $Job.saveResponses -or $Job.redirectSuccess -isnot [bool] -or $Job.redirectSuccess -or $Job.auth.enable -isnot [bool] -or $Job.auth.enable) { throw 'Remote scheduler request configuration differs; enable refused.' }
  if ($Job.schedule.timezone -cne 'UTC' -or $Job.schedule.expiresAt -ne 0) { throw 'Remote scheduler schedule differs; enable refused.' }
  foreach ($dimension in @('hours','mdays','minutes','months','wdays')) {
    $values = @($Job.schedule.$dimension)
    if ($values.Count -ne 1 -or $values[0] -ne -1) { throw 'Remote scheduler cadence differs; enable refused.' }
  }
  $requestHeaders = $Job.extendedData.headers
  $headerNames = if ($requestHeaders -is [Collections.IDictionary]) { @($requestHeaders.Keys) } else { @($requestHeaders.PSObject.Properties.Name) }
  if ($headerNames.Count -ne 2 -or @($headerNames | Where-Object { $_ -notin @('Authorization','Content-Type') }).Count -or $requestHeaders.Authorization -cne $ExpectedAuthorization -or $requestHeaders.'Content-Type' -cne 'application/json' -or $Job.extendedData.body -cne '{}') { throw 'Remote scheduler private request differs; enable refused.' }
  $notification = $Job.notification
  if ($notification.onFailure -isnot [bool] -or -not $notification.onFailure -or $notification.onFailureCount -ne 3 -or $notification.onDisable -isnot [bool] -or -not $notification.onDisable -or $notification.onSuccess -isnot [bool] -or $notification.onSuccess -or $notification.onSslCertExpiry -isnot [bool] -or -not $notification.onSslCertExpiry -or $notification.mode -ne 2 -or @($notification.selectedChannels).Count -ne 1 -or $notification.selectedChannels[0] -ne 0) { throw 'Remote scheduler notifications differ; enable refused.' }
}
function Get-VerifiedSchedulerJobId($Value) {
  if (($Value -isnot [int] -and $Value -isnot [long]) -or $Value -le 0) { throw 'Scheduler identifier must be a positive integer.' }
  return [long]$Value
}
function New-SchedulerEnabledUpdate([ValidateSet('Enable','Pause')][string]$Action,$Job,$RecordedJobId,[string]$ExpectedAuthorization) {
  $recordedId = Get-VerifiedSchedulerJobId $RecordedJobId
  $remoteId = Get-VerifiedSchedulerJobId $Job.jobId
  if ($remoteId -ne $recordedId) { throw 'Remote scheduler identity differs; no update performed.' }
  if ($Action -eq 'Enable') { Assert-SchedulerConfiguration $Job $ExpectedAuthorization }
  # Disabling the recorded job remains possible if its request configuration drifted.
  return @{job=@{enabled=($Action -eq 'Enable')}}
}
function Read-PrivateWorkerCredential {
  $workerPath = Join-Path $privateRoot 'worker-credential.clixml'
  Assert-PrivateSchedulerPath $workerPath $currentSid
  $workerCredential = Import-Clixml -LiteralPath $workerPath
  if ($workerCredential -isnot [Management.Automation.PSCredential] -or $workerCredential.UserName -ne 'accounts-mail-worker') { throw 'Unexpected worker credential.' }
  return $workerCredential
}
$privateRoot = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas/accounts-homologation'))
$marker = 'hidroflorestas:accounts-homologation-private:v1'
$owner = Get-Content -LiteralPath (Join-Path $privateRoot 'owner.json') -Encoding UTF8 -Raw | ConvertFrom-Json
if ($owner.marker -ne $marker -or $owner.root -ne $privateRoot -or ((Get-Item -LiteralPath $privateRoot).Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Private homologation ownership mismatch.' }
$currentSid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
Assert-PrivateSchedulerPath $privateRoot $currentSid $true
Assert-PrivateSchedulerPath (Join-Path $privateRoot 'scheduler-credential.clixml') $currentSid
$credential = Import-Clixml -LiteralPath (Join-Path $privateRoot 'scheduler-credential.clixml')
if ($credential -isnot [Management.Automation.PSCredential] -or $credential.UserName -ne 'cron-job.org-accounts-worker') { throw 'Unexpected private scheduler credential.' }
$headers = @{ Authorization='Bearer '+$credential.GetNetworkCredential().Password }
function Invoke-Scheduler([string]$Method,[string]$Path,$Body=$null) {
  try {
    $arguments = @{ Uri=('https://api.cron-job.org/'+$Path); Method=$Method; Headers=$headers; ContentType='application/json'; TimeoutSec=30 }
    if ($null -ne $Body) { $arguments.Body=($Body | ConvertTo-Json -Depth 8 -Compress) }
    Invoke-RestMethod @arguments
  } catch { throw 'Scheduler API failed. Private credentials and response details were omitted; inspect account access/quota in the official console.' }
}
$recordPath = Join-Path $privateRoot 'scheduler-job.json'
if ($Action -eq 'CreateDisabled') {
  if (Test-Path -LiteralPath $recordPath) { throw 'A scheduler job is already recorded; inspect it instead of creating another.' }
  $deployment = Get-Content -LiteralPath (Join-Path $privateRoot 'deployment.json') -Encoding UTF8 -Raw | ConvertFrom-Json
  $target = Get-AuthorizedSchedulerTarget $deployment
  $worker = Read-PrivateWorkerCredential
  $result = Invoke-Scheduler 'PUT' 'jobs' @{job=@{
    title='HidroFlorestas accounts homologation worker';url=$target;enabled=$false;saveResponses=$false;requestMethod=1;requestTimeout=30;redirectSuccess=$false
    schedule=@{timezone='UTC';expiresAt=0;hours=@(-1);mdays=@(-1);minutes=@(-1);months=@(-1);wdays=@(-1)}
    extendedData=@{headers=@{Authorization='Bearer '+$worker.GetNetworkCredential().Password;'Content-Type'='application/json'};body='{}'}
    notification=@{onFailure=$true;onFailureCount=3;onDisable=$true;onSuccess=$false;onSslCertExpiry=$true;mode=2;selectedChannels=@(0)}
  }}
  $createdJobId = Get-VerifiedSchedulerJobId $result.jobId
  @{marker=$marker;jobId=$createdJobId;url=$target;createdUtc=[DateTime]::UtcNow.ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath $recordPath -Encoding UTF8
  [ordered]@{Action=$Action;JobId=$createdJobId;Enabled=$false;CadenceSeconds=60} | ConvertTo-Json
} else {
  $record=Get-Content -LiteralPath $recordPath -Encoding UTF8 -Raw | ConvertFrom-Json
  if ($record.marker -ne $marker -or $record.url -ne 'https://hidroflorestas-accounts-homologatio.vercel.app/api/internal/mail/process') { throw 'Recorded scheduler identity differs.' }
  $recordedJobId = Get-VerifiedSchedulerJobId $record.jobId
  $path='jobs/'+$recordedJobId
  $details=(Invoke-Scheduler 'GET' $path).jobDetails
  if ((Get-VerifiedSchedulerJobId $details.jobId) -ne $recordedJobId) { throw 'Remote scheduler identity differs; no update performed.' }
  if ($Action -in @('Enable','Pause')) {
    $expectedAuthorization = $null
    if ($Action -eq 'Enable') { $worker = Read-PrivateWorkerCredential; $expectedAuthorization = 'Bearer '+$worker.GetNetworkCredential().Password }
    $update = New-SchedulerEnabledUpdate $Action $details $recordedJobId $expectedAuthorization
    [void](Invoke-Scheduler 'PATCH' $path $update)
    [ordered]@{Action=$Action;JobId=$record.jobId;Enabled=($Action -eq 'Enable')} | ConvertTo-Json
    $expectedAuthorization = $null
  }
  elseif ($Action -eq 'Status') { [ordered]@{JobId=$record.jobId;Enabled=$details.enabled;LastExecution=$details.lastExecution;NextExecution=$details.nextExecution;LastStatus=$details.lastStatus;LastDuration=$details.lastDuration;Method=$details.requestMethod;Minutes=$details.schedule.minutes;SaveResponses=$details.saveResponses} | ConvertTo-Json }
  else { (Invoke-Scheduler 'GET' ($path+'/history')).history | Select-Object jobId,identifier,date,datePlanned,duration,status,httpStatus | ConvertTo-Json }
}
$headers=$null
$credential=$null
$worker=$null
