param(
  [string]$ZipPath = 'C:\Users\Omar Mostafa\Downloads\CASC_Academy 2.zip',
  [string]$OutputPath = 'E:\freelancing\medlex\supabase\migrations\0007_seed_casc_assessments.sql'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-EntryText($Entry) {
  $reader = [IO.StreamReader]::new($Entry.Open(), [Text.Encoding]::UTF8, $true)
  try { $reader.ReadToEnd() } finally { $reader.Dispose() }
}
function Text([string]$Html) {
  $value = [regex]::Replace($Html, '<[^>]+>', ' ')
  $value = [Net.WebUtility]::HtmlDecode($value)
  [regex]::Replace($value, '\s+', ' ').Trim()
}
function Sql([string]$Value) { "'" + $Value.Replace("'", "''") + "'" }
function Parse-Exam([string]$Html) {
  $match = [regex]::Match($Html, '(?is)var EXAM\s*=\s*(\[.*?\])\s*;\s*var examAnswers')
  if (-not $match.Success) { return @() }
  $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($match.Groups[1].Value))
  $node = "const acorn=require('acorn');const s=Buffer.from(process.argv[1],'base64').toString();const a=acorn.parse('('+s+')',{ecmaVersion:'latest'}).body[0].expression;const v=n=>n.type==='Literal'?n.value:n.type==='ArrayExpression'?n.elements.map(v):n.type==='ObjectExpression'?Object.fromEntries(n.properties.map(p=>[p.key.name||p.key.value,v(p.value)])):null;process.stdout.write(JSON.stringify(v(a)));"
  $json = & node -e $node $encoded
  if ($LASTEXITCODE -ne 0) { throw 'Unable to parse EXAM array with acorn' }
  @($json | ConvertFrom-Json)
}
function Add-Assessment([Collections.Generic.List[string]]$SqlLines, [string]$UnitKey, [string]$Kind, [string]$SourceKey, [int]$Duration, [int]$PassScore, [bool]$Critical, [bool]$Shuffle, [bool]$Retry, [string]$Feedback) {
  $durationSql = if ($Duration -gt 0) { $Duration } else { 'null' }
  $passSql = if ($PassScore -ge 0) { $PassScore } else { 'null' }
  $SqlLines.Add("  insert into public.assessments (unit_id, assessment_kind_id, source_key, duration_seconds, pass_score, require_all_critical, shuffle_options, allow_retry_per_question, feedback_policy)")
  $SqlLines.Add("  values ((select u.id from public.learning_units u where u.release_id = v_release_id and u.source_key = $(Sql $UnitKey)), (select id from public.assessment_kinds where key = $(Sql $Kind)), $(Sql $SourceKey), $durationSql, $passSql, $($Critical.ToString().ToLower()), $($Shuffle.ToString().ToLower()), $($Retry.ToString().ToLower()), $(Sql $Feedback))")
  $SqlLines.Add('  on conflict (unit_id, source_key) do nothing;')
}
function Add-Question([Collections.Generic.List[string]]$SqlLines, [string]$UnitKey, [string]$AssessmentKey, [int]$Index, [string]$Stem, [string]$Explanation, [bool]$Critical, [string]$CriticalLabel, $Options, [int]$CorrectIndex) {
  $questionKey = "q-$Index"
  $labelSql = if ($CriticalLabel) { Sql $CriticalLabel } else { 'null' }
  $SqlLines.Add("  insert into public.assessment_questions (assessment_id, question_kind_id, source_key, sort_order, is_critical, critical_label, stem, explanation)")
  $SqlLines.Add("  values ((select a.id from public.assessments a join public.learning_units u on u.id = a.unit_id where u.release_id = v_release_id and u.source_key = $(Sql $UnitKey) and a.source_key = $(Sql $AssessmentKey)), (select id from public.question_kinds where key = 'single_choice'), $(Sql $questionKey), $Index, $($Critical.ToString().ToLower()), $labelSql, $(Sql $Stem), $(Sql $Explanation))")
  $SqlLines.Add('  on conflict (assessment_id, source_key) do nothing;')
  for ($i = 0; $i -lt $Options.Count; $i++) {
    $option = $Options[$i]
    $feedbackSql = if ($option.feedback) { Sql $option.feedback } else { 'null' }
    $SqlLines.Add("  insert into public.answer_options (question_id, source_key, sort_order, option_text, feedback)")
    $SqlLines.Add("  values ((select q.id from public.assessment_questions q join public.assessments a on a.id = q.assessment_id join public.learning_units u on u.id = a.unit_id where u.release_id = v_release_id and u.source_key = $(Sql $UnitKey) and a.source_key = $(Sql $AssessmentKey) and q.source_key = $(Sql $questionKey)), $(Sql "option-$i"), $i, $(Sql $option.text), $feedbackSql)")
    $SqlLines.Add('  on conflict (question_id, source_key) do nothing;')
  }
  $SqlLines.Add("  insert into private.question_answer_keys (question_id, correct_option_id)")
  $SqlLines.Add("  select q.id, o.id from public.assessment_questions q join public.assessments a on a.id = q.assessment_id join public.learning_units u on u.id = a.unit_id join public.answer_options o on o.question_id = q.id and o.source_key = $(Sql "option-$CorrectIndex") where u.release_id = v_release_id and u.source_key = $(Sql $UnitKey) and a.source_key = $(Sql $AssessmentKey) and q.source_key = $(Sql $questionKey)")
  $SqlLines.Add('  on conflict (question_id) do update set correct_option_id = excluded.correct_option_id;')
}

$archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
  $pages = @($archive.Entries | Where-Object { $_.FullName -match '^\d{2}_.*\.html$' } | Sort-Object FullName)
  if ($pages.Count -ne 52) { throw "Expected 52 academy pages; found $($pages.Count)" }
  $lines = [Collections.Generic.List[string]]::new()
  $lines.Add('-- Generated assessment seed from CASC Academy source. Correct options remain private.')
  $lines.Add('do $$ declare v_release_id uuid; begin')
  $lines.Add("  select cr.id into v_release_id from public.course_releases cr join public.courses c on c.id = cr.course_id where c.slug = 'casc-academy' and cr.version_number = 1;")
  $lines.Add("  if v_release_id is null then raise exception 'CASC release 1 is required before assessment seed'; end if;")
  foreach ($entry in $pages) {
    $html = Get-EntryText $entry
    $unitKey = [IO.Path]::GetFileNameWithoutExtension($entry.FullName)
    $isStation = $entry.FullName -match '^\d{2}_Station_'
    $learnAssessmentKey = if ($isStation) { 'learn' } else { 'gate' }
    if ($isStation) {
      Add-Assessment $lines $unitKey 'learn_decision' 'learn' 0 -1 $false $true $true 'after_answer'
      Add-Assessment $lines $unitKey 'timed_exam' 'exam' 420 5 $true $true $false 'after_submit'
    } else {
      Add-Assessment $lines $unitKey 'knowledge_check' 'gate' 0 -1 $false $true $true 'after_answer'
    }
    $matches = [regex]::Matches($html, '(?is)<div class="q" data-q>(.*?)<div class="fbs">')
    $qi = 0
    foreach ($match in $matches) {
      $chunk = $match.Groups[1].Value
      $stemMatch = [regex]::Match($chunk, '(?is)<(?:h3|p class="stem")[^>]*>(.*?)</(?:h3|p)>')
      if (-not $stemMatch.Success) { continue }
      $options = @()
      $correct = -1
      $optionMatches = [regex]::Matches($chunk, '(?is)<button class="opt"([^>]*)>(.*?)</button>')
      for ($oi = 0; $oi -lt $optionMatches.Count; $oi++) {
        $attrs = $optionMatches[$oi].Groups[1].Value
        if ($attrs -match '\bdata-ok\b') { $correct = $oi }
        $options += [pscustomobject]@{ text = (Text $optionMatches[$oi].Groups[2].Value); feedback = $null }
      }
      if ($options.Count -eq 3 -and $correct -ge 0) { Add-Question $lines $unitKey $learnAssessmentKey $qi (Text $stemMatch.Groups[1].Value) '' $false '' $options $correct; $qi++ }
    }
    if ($isStation) {
      $exam = Parse-Exam $html
      for ($ei = 0; $ei -lt $exam.Count; $ei++) {
        $q = $exam[$ei]
        $options = @($q.opts | ForEach-Object { [pscustomobject]@{ text = [string]$_; feedback = $null } })
        Add-Question $lines $unitKey 'exam' $ei ([string]$q.stem) ([string]$q.why) ([bool]$q.crit) ([string]$q.critName) $options ([int]$q.ok)
      }
    }
  }
  $lines.Add('end $$;')
  [IO.File]::WriteAllLines($OutputPath, $lines, [Text.UTF8Encoding]::new($false))
  Write-Host "Generated $OutputPath."
} finally { $archive.Dispose() }
