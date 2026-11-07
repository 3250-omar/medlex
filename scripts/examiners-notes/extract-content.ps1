param(
  [Parameter(Mandatory = $true)][string]$DocumentPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($DocumentPath)
try {
  $reader = [System.IO.StreamReader]::new($archive.GetEntry('word/document.xml').Open())
  try { [xml]$document = $reader.ReadToEnd() } finally { $reader.Dispose() }
  $ns = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
  $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
  $paragraphs = @($document.SelectNodes('//w:p', $ns) | ForEach-Object {
    ($_.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.InnerText }) -join ''
  } | Where-Object { $_ -ne '' })
  $messages = @()
  for ($number = 1; $number -le 4; $number++) {
    $start = -1
    for ($i = 0; $i -lt $paragraphs.Count; $i++) {
      if ($paragraphs[$i] -eq "Email $number" -and $i + 2 -lt $paragraphs.Count -and $paragraphs[$i + 2].StartsWith('SUBJECT')) { $start = $i; break }
    }
    if ($start -lt 0) { throw "Email $number not found" }
    $end = $start + 4
    while ($end -lt $paragraphs.Count -and -not ($paragraphs[$end] -match '^You are receiving this as a member')) { $end++ }
    if ($end -ge $paragraphs.Count) { throw "Email $number footer not found" }
    $messages += [ordered]@{
      sequence = $number
      subject = $paragraphs[$start + 2] -replace '^SUBJECT\s+', ''
      preview = $paragraphs[$start + 3] -replace '^PREVIEW\s+', ''
      paragraphs = @($paragraphs[($start + 4)..$end])
    }
  }
  $json = ConvertTo-Json -InputObject $messages -Depth 5
  [IO.File]::WriteAllText($OutputPath, $json + "`n", [Text.UTF8Encoding]::new($false))
} finally { $archive.Dispose() }
