param(
  [Parameter(Mandatory = $true)]
  [string] $OutputPath
)

$ErrorActionPreference = 'Stop'
$rsa = [System.Security.Cryptography.RSA]::Create(2048)
try {
  $request = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
    'CN=localhost',
    $rsa,
    [System.Security.Cryptography.HashAlgorithmName]::SHA256,
    [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
  )
  $subjectAlternativeNames = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
  $subjectAlternativeNames.AddDnsName('localhost')
  $subjectAlternativeNames.AddIpAddress([System.Net.IPAddress]::Parse('127.0.0.1'))
  $request.CertificateExtensions.Add($subjectAlternativeNames.Build())
  $request.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $true)
  )
  $serverAuthentication = [System.Security.Cryptography.OidCollection]::new()
  [void] $serverAuthentication.Add([System.Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.1'))
  $request.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension]::new($serverAuthentication, $true)
  )

  $now = [DateTimeOffset]::UtcNow
  $certificate = $request.CreateSelfSigned($now.AddMinutes(-5), $now.AddDays(1))
  try {
    [System.IO.File]::WriteAllBytes(
      $OutputPath,
      $certificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx, '')
    )
  } finally {
    $certificate.Dispose()
  }
} finally {
  $rsa.Dispose()
}
