param()

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$privateRoot = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas\accounts-homologation'))
$expectedParent = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'HidroFlorestas'))
if (-not $privateRoot.StartsWith($expectedParent + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Private configuration path is outside the dedicated directory.'
}
$markerFile = Join-Path $privateRoot 'owner.json'
$marker = 'hidroflorestas:accounts-homologation-private:v1'
if (Test-Path -LiteralPath $privateRoot) {
  if ((Get-Item -LiteralPath $privateRoot).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Private configuration directory is a reparse point.' }
  if (Test-Path -LiteralPath $markerFile) {
    $priorOwner = Get-Content -Encoding UTF8 -LiteralPath $markerFile -Raw | ConvertFrom-Json
    if ($priorOwner.marker -ne $marker -or $priorOwner.root -ne $privateRoot) { throw 'Private configuration ownership differs.' }
  } elseif (@(Get-ChildItem -LiteralPath $privateRoot -Force).Count -ne 0) {
    throw 'Existing unowned private configuration directory is not empty.'
  }
} else { [void](New-Item -ItemType Directory -Path $privateRoot) }
$privatePrincipal = [Security.Principal.WindowsIdentity]::GetCurrent().Name
& icacls $privateRoot /inheritance:r /grant:r ($privatePrincipal + ':(OI)(CI)(F)') 'SYSTEM:(OI)(CI)(F)' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Private configuration ACL failed.' }
@{ marker=$marker; root=$privateRoot } | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath $markerFile

$form = New-Object Windows.Forms.Form
$form.Text = 'HidroFlorestas — configuração privada de homologação'
$form.ClientSize = New-Object Drawing.Size(670, 530)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.MinimizeBox = $false

function Add-Label([string]$text, [int]$y, [int]$height) {
  $label = New-Object Windows.Forms.Label
  $label.Text = $text
  $label.Location = New-Object Drawing.Point(24, $y)
  $label.Size = New-Object Drawing.Size(622, $height)
  $form.Controls.Add($label)
}
Add-Label 'Destinos e políticas já aprovados no checkpoint. Esta janela grava dados somente no diretório privado de homologação. Não envie credenciais nem endereços pelo chat.' 20 45
Add-Label 'Caixas autorizadas para os testes (uma por linha ou separadas por vírgula). O domínio pode ser qualquer provedor de e-mail.' 75 40
$testers = New-Object Windows.Forms.TextBox
$testers.Multiline = $true
$testers.ScrollBars = 'Vertical'
$testers.Location = New-Object Drawing.Point(24, 119)
$testers.Size = New-Object Drawing.Size(622, 110)
$form.Controls.Add($testers)

$confirmed = New-Object Windows.Forms.CheckBox
$confirmed.Text = 'Autorizo mensagens sintéticas de cadastro/verificação/reset para essas caixas.'
$confirmed.Location = New-Object Drawing.Point(24, 238)
$confirmed.Size = New-Object Drawing.Size(622, 25)
$form.Controls.Add($confirmed)

Add-Label 'Chave de API do cron-job.org (entrada mascarada). Obtenha no painel oficial após login. O agente fará a configuração do job; esta chave nunca irá para a aplicação.' 278 44
$schedulerKey = New-Object Windows.Forms.TextBox
$schedulerKey.UseSystemPasswordChar = $true
$schedulerKey.Location = New-Object Drawing.Point(24, 326)
$schedulerKey.Size = New-Object Drawing.Size(622, 26)
$schedulerKey.MaxLength = 512
$form.Controls.Add($schedulerKey)

$openConsole = New-Object Windows.Forms.Button
$openConsole.Text = 'Abrir painel oficial cron-job.org'
$openConsole.Location = New-Object Drawing.Point(24, 366)
$openConsole.Size = New-Object Drawing.Size(280, 32)
$openConsole.Add_Click({ Start-Process -FilePath 'https://console.cron-job.org/' })
$form.Controls.Add($openConsole)

Add-Label 'A chave será protegida por DPAPI/ACL no Windows. Nenhuma senha Google é solicitada. Aceitação SMTP e recebimento humano serão comprovados separadamente.' 409 42
$resultLabel = New-Object Windows.Forms.Label
$resultLabel.Location = New-Object Drawing.Point(24, 454)
$resultLabel.Size = New-Object Drawing.Size(622, 24)
$form.Controls.Add($resultLabel)

$save = New-Object Windows.Forms.Button
$save.Text = 'Salvar configuração privada'
$save.Location = New-Object Drawing.Point(355, 486)
$save.Size = New-Object Drawing.Size(291, 32)
$form.Controls.Add($save)
$save.Add_Click({
  try {
    $boxes = @($testers.Text -split '[,\r\n]+' | ForEach-Object { $_.Trim().ToLowerInvariant() } | Where-Object { $_ } | Select-Object -Unique)
    if ($boxes.Count -lt 1 -or $boxes.Count -gt 20 -or -not $confirmed.Checked) { throw 'Informe de uma a vinte caixas autorizadas e marque a autorização.' }
    foreach ($box in $boxes) {
      if ($box.Length -gt 254 -or $box -notmatch "^[A-Za-z0-9.!#`$%&'*+/=?^_``{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$") {
        throw 'Há um endereço inválido. Confira os campos sem enviá-los pelo chat.'
      }
    }
    $secretText = $schedulerKey.Text.Trim()
    if ($secretText.Length -lt 20 -or $secretText -match '\s') { throw 'Informe a chave de API no campo mascarado do painel autorizado.' }
    $secure = ConvertTo-SecureString $secretText -AsPlainText -Force
    [Management.Automation.PSCredential]::new('cron-job.org-accounts-worker', $secure) | Export-Clixml -LiteralPath (Join-Path $privateRoot 'scheduler-credential.clixml')
    @{ marker=$marker; authorized=$true; addresses=$boxes; savedUtc=[DateTime]::UtcNow.ToString('o') } | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $privateRoot 'testers.json')
    @{ marker=$marker; configured=$true; recipientCount=$boxes.Count; schedulerKeyPresent=$true; savedUtc=[DateTime]::UtcNow.ToString('o') } | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $privateRoot 'setup-status.json')
    $schedulerKey.Clear()
    $secretText = $null
    $resultLabel.Text = 'Configuração salva privadamente. Nenhum envio foi realizado por esta janela.'
    $form.DialogResult = [Windows.Forms.DialogResult]::OK
    $form.Close()
  } catch {
    $resultLabel.Text = if ($_.Exception.Message -match 'Informe|endereço|Confira') { $_.Exception.Message } else { 'Falha ao salvar. Dados e detalhes privados não foram registrados.' }
  } finally { $secretText = $null; $secure = $null }
})

[void]$form.ShowDialog()
$schedulerKey.Clear()
$testers.Clear()
$form.Dispose()
