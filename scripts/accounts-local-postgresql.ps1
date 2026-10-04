param(
  [ValidateSet('Start', 'Stop', 'Status', 'Run', 'Dispose')]
  [string] $Action = 'Status',
  [ValidateSet('Schema', 'Regression', 'Application')]
  [string] $DatabaseMode = 'Schema',
  [string] $Executable,
  [string[]] $CommandArguments = @()
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas\accounts-postgresql'))
$parent = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas'))
$data = Join-Path $root 'data'
$markerFile = Join-Path $root 'cluster-owner.json'
$credentialFile = Join-Path $root 'cluster-credential.clixml'
$bin = Join-Path $root 'node_modules\@embedded-postgres\windows-x64\native\bin'
$control = Join-Path $bin 'pg_ctl.exe'
$initdb = Join-Path $bin 'initdb.exe'
$port = 55427
$owner = 'accounts_owner'
$marker = 'hidroflorestas:accounts-local-postgresql:v1'

if (-not $root.StartsWith($parent + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Cluster path is outside the dedicated local directory.'
}

$currentUserSid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$privateSids = @($currentUserSid, 'S-1-5-18')

function Assert-PrivateAcl([string] $path, [bool] $directory) {
  $acl = Get-Acl -LiteralPath $path
  $rules = @($acl.Access)
  if ($rules.Count -ne 2 -or ($directory -and -not $acl.AreAccessRulesProtected)) { throw 'Accounts private ACL verification failed.' }
  $seen = @()
  foreach ($rule in $rules) {
    $sid = $rule.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value
    if ($privateSids -notcontains $sid -or $rule.AccessControlType -ne [Security.AccessControl.AccessControlType]::Allow -or $rule.FileSystemRights -ne [Security.AccessControl.FileSystemRights]::FullControl) {
      throw 'Accounts private ACL contains an unexpected rule; credential access refused.'
    }
    if ($directory -and $rule.InheritanceFlags -ne ([Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [Security.AccessControl.InheritanceFlags]::ObjectInherit)) {
      throw 'Accounts private directory ACL must protect newly created children.'
    }
    $seen += $sid
  }
  if (@($seen | Select-Object -Unique).Count -ne 2) { throw 'Accounts private ACL principals do not match.' }
}

function Protect-NewClusterRoot {
  if (-not (Test-Path -LiteralPath $root -PathType Container)) { throw 'Accounts dedicated package directory is missing.' }
  if ((Get-Item -LiteralPath $root).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Cluster directory is a reparse point.' }
  # Authorization applies only to this fixed accounts directory. Preserve an
  # unowned existing data/credential rather than claiming or repairing it.
  if (Test-Path -LiteralPath $markerFile) { Assert-OwnedCluster }
  elseif ((Test-Path -LiteralPath $data) -or (Test-Path -LiteralPath $credentialFile)) { throw 'Unowned accounts cluster material exists; ACL setup refused.' }
  # Grant first: removing inherited access before granting can leave a zero-ACE
  # directory. Numeric SID arguments avoid localized account-name resolution.
  & icacls $root /grant:r ('*' + $currentUserSid + ':(OI)(CI)F') '*S-1-5-18:(OI)(CI)F' *> $null
  if ($LASTEXITCODE -ne 0) { throw 'Accounts private directory access grant failed.' }
  & icacls $root /inheritance:r *> $null
  if ($LASTEXITCODE -ne 0) { throw 'Accounts private directory inheritance removal failed.' }
  Assert-PrivateAcl $root $true
}

function Assert-OwnedCluster {
  if (-not (Test-Path -LiteralPath $markerFile -PathType Leaf)) { throw 'Cluster ownership marker is missing.' }
  $saved = Get-Content -LiteralPath $markerFile -Raw | ConvertFrom-Json
  if ($saved.marker -ne $marker -or $saved.root -ne $root -or $saved.port -ne $port -or $saved.owner -ne $owner) {
    throw 'Cluster ownership marker does not match this script.'
  }
  if ((Get-Item -LiteralPath $root).Attributes -band [IO.FileAttributes]::ReparsePoint) {
    throw 'Cluster directory is a reparse point.'
  }
  Assert-PrivateAcl $root $true
  if (-not (Test-Path -LiteralPath $credentialFile -PathType Leaf) -or ((Get-Item -LiteralPath $credentialFile).Attributes -band [IO.FileAttributes]::ReparsePoint)) {
    throw 'Owned cluster credential is missing or redirected.'
  }
  Assert-PrivateAcl $credentialFile $false
}

function Test-Running {
  & $control -D $data status *> $null
  return $LASTEXITCODE -eq 0
}

function Start-Cluster {
  if (-not (Test-Path -LiteralPath $control -PathType Leaf) -or -not (Test-Path -LiteralPath $initdb -PathType Leaf)) {
    throw 'PostgreSQL binaries are missing. Install embedded-postgres@17.10.0-beta.17 into the dedicated local directory.'
  }
  if (-not (Test-Path -LiteralPath $markerFile)) { Protect-NewClusterRoot }
  if (-not (Test-Path -LiteralPath $markerFile)) {
    if (Test-Path -LiteralPath $data) { throw 'Unowned data directory exists; initialization refused.' }
    if (Test-Path -LiteralPath $credentialFile) { throw 'Unowned credential file exists; initialization refused.' }
    $bytes = New-Object byte[] 32
    $random = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $random.GetBytes($bytes) } finally { $random.Dispose() }
    $password = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    $secure = ConvertTo-SecureString $password -AsPlainText -Force
    [Management.Automation.PSCredential]::new($owner, $secure) | Export-Clixml -LiteralPath $credentialFile
    $passwordFile = Join-Path $root 'initdb-password.tmp'
    try {
      [IO.File]::WriteAllText($passwordFile, $password + "`n", [Text.UTF8Encoding]::new($false))
      & $initdb -D $data -U $owner -A scram-sha-256 --pwfile=$passwordFile --encoding=UTF8 --no-instructions | Out-Null
      if ($LASTEXITCODE -ne 0) { throw 'initdb failed.' }
      @{ marker = $marker; root = $root; port = $port; owner = $owner } | ConvertTo-Json | Set-Content -LiteralPath $markerFile -Encoding utf8
    } finally {
      if (Test-Path -LiteralPath $passwordFile) { Remove-Item -LiteralPath $passwordFile -Force }
    }
  }
  Assert-OwnedCluster
  if (Test-Running) { Write-Output 'Accounts PostgreSQL is already running.'; return }
  if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    throw 'Dedicated PostgreSQL port is occupied by another process.'
  }
  # Detach the daemon's inherited handles from validation output pipelines.
  $startupLog = Join-Path $root 'postgresql.log'
  $startup = Start-Process -FilePath $control -ArgumentList @('-D', ('"' + $data + '"'), '-o', ('"-h 127.0.0.1 -p ' + $port + '"'), '-l', ('"' + $startupLog + '"'), '-w', 'start') -WindowStyle Hidden -PassThru
  # Start-Process -Wait waits for descendants too, including the persistent daemon.
  if (-not $startup.WaitForExit(30000)) { throw 'PostgreSQL control command did not finish within 30 seconds.' }
  if ($startup.ExitCode -ne 0 -or -not (Test-Running)) { throw 'PostgreSQL did not become ready.' }
  Write-Output 'Accounts PostgreSQL started on loopback.'
}

switch ($Action) {
  'Start' { Start-Cluster }
  'Status' {
    Assert-OwnedCluster
    if (Test-Running) { Write-Output 'Accounts PostgreSQL is running.' }
    else { Write-Output 'Accounts PostgreSQL is stopped.' }
  }
  'Stop' {
    Assert-OwnedCluster
    if (Test-Running) {
      & $control -D $data -m fast -w stop
      if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL stop failed.' }
    }
    Write-Output 'Accounts PostgreSQL is stopped; data was preserved.'
  }
  'Run' {
    Start-Cluster
    if (-not $Executable) { throw 'Run requires -Executable.' }
    $names = @('TEST_DATABASE_URL', 'DATABASE_URL', 'TEST_DATABASE_CONFIRMATION', 'IMP006_DATABASE_VARIABLE', 'IMP006_LOCAL_POSTGRESQL', 'E2E_USER_PASSWORD', 'JWT_SECRET', 'DASHBOARD_FIXTURE_CONFIRMATION', 'NODE_ENV', 'PLAYWRIGHT_BASE_URL', 'AUTH_HTTPS_E2E', 'ACCOUNTS_LOCAL_POSTGRESQL', 'ACCOUNTS_LOCAL_APP', 'IMP006_LOCAL_REGRESSION_PUBLIC', 'IMP006_TEST_SCHEMA', 'IMP006_UI_PASSWORD', 'ACCOUNT_REQUEST_KEY', 'ACCOUNT_E2E_EMAILS', 'ACCOUNT_TESTER_ALLOWLIST')
    $originalEnvironment = @{}
    foreach ($name in $names) {
      $item = Get-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
      $originalEnvironment[$name] = @{ existed = $null -ne $item; value = if ($item) { $item.Value } else { $null } }
    }
    try {
      $credential = Import-Clixml -LiteralPath $credentialFile
      if ($credential.UserName -ne $owner) { throw 'Owned PostgreSQL credential principal does not match.' }
      $password = $credential.GetNetworkCredential().Password
      $escaped = [Uri]::EscapeDataString($password)
      $connection = "postgresql://$owner`:$escaped@127.0.0.1`:$port/postgres"
      if ($DatabaseMode -eq 'Regression') {
        $readyFile = Join-Path $root 'regression-v2-ready.json'
        if (-not (Test-Path -LiteralPath $readyFile -PathType Leaf)) { throw 'Owned regression databases are not provisioned.' }
        $ready = Get-Content -LiteralPath $readyFile -Raw | ConvertFrom-Json
        if ($ready.marker -ne 'hidroflorestas:accounts-regression:v1' -or $ready.root -ne $root) { throw 'Regression database ownership marker does not match.' }
        $env:TEST_DATABASE_URL = $connection.Replace('/postgres', '/accounts_regression_test')
        $env:DATABASE_URL = $connection.Replace('/postgres', '/accounts_regression_reference')
        $digest = [Security.Cryptography.SHA256]::Create()
        try { $env:E2E_USER_PASSWORD = [Convert]::ToBase64String($digest.ComputeHash([Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString()))) }
        finally { $digest.Dispose() }
        $sessionBytes = New-Object byte[] 48
        $sessionRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
        try { $sessionRandom.GetBytes($sessionBytes); $env:JWT_SECRET = [Convert]::ToBase64String($sessionBytes) }
        finally { $sessionRandom.Dispose(); $sessionBytes = $null }
        $env:DASHBOARD_FIXTURE_CONFIRMATION = 'HIDROFLORESTAS_IMP007_TEST'
        # Separate durable rate-limit partitions per synthetic run, shared by its children.
        # This never changes the application's stored key or the private dotenv file.
        $requestBytes = New-Object byte[] 32
        $requestRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
        try { $requestRandom.GetBytes($requestBytes); $env:ACCOUNT_REQUEST_KEY = [Convert]::ToBase64String($requestBytes) }
        finally { $requestRandom.Dispose(); [Array]::Clear($requestBytes, 0, $requestBytes.Length); $requestBytes = $null }
        $env:ACCOUNT_E2E_EMAILS = (@(1, 2) | ForEach-Object { 'account-e2e-' + [guid]::NewGuid().ToString() + '@accounts-test.hidroflorestas.invalid' }) -join ','
        # Nonempty exact fixture recipients survive Next's dotenv loading. The
        # app, browser driver and guarded IPC worker inherit the same list.
        $env:ACCOUNT_TESTER_ALLOWLIST = $env:ACCOUNT_E2E_EMAILS
      } elseif ($DatabaseMode -eq 'Application') {
        $env:DATABASE_URL = $connection.Replace('/postgres', '/accounts_development')
        $env:ACCOUNTS_LOCAL_APP = '1'
      } else {
        $env:TEST_DATABASE_URL = $connection
        $env:DATABASE_URL = $connection
      }
      $env:TEST_DATABASE_CONFIRMATION = 'HIDROFLORESTAS_AUTH_TEST'
      $env:IMP006_DATABASE_VARIABLE = 'TEST_DATABASE_URL'
      $env:ACCOUNTS_LOCAL_POSTGRESQL = '1'
      Remove-Item -LiteralPath 'Env:IMP006_LOCAL_REGRESSION_PUBLIC' -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath 'Env:IMP006_TEST_SCHEMA' -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath 'Env:IMP006_UI_PASSWORD' -ErrorAction SilentlyContinue
      if ($DatabaseMode -eq 'Application') {
        Remove-Item -LiteralPath 'Env:TEST_DATABASE_URL','Env:IMP006_LOCAL_POSTGRESQL','Env:IMP006_DATABASE_VARIABLE','Env:TEST_DATABASE_CONFIRMATION' -ErrorAction SilentlyContinue
      } else {
        $env:IMP006_LOCAL_POSTGRESQL = '1'
        Remove-Item -LiteralPath 'Env:ACCOUNTS_LOCAL_APP' -ErrorAction SilentlyContinue
      }
      $env:NODE_ENV = if ($DatabaseMode -eq 'Application') { 'development' } else { 'test' }
      Remove-Item -LiteralPath 'Env:PLAYWRIGHT_BASE_URL' -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath 'Env:AUTH_HTTPS_E2E' -ErrorAction SilentlyContinue
      & $Executable @CommandArguments
      if ($LASTEXITCODE -ne 0) { throw "Test command failed with exit code $LASTEXITCODE." }
    } finally {
      try {
        foreach ($name in $names) {
          if ($originalEnvironment[$name].existed) { Set-Item -LiteralPath "Env:$name" -Value $originalEnvironment[$name].value }
          else { Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue }
        }
      } finally {
        $password = $null
        $connection = $null
        $escaped = $null
        $credential = $null
      }
    }
  }
  'Dispose' {
    Assert-OwnedCluster
    if (Test-Running) {
      & $control -D $data -m fast -w stop
      if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL stop failed; disposal refused.' }
    }
    if (Test-Running) { throw 'PostgreSQL is still running; disposal refused.' }
    if ([IO.Path]::GetFullPath($root) -ne [IO.Path]::GetFullPath((Join-Path $parent 'accounts-postgresql'))) {
      throw 'Cluster disposal path differs from the dedicated path.'
    }
    Remove-Item -LiteralPath $root -Recurse -Force
    if (Test-Path -LiteralPath $root) { throw 'Cluster disposal could not be verified.' }
    Write-Output 'Accounts local PostgreSQL cluster and binaries were disposed.'
  }
}
