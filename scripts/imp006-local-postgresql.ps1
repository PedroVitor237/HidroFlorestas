param(
  [ValidateSet('Start', 'Stop', 'Status', 'Run', 'Dispose')]
  [string] $Action = 'Status',
  [ValidateSet('Schema', 'Regression')]
  [string] $DatabaseMode = 'Schema',
  [string] $Executable,
  [string[]] $CommandArguments = @()
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas\imp006-postgresql'))
$parent = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas'))
$data = Join-Path $root 'data'
$markerFile = Join-Path $root 'cluster-owner.json'
$credentialFile = Join-Path $root 'cluster-credential.clixml'
$bin = Join-Path $root 'node_modules\@embedded-postgres\windows-x64\native\bin'
$control = Join-Path $bin 'pg_ctl.exe'
$initdb = Join-Path $bin 'initdb.exe'
$port = 55426
$owner = 'imp006_owner'
$marker = 'hidroflorestas:imp006-local-postgresql:v1'

if (-not $root.StartsWith($parent + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Cluster path is outside the dedicated local directory.'
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
}

function Test-Running {
  & $control -D $data status *> $null
  return $LASTEXITCODE -eq 0
}

function Start-Cluster {
  if (-not (Test-Path -LiteralPath $control -PathType Leaf) -or -not (Test-Path -LiteralPath $initdb -PathType Leaf)) {
    throw 'PostgreSQL binaries are missing. Install embedded-postgres@17.10.0-beta.17 into the dedicated local directory.'
  }
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
  if (Test-Running) { Write-Output 'IMP-006 PostgreSQL is already running.'; return }
  if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    throw 'Dedicated PostgreSQL port is occupied by another process.'
  }
  & $control -D $data -o "-h 127.0.0.1 -p $port" -l (Join-Path $root 'postgresql.log') -w start
  if ($LASTEXITCODE -ne 0 -or -not (Test-Running)) { throw 'PostgreSQL did not become ready.' }
  Write-Output 'IMP-006 PostgreSQL started on loopback.'
}

switch ($Action) {
  'Start' { Start-Cluster }
  'Status' {
    Assert-OwnedCluster
    if (Test-Running) { Write-Output 'IMP-006 PostgreSQL is running.' }
    else { Write-Output 'IMP-006 PostgreSQL is stopped.' }
  }
  'Stop' {
    Assert-OwnedCluster
    if (Test-Running) {
      & $control -D $data -m fast -w stop
      if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL stop failed.' }
    }
    Write-Output 'IMP-006 PostgreSQL is stopped; data was preserved.'
  }
  'Run' {
    Start-Cluster
    if (-not $Executable) { throw 'Run requires -Executable.' }
    $names = @('TEST_DATABASE_URL', 'DATABASE_URL', 'TEST_DATABASE_CONFIRMATION', 'IMP006_DATABASE_VARIABLE', 'IMP006_LOCAL_POSTGRESQL', 'E2E_USER_PASSWORD', 'JWT_SECRET', 'DASHBOARD_FIXTURE_CONFIRMATION', 'NODE_ENV', 'PLAYWRIGHT_BASE_URL', 'AUTH_HTTPS_E2E')
    $originalEnvironment = @{}
    foreach ($name in $names) {
      $item = Get-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
      $originalEnvironment[$name] = @{ existed = $null -ne $item; value = if ($item) { $item.Value } else { $null } }
    }
    try {
      $credential = Import-Clixml -LiteralPath $credentialFile
      $password = $credential.GetNetworkCredential().Password
      $escaped = [Uri]::EscapeDataString($password)
      $connection = "postgresql://$owner`:$escaped@127.0.0.1`:$port/postgres"
      if ($DatabaseMode -eq 'Regression') {
        $readyFile = Join-Path $root 'regression-v2-ready.json'
        if (-not (Test-Path -LiteralPath $readyFile -PathType Leaf)) { throw 'Owned regression databases are not provisioned.' }
        $ready = Get-Content -LiteralPath $readyFile -Raw | ConvertFrom-Json
        if ($ready.marker -ne 'hidroflorestas:imp006-regression:v2' -or $ready.root -ne $root) { throw 'Regression database ownership marker does not match.' }
        $env:TEST_DATABASE_URL = $connection.Replace('/postgres', '/imp006_regression_v2_test')
        $env:DATABASE_URL = $connection.Replace('/postgres', '/imp006_regression_v2_reference')
        $digest = [Security.Cryptography.SHA256]::Create()
        try { $env:E2E_USER_PASSWORD = [Convert]::ToBase64String($digest.ComputeHash([Text.Encoding]::UTF8.GetBytes([guid]::NewGuid().ToString()))) }
        finally { $digest.Dispose() }
        $sessionBytes = New-Object byte[] 48
        $sessionRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
        try { $sessionRandom.GetBytes($sessionBytes); $env:JWT_SECRET = [Convert]::ToBase64String($sessionBytes) }
        finally { $sessionRandom.Dispose(); $sessionBytes = $null }
        $env:DASHBOARD_FIXTURE_CONFIRMATION = 'HIDROFLORESTAS_IMP007_TEST'
      } else {
        $env:TEST_DATABASE_URL = $connection
        $env:DATABASE_URL = $connection
      }
      $env:TEST_DATABASE_CONFIRMATION = 'HIDROFLORESTAS_AUTH_TEST'
      $env:IMP006_DATABASE_VARIABLE = 'TEST_DATABASE_URL'
      $env:IMP006_LOCAL_POSTGRESQL = '1'
      $env:NODE_ENV = 'test'
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
    if ([IO.Path]::GetFullPath($root) -ne [IO.Path]::GetFullPath((Join-Path $parent 'imp006-postgresql'))) {
      throw 'Cluster disposal path differs from the dedicated path.'
    }
    Remove-Item -LiteralPath $root -Recurse -Force
    if (Test-Path -LiteralPath $root) { throw 'Cluster disposal could not be verified.' }
    Write-Output 'IMP-006 local PostgreSQL cluster and binaries were disposed.'
  }
}
