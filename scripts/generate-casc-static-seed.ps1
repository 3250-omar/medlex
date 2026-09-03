param(
  [string]$ZipPath = 'C:\Users\Omar Mostafa\Downloads\CASC_Academy 2.zip',
  [string]$OutputPath = 'E:\freelancing\medlex\supabase\migrations\0006_seed_casc_academy_static.sql'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-EntryText([IO.Compression.ZipArchiveEntry]$Entry) {
  $reader = [IO.StreamReader]::new($Entry.Open(), [Text.Encoding]::UTF8, $true)
  try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function HtmlToText([string]$Html) {
  $value = [regex]::Replace($Html, '<[^>]+>', ' ')
  $value = [Net.WebUtility]::HtmlDecode($value)
  return [regex]::Replace($value, '\s+', ' ').Trim()
}

function SqlLiteral([string]$Value) {
  return "'" + $Value.Replace("'", "''") + "'"
}

if (-not (Test-Path -LiteralPath $ZipPath)) { throw "ZIP not found: $ZipPath" }

$archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
  $pages = @($archive.Entries | Where-Object { $_.FullName -match '^\d{2}_.*\.html$' } | Sort-Object FullName)
  if ($pages.Count -ne 52) { throw "Expected 52 HTML pages; found $($pages.Count)" }

  $sql = [Collections.Generic.List[string]]::new()
  $sql.Add('-- Generated from CASC_Academy 2.zip. Static HTML only; scripts, styles, and embedded images are removed.')
  $sql.Add('do $$')
  $sql.Add('declare v_course_id uuid; v_release_id uuid;')
  $sql.Add('begin')
  $sql.Add("  insert into public.courses (slug, title_en, description_en, price, access_duration_days, points_on_completion, is_published)")
  $sql.Add("  values ('casc-academy', 'The CASC Academy', 'Self-paced preparation for the MRCPsych CASC examination.', 0, 365, 100, true)")
  $sql.Add('  on conflict (slug) do update set is_published = excluded.is_published returning id into v_course_id;')
  $sql.Add("  if v_course_id is null then select id into v_course_id from public.courses where slug = 'casc-academy'; end if;")
  $sql.Add("  insert into public.course_releases (course_id, version_number, status, published_at, settings)")
  $sql.Add("  values (v_course_id, 1, 'published', now(), jsonb_build_object('source', 'CASC_Academy 2.zip', 'content_mode', 'static_html'))")
  $sql.Add('  on conflict (course_id, version_number) do update set status = excluded.status, published_at = excluded.published_at')
  $sql.Add('  returning id into v_release_id;')
  $sql.Add("  if v_release_id is null then select id into v_release_id from public.course_releases where course_id = v_course_id and version_number = 1; end if;")

  $currentDomainKey = $null
  foreach ($entry in $pages) {
    $html = Get-EntryText $entry
    $bodyMatch = [regex]::Match($html, '(?is)<body[^>]*>(.*?)</body>')
    if (-not $bodyMatch.Success) { throw "Body not found: $($entry.FullName)" }
    $body = $bodyMatch.Groups[1].Value
    $body = [regex]::Replace($body, '(?is)<script\b.*?</script>', '')
    $body = [regex]::Replace($body, '(?is)<style\b.*?</style>', '')
    $body = [regex]::Replace($body, '(?is)<img\b[^>]*>', '')
    $body = [regex]::Replace($body, '(?is)\s+on\w+\s*=\s*("[^"]*"|''[^'']*'')', '')
    $titleMatch = [regex]::Match($body, '(?is)<h1[^>]*>(.*?)</h1>')
    $title = if ($titleMatch.Success) { HtmlToText $titleMatch.Groups[1].Value } else { $entry.FullName }
    $base = [IO.Path]::GetFileNameWithoutExtension($entry.FullName)
    $sequence = [int]$base.Substring(0, 2)
    $sourceKey = $base
    $slug = ($base -replace '^\d{2}_', '').ToLowerInvariant() -replace '_', '-'
    $unitKind = if ($base -like '00_*') { 'orientation' } elseif ($base -like '*_Domain_*') { 'module_hub' } else { 'station' }
    $unitCode = if ($base -match 'Station_(\d+\.\d+)') { $Matches[1] } else { $null }
    if ($unitKind -eq 'module_hub') { $currentDomainKey = $sourceKey }
    $parentSql = if ($unitKind -eq 'station' -and $currentDomainKey) { "(select id from public.learning_units where release_id = v_release_id and source_key = $(SqlLiteral $currentDomainKey))" } else { 'null' }
    $unitCodeSql = if ($unitCode) { SqlLiteral $unitCode } else { 'null' }
    $bodySql = SqlLiteral $body
    $sql.Add("  insert into public.learning_units (release_id, parent_unit_id, unit_kind_id, source_key, slug, unit_code, sequence_number, position_in_parent, title, is_published, metadata)")
    $sql.Add("  values (v_release_id, $parentSql, (select id from public.learning_unit_kinds where key = $(SqlLiteral $unitKind)), $(SqlLiteral $sourceKey), $(SqlLiteral $slug), $unitCodeSql, $sequence, $sequence, $(SqlLiteral $title), true, jsonb_build_object('source_filename', $(SqlLiteral $entry.FullName)))")
    $sql.Add('  on conflict (release_id, source_key) do update set title = excluded.title, is_published = true;')
    $sql.Add("  insert into public.content_blocks (unit_id, source_key, block_type, sort_order, content)")
    $sql.Add("  values ((select id from public.learning_units where release_id = v_release_id and source_key = $(SqlLiteral $sourceKey)), 'static-html', 'legacy_static_html', 0, jsonb_build_object('html', $bodySql))")
    $sql.Add('  on conflict (unit_id, source_key) do update set content = excluded.content;')
  }
  $sql.Add('end $$;')
  $sql.Add('')
  [IO.File]::WriteAllLines($OutputPath, $sql, [Text.UTF8Encoding]::new($false))
  Write-Host "Generated $OutputPath with $($pages.Count) static pages."
} finally {
  $archive.Dispose()
}
