param([Parameter(Mandatory=$true)][ValidateSet('Unit','Mail','R1','Integration','Contract','Migration','RegressionSetup','E2E','Https','Typecheck','Lint','Build','Smoke','CleanInstall','SchemaAudit','Bootstrap')][string]$Gate)
$ErrorActionPreference = 'Stop'
$outputRoot = Join-Path (Get-Location) '.accounts-validation'
[void](New-Item -ItemType Directory -Path $outputRoot -Force)
$scriptName = @{Unit='test:unit';Mail='test:mail:unit';R1='test:mail:r1';Integration='test:integration';Contract='test:contract';Migration='test:migration';RegressionSetup='regression-setup';E2E='test:e2e';Https='test:e2e:https';Typecheck='typecheck';Lint='lint';Build='build';Smoke='mail:smoke';CleanInstall='clean-install';SchemaAudit='test:ihfr:audit:assert-zero'}[$Gate]
if ($Gate -eq 'Bootstrap') {
  & (Join-Path $PSScriptRoot 'accounts-local-postgresql.ps1') -Action Run -Executable node -CommandArguments @('--import=tsx','scripts/mail-gate-runner.ts',$Gate,$outputRoot,'accounts-bootstrap')
} else {
  $arguments = @('--import=tsx','scripts/mail-gate-runner.ts',$Gate,$outputRoot,$scriptName)
  $databaseMode = if ($Gate -in @('R1','Integration','E2E','Https','SchemaAudit')) { 'Regression' } else { 'Schema' }
  & (Join-Path $PSScriptRoot 'accounts-local-postgresql.ps1') -Action Run -DatabaseMode $databaseMode -Executable node -CommandArguments $arguments
}
exit $LASTEXITCODE
