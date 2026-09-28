$ErrorActionPreference = 'Stop'

$names = @('JWT_SECRET', 'DASHBOARD_FIXTURE_CONFIRMATION', 'IMP006_LOCAL_REGRESSION_PUBLIC')
$originalEnvironment = @{}
foreach ($name in $names) {
  $item = Get-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
  $originalEnvironment[$name] = @{ existed = $null -ne $item; value = if ($item) { $item.Value } else { $null } }
}

$random = [Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 48
try {
  $random.GetBytes($bytes)
  $env:JWT_SECRET = [Convert]::ToBase64String($bytes)
  $env:DASHBOARD_FIXTURE_CONFIRMATION = 'HIDROFLORESTAS_IMP007_TEST'
  $env:IMP006_LOCAL_REGRESSION_PUBLIC = '1'
  & (Join-Path $PSScriptRoot 'imp006-local-postgresql.ps1') -Action Run -DatabaseMode Regression -Executable npx -CommandArguments @(
    'playwright', 'test',
    'tests/e2e/collection-registration.spec.ts',
    'tests/e2e/environmental-data-registration.spec.ts',
    'tests/e2e/environmental-data-read.spec.ts',
    'tests/e2e/territorial-map.spec.ts',
    '--config=playwright.config.ts'
  )
} finally {
  foreach ($name in $names) {
    if ($originalEnvironment[$name].existed) { Set-Item -LiteralPath "Env:$name" -Value $originalEnvironment[$name].value }
    else { Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue }
  }
  [Array]::Clear($bytes, 0, $bytes.Length)
  $random.Dispose()
}
