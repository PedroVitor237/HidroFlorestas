param([Parameter(Mandatory=$true)][ValidateSet('Unit','Mail','R1','Integration','Contract','Migration','RegressionSetup','E2E','Https','Typecheck','Lint','Build','Smoke','CleanInstall')][string]$Gate)
$ErrorActionPreference = 'Stop'
$outputRoot = Join-Path (Get-Location) '.mail-validation'
[void](New-Item -ItemType Directory -Path $outputRoot -Force)
$scriptName = @{Unit='test:unit';Mail='test:mail:unit';R1='test:mail:r1';Integration='test:integration';Contract='test:contract';Migration='test:migration';RegressionSetup='regression-setup';E2E='test:e2e';Https='test:e2e:https';Typecheck='typecheck';Lint='lint';Build='build';Smoke='mail:smoke';CleanInstall='clean-install'}[$Gate]
$arguments = @('--import=tsx','scripts/mail-gate-runner.ts',$Gate,$outputRoot,$scriptName)
if ($Gate -in @('Contract','Migration','Build','RegressionSetup')) {
  & (Join-Path $PSScriptRoot 'imp006-local-postgresql.ps1') -Action Run -Executable node -CommandArguments $arguments
} elseif ($Gate -in @('R1','Integration','E2E','Https')) {
  & (Join-Path $PSScriptRoot 'imp006-local-postgresql.ps1') -Action Run -DatabaseMode Regression -Executable node -CommandArguments $arguments
} else { & node @arguments }
exit $LASTEXITCODE
