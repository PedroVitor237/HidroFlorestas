$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'imp006-local-postgresql.ps1'
$shellExecutable = (Get-Process -Id $PID).Path
$names = @(
  'TEST_DATABASE_URL', 'DATABASE_URL', 'TEST_DATABASE_CONFIRMATION',
  'IMP006_DATABASE_VARIABLE', 'IMP006_LOCAL_POSTGRESQL',
  'E2E_USER_PASSWORD', 'NODE_ENV'
)

function Save-Environment {
  $saved = @{}
  foreach ($name in $names) {
    $item = Get-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
    $saved[$name] = @{ existed = $null -ne $item; value = if ($item) { $item.Value } else { $null } }
  }
  return $saved
}

function Restore-Environment($saved) {
  foreach ($name in $names) {
    if ($saved[$name].existed) { Set-Item -LiteralPath "Env:$name" -Value $saved[$name].value }
    else { Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue }
  }
}

function Assert-Environment($expected) {
  foreach ($name in $names) {
    $item = Get-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue
    if (($null -ne $item) -ne $expected[$name].existed -or ($item -and $item.Value -cne $expected[$name].value)) {
      throw "IMP-006 Run changed the prior state of $name."
    }
  }
}

$initial = Save-Environment
try {
  foreach ($name in $names) { Set-Item -LiteralPath "Env:$name" -Value "imp006-smoke-$name" }
  $sentinels = Save-Environment
  & $runner -Action Run -DatabaseMode Schema -Executable $shellExecutable -CommandArguments @('-NoProfile', '-NonInteractive', '-Command', 'exit 0') | Out-Null
  Assert-Environment $sentinels

  foreach ($name in $names) { Remove-Item -LiteralPath "Env:$name" -ErrorAction SilentlyContinue }
  $absent = Save-Environment
  $failedAsExpected = $false
  try {
    & $runner -Action Run -DatabaseMode Schema -Executable $shellExecutable -CommandArguments @('-NoProfile', '-NonInteractive', '-Command', 'exit 7') | Out-Null
  } catch { $failedAsExpected = $true }
  if (-not $failedAsExpected) { throw 'IMP-006 Run did not propagate a child command failure.' }
  Assert-Environment $absent
  Write-Output 'IMP-006 Run restored present and absent process variables after success and failure.'
} finally {
  Restore-Environment $initial
}
