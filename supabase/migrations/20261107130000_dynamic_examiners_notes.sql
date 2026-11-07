-- Message content is managed independently of the deployed function.
create table public.examiners_notes_messages (
  sequence integer primary key check (sequence > 0),
  subject text not null check (length(trim(subject)) > 0),
  preview text not null default '',
  paragraphs jsonb not null check (jsonb_typeof(paragraphs) = 'array' and jsonb_array_length(paragraphs) > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.examiners_notes_messages enable row level security;
revoke all on public.examiners_notes_messages from public, anon, authenticated;
grant all on public.examiners_notes_messages to service_role;
create trigger set_examiners_notes_messages_updated_at before update on public.examiners_notes_messages
for each row execute function public.set_updated_at();

insert into public.examiners_notes_messages(sequence, subject, preview, paragraphs)
select sequence, subject, preview, paragraphs from jsonb_to_recordset($messages$[{"sequence":1,"subject":"Start with the station you think you can already do","preview":"Your first week, and one question I would like you to answer.","paragraphs":["Dear [First name],","Welcome to The CASC Academy. From today, these notes will reach you every Monday until your exam. Each carries one idea from the examiner’s side of the table, something to do with it that week, and the stations where you will meet it. They take five minutes to read and are meant to be acted on, not filed.","First, a question. Please reply with the sitting you are preparing for and the domain you feel least sure of. Your sitting decides when the final notes arrive, and I read every reply.","Now the first idea. When I examined, the stations that caught good candidates were rarely the hard ones. People walk into a risk assessment or an angry relative already alert. They walk into a straightforward depression history relaxed, and that is where marks leave quietly. The checklist is covered, risk is asked in one token question, and the station finishes a minute early. Nothing wrong was said. Nothing was found either.","The CASC does not reward the absence of errors. It looks for evidence that you would be safe to leave with a patient. A simple station is simple only on paper; the person in front of you is not.","That is why your first station should be 1.1, Low mood history. Not because it is easy, but because it shows how a capable doctor can cover every line and still fall short. If the second failure in that station feels familiar, that recognition is where the work starts.","Before you open it, spend 15 minutes on Start here. It shows how each part of a station works, including the gold circles that hold the examiner’s reasoning. Candidates who skip it tend to read stations like articles. They are meant to be worked.","If your sitting is less than 6 weeks away, choose the workbook’s shortest route now. These notes will follow your date once I have it.","This week","Read Start here: [START HERE]","Open the workbook [WORKBOOK], choose the route that matches the weeks you have, and fill in page 1.","Complete 1.1 in Learn Mode in one sitting, every circle opened. Leave its Exam Mode until later in the week.","Reply with your sitting and your weakest domain.","Next Monday: the part of your preparation the course cannot do for you, and how to set it up before you need it.","Dr Ahmed","Dr Ahmed Abouelghit","Consultant Forensic Psychiatrist and former CASC examiner","The CASC Academy by MedLex · Where Medicine Meets Justice","You are receiving this as a member of The CASC Academy. Reply to this email with any question; replies come to me."]},{"sequence":2,"subject":"Find your two colleagues this week","preview":"The practice that changes results has to be organised before you feel ready for it.","paragraphs":["Dear [First name],","Most candidates look for practice partners when they feel ready to practise. By then it is hard to make it a habit. I would like you to set it up this week, before the knowledge feels finished, because knowledge is not what the CASC marks.","The exam watches what you do, aloud, with a person, against a clock. Reading builds understanding. Only speaking builds performance. The two improve at different speeds, and many capable candidates fail in the gap between them.","Every station in the Academy ends with a practice pack of 3 cards: candidate, role-player and observer. This is how to make a trio last until the exam.","Fix the slot, not the session. One evening a week, same time, 60 minutes, agreed now. Sessions arranged week by week rarely survive the first month.","Rotate all 3 roles. The observer’s seat teaches as much as the candidate’s chair. Watching a colleague walk past a cue you would also have missed is one of the quickest ways to see your own habits.","Keep the role-player card hidden. It holds information released only when the candidate’s technique earns it. If the candidate has read it, the station tests nothing.","The observer gives the verdict first. One sentence before any detail: would I trust this doctor as my registrar, on this station? Then the rubric. Detail without a verdict breeds false comfort.","Stop at 7 minutes, mid-sentence if necessary. A station that runs to 9 minutes in practice will be cut at 7 on the day.","Keep each debrief to 5 minutes. One thing that worked, one thing to change. Long debriefs feel productive and change little.","If you cannot find two colleagues, post in the members’ WhatsApp group. Its purpose is exactly this: finding two people free on the same evening. Practising by video works well, and you lose very little.","This week","Agree a fixed weekly slot with two colleagues.","Run your first session on the 1.1 practice pack, rotating all 3 roles.","Log it in the workbook’s station log.","Next Monday: the instructions on the door — what to do with your reading time, and why a station is rarely about what it seems.","Dr Ahmed","Dr Ahmed Abouelghit","Consultant Forensic Psychiatrist and former CASC examiner","The CASC Academy by MedLex · Where Medicine Meets Justice","You are receiving this as a member of The CASC Academy. Reply to this email with any question; replies come to me."]},{"sequence":3,"subject":"Read the instructions the way they were written","preview":"4 minutes or 90 seconds. What to do with each.","paragraphs":["Dear [First name],","The CASC gives you two kinds of reading time. On one circuit you have 4 minutes per station; on the other, 90 seconds. Most candidates use both the same way. They read the instructions, recognise the topic, and start rehearsing a template for it.","The topic is the wrong thing to find. The instructions were written by someone deciding what the station tests, and that is rarely the diagnosis. A lithium station is usually an information-giving station. An overdose handover is a prioritisation station. The diagnosis is the setting; the task is the station.","I call this the instruction autopsy: 4 questions, in this order.","Who is in the room? Patient, relative, colleague, a consultant on the telephone. This sets your register before anything else.","What exactly am I asked to do? Find the verbs. “Assess” and “explain” are different stations. Many instructions carry two tasks, and both are marked.","What is at stake today? Something is happening now: a discharge, a refusal, a complaint, a dose due tonight. That is usually where the risk sits.","Which domain is this? Name it in one word: risk, information, capacity, emergency. That word tells you what the examiner will be watching.","Then fix two things: the station in one line of your own, and the first sentence you will say.","With 4 minutes, run all 4 questions, then sketch the shape of the 7 minutes: what must happen, in what order, and what you will not have time for. With 90 seconds, run the autopsy only. A structure you have no time to settle is worse than none; your one line and your first sentence are enough.","Practise this apart from the stations themselves. It is a skill of its own, and it improves quickly.","This week","Before opening 2.1 Starting lithium, read only its scenario and run the autopsy. Then check the station’s opening page: did you name the domain correctly?","Do the same for 6.4 The overdose handover, in 90 seconds.","In your practice session, the observer times the reading: 4 minutes for the first station, 90 seconds for the second.","Next Monday: the two minutes that appear in every station you will ever sit — the first and the last.","Dr Ahmed","Dr Ahmed Abouelghit","Consultant Forensic Psychiatrist and former CASC examiner","The CASC Academy by MedLex · Where Medicine Meets Justice","You are receiving this as a member of The CASC Academy. Reply to this email with any question; replies come to me."]},{"sequence":4,"subject":"The first minute and the last minute","preview":"Two skills every station shares, and a 10-minute drill for both.","paragraphs":["Dear [First name],","Every station is different in the middle. At the edges they are almost identical. The opening and the close appear in all 16 stations, which makes them the best-value practice you can do, and the least practised.","The first minute. In it, the examiner learns whether you know who you are talking to, why you are there, and whether this person has agreed to talk. It has 4 parts: who you are; why you are meeting today, in plain words; agreement, including how long you have; then an open question that hands them the floor. When I examined, a good opening never passed a station on its own. A poor one cost a great deal, because it coloured how the rest of the station was seen.","The parts stay the same; their weight changes with the person. A guarded patient (1.2) needs the purpose stated without threat. A patient who has been told it is “all in the mind” (1.4) needs their experience acknowledged before your agenda. A relative needs to know what you can and cannot share before they begin.","The last minute. Candidates often treat the close as what happens when time runs out. It is the part the examiner remembers. A good close has a short summary in the person’s own words, a plan (what happens next, who does it, and when), a safety-net (what to do and whom to contact if things get worse), and a final check: “What questions do you have for me?” When time is short, the summary can shrink. The plan and the safety-net cannot.","The drill. Take 5 candidate cards from different domains. For each, say only the first 45 seconds aloud, then stop. Then, for the same 5, say only the last 45 seconds, as if the middle had happened. Record one round on your phone and listen back once.","Drilling the edges in isolation feels artificial. That is how they become automatic, which is what you need when a station begins and part of your mind is still in the last one.","This week","Run the edge drill twice, 10 minutes each.","Complete 1.2 and 1.4 in Learn Mode, with every circle opened in the opening and closing passages.","Sit the Exam Mode for 1.1.","Workbook: your first weekly review, 10 minutes.","Next Monday: from the edges to the middle, beginning with the skill underneath all the others — hearing what was actually said.","Dr Ahmed","Dr Ahmed Abouelghit","Consultant Forensic Psychiatrist and former CASC examiner","The CASC Academy by MedLex · Where Medicine Meets Justice","You are receiving this as a member of The CASC Academy. Reply to this email with any question; replies come to me."]}]$messages$::jsonb)
  as m(sequence integer, subject text, preview text, paragraphs jsonb);

alter table public.examiners_notes_members drop constraint examiners_notes_members_next_number_check;
alter table public.examiners_notes_members add constraint examiners_notes_members_next_number_check check (next_number > 0);
alter table public.examiners_notes_deliveries drop constraint examiners_notes_deliveries_message_number_check;
alter table public.examiners_notes_deliveries add constraint examiners_notes_deliveries_message_number_check check (message_number > 0);
alter table public.examiners_notes_deliveries add column subject_snapshot text;
alter table public.examiners_notes_deliveries add column preview_snapshot text;
alter table public.examiners_notes_deliveries add column paragraphs_snapshot jsonb;

-- Preserve the original payload for attempts created before this migration.
update public.examiners_notes_deliveries d set subject_snapshot = m.subject,
  preview_snapshot = m.preview, paragraphs_snapshot = m.paragraphs
from public.examiners_notes_messages m where m.sequence = d.message_number;

drop function public.claim_examiners_note();
create function public.claim_examiners_note()
returns table(enrollment_id uuid, message_number integer, email text, first_name text,
  attempts integer, subject text, preview text, paragraphs jsonb)
language plpgsql security definer set search_path = '' as $$
declare v_enrollment_id uuid; v_sequence integer;
begin
  select m.enrollment_id, candidate.sequence into v_enrollment_id, v_sequence
  from public.examiners_notes_members m
  join public.enrollments e on e.id = m.enrollment_id
  join lateral (
    select min(available.sequence) as sequence from (
      select msg.sequence from public.examiners_notes_messages msg
      where msg.is_active and msg.sequence >= m.next_number
      union all
      select d.message_number from public.examiners_notes_deliveries d
      where d.enrollment_id = m.enrollment_id and d.message_number >= m.next_number
        and d.state in ('pending', 'sending', 'failed', 'uncertain')
    ) available
  ) candidate on candidate.sequence is not null
  left join public.examiners_notes_deliveries d
    on d.enrollment_id = m.enrollment_id and d.message_number = candidate.sequence
  where m.due_at <= now() and e.status = 'active'
    and (e.expires_at is null or e.expires_at > now())
    and (d.state is null or (d.state in ('pending','sending') and coalesce(d.locked_until, '-infinity') < now() and coalesce(d.retry_at, '-infinity') <= now()))
  order by m.due_at, m.enrollment_id for update of m skip locked limit 1;
  if not found then return; end if;

  insert into public.examiners_notes_deliveries as d(enrollment_id, message_number, state, attempts,
    first_attempt_at, locked_until, recipient_email, recipient_first_name, subject_snapshot, preview_snapshot, paragraphs_snapshot)
  select v_enrollment_id, v_sequence, 'sending', 1, now(), now() + interval '5 minutes', u.email,
    coalesce(nullif(split_part(trim(p.full_name), ' ', 1), ''), 'Colleague'), msg.subject, msg.preview, msg.paragraphs
  from public.enrollments e join auth.users u on u.id = e.user_id
  left join public.profiles p on p.id = e.user_id
  left join public.examiners_notes_messages msg on msg.sequence = v_sequence
  where e.id = v_enrollment_id
  on conflict on constraint examiners_notes_deliveries_pkey do update set
    state = case when d.first_attempt_at < now() - interval '23 hours' then 'uncertain' else 'sending' end,
    attempts = d.attempts + 1, locked_until = now() + interval '5 minutes', updated_at = now();
  return query select d.enrollment_id, d.message_number, d.recipient_email, d.recipient_first_name,
    d.attempts, d.subject_snapshot, d.preview_snapshot, d.paragraphs_snapshot
  from public.examiners_notes_deliveries d
  where d.enrollment_id = v_enrollment_id and d.message_number = v_sequence and d.state = 'sending';
end $$;
revoke all on function public.claim_examiners_note() from public, anon, authenticated;
grant execute on function public.claim_examiners_note() to service_role;

create or replace function public.finish_examiners_note(p_enrollment uuid, p_number integer, p_outcome text, p_provider_id text default null, p_error text default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_outcome not in ('accepted', 'pending', 'failed', 'uncertain') then raise exception 'invalid outcome'; end if;
  update public.examiners_notes_deliveries set state = p_outcome, provider_id = p_provider_id,
    last_error = left(p_error, 1000), locked_until = null,
    retry_at = case when p_outcome = 'pending' then now() + interval '15 minutes' else null end,
    updated_at = now() where enrollment_id = p_enrollment and message_number = p_number and state = 'sending';
  if found and p_outcome = 'accepted' then
    update public.examiners_notes_members set next_number = p_number + 1,
      due_at = public.examiners_notes_next_monday(now())
      where enrollment_id = p_enrollment and next_number <= p_number;
  end if;
end $$;
