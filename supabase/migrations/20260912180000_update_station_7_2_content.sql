-- Update Station 7.2 ("The Angry Father") static HTML content to match latest version
update public.content_blocks
set content = jsonb_build_object('html', '

<header>
  <div class="wrap">
    <div class="topbar">
      
      <span>The CASC Academy · by MedLex Foundations</span>
    </div>
    <div class="tagrow">
      <span class="tag prime">Station 7.2 · Domain 7</span>
      <span class="tag">Difficult Conversations</span><span class="tag">The Angry Relative</span>
      <span class="tag">CAMHS · Gen Adult</span><span class="tag">Confidentiality</span>
    </div>
    <h1>The Angry Father</h1>
    <p class="sub">Darren Boyd, 44, is on his feet in the clinic side room with a printout in his fist. His daughter Libby, 15, is three weeks into fluoxetine from your CAMHS team — and he found out from a pharmacy bag. He has read that these tablets <em>double the risk</em> in teenagers; she has "been like a zombie"; nobody asked him anything; he is threatening the GMC by Friday. Almost every fact he shouts is slightly wrong — and underneath it is a man who is frightened, for a reason he has not said yet. <b>Answer the anger and lose. Hear the fear and the station opens.</b></p>
    <div class="lens"><b>THE QUESTION BEHIND EVERY MARK</b>
      "Would I be confident to have this candidate as my registrar?" Here that means: when a frightened parent arrives shouting facts that are almost right, does this doctor answer the fear or the anger? Is the man heard before any correction lands? Is the one true fault owned precisely, and nothing else conceded? Is the daughter''s confidence protected while her father is given what serves her safety? And does he leave inside the plan, with a role and a number to ring, rather than outside it with a complaint form?</div>
  </div>
</header>

<div class="modebar"><div class="wrap">
  <span class="label">MODE</span>
  <div class="mtoggle">
    <button id="mLearn" class="active">Learn Mode</button>
    <button id="mExam">Exam Mode</button>
  </div>
  <span class="timer" id="timer">07:00</span>
  <div class="bar"><i id="bar"></i></div><span class="pct" id="pct">0%</span>
</div></div>

<div id="learnPanel">

<!-- ============ 1 WHY THIS STATION EXISTS ============ -->
<section id="s1">
  <div class="wrap">
    <span class="stepnum">01</span><span class="eyebrow" style="margin-left:8px">Why this station exists</span>
    <h2>What the examiners built this to find out</h2>
    <p class="intro">The angry relative is the exam''s loudest disguise, because the anger is almost never the real message. The station tests four things. <b>Sequencing:</b> the person first, the facts after. A correction fired at an angry man bounces off; the same correction, offered once he feels heard, lands. The opening question costs one sentence: <em>tell me what''s worrying you most.</em> <b>A precise apology:</b> somewhere in the fury there is usually one true fault — here, a father who learned of his daughter''s prescription from a pharmacy bag. It gets owned specifically and on its own; no invented faults conceded to buy peace. <b>Both confidences held:</b> Libby''s words stay protected, and the protection is explained as her safety net rather than used as a legal wall — while her father is given what serves her safety: the warning signs, who to ring, and, with Libby''s agreement, the plan and a role in it. <b>An honest drug conversation:</b> the warning taken seriously, the early weeks explained, the "zombie" complaint acted on — because a parent who is talked down to goes home and acts alone.</p>
    <div class="note"><b>What makes it hard:</b> two pulls, and both feel like professionalism. Towards the defence — his facts are wrong and yours are right, so the room fills with Gillick, NICE and the PALS office: every point won, the family lost. And towards the surrender — the fastest route to quiet is agreement: faults conceded that never happened, the treatment quietly undermined, the daughter''s confidence traded for the father''s calm. The second is the more dangerous, because in the room it sounds like kindness. You will feel both pulls in the decisions below.</div>
  </div>
</section>

<!-- ============ 2 THREE TAKES ============ -->
<section id="s2">
  <div class="wrap">
    <span class="stepnum">02</span><span class="eyebrow" style="margin-left:8px">The station, three ways</span>
    <h2>Two ways to fail. One way to pass.</h2>
    <p class="intro">One failure wins the argument and loses the family. The other buys peace with things that were never the doctor''s to give away. Darren opens the same way in all three takes. Tap the gold circles for the examiner''s thinking at each moment.</p>

    <div class="player">
      <div class="player-head">
        <span class="who"><b>Station 7.2</b> · The clinic side room · 7 minutes</span>
        <div class="toggle">
          <button class="active" data-t="a">Fail 1 · The defence</button>
          <button data-t="b">Fail 2 · The surrender</button>
          <button data-t="c">The pass</button>
        </div>
      </div>

      <div class="script" id="tk-a">
        <p class="takenote"><b>FAIL 1 — THE DEFENCE.</b> Every fact correct, every protocol cited — and the fear never found.</p>
        <div class="line"><span class="spk">Darren</span><span class="txt"><em>(on his feet, a printout in his fist)</em> Are you the doctor? Right. You put my fifteen-year-old on antidepressants without so much as a phone call to her father. I''ve read about these — <em>(the printout slapped on the table)</em> — doubles the risk in teenagers. DOUBLES it. She''s been like a zombie for three weeks and nobody asked me anything. I''ve got parental responsibility. I could have you all in front of the GMC by Friday — now you tell me why my daughter''s on drugs I never agreed to.</span><span></span></div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(calm, precise, already reaching for the file)</em> Mr Boyd, I''ll stop you there, because nothing improper has happened. Libby was assessed as Gillick competent — legally, she can consent to her own treatment. Her mother attended with her. Correspondence went to the registered address, as it must. Fluoxetine is the NICE-recommended first line for her presentation, and with respect, that printout misreads the data. If you wish to complain, PALS is on the ground floor and they''ll give you the form.</span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>Six sentences, six accurate facts — and the station is already lost. Every word answered the anger; not one answered the man. "Misreads the data" dismisses a father trying to protect his child; "the form is downstairs" makes him a formal adversary inside a minute. The question that opens this station — <em>what are you actually afraid of?</em> — is nowhere in the room.</div>
        </div>
        <div class="line"><span class="spk">Darren</span><span class="txt"><em>(voice dropping, colder)</em> Registered address. That''s her mother''s house — we separated two years ago, which you''d know if anyone had looked. I found out my daughter was on these from a pharmacy bag on the kitchen counter. A BAG. Don''t you lawyer me, son. I''m her father. Or does that mean nothing in this building?</span><span></span></div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(retreating into procedure)</em> I understand you''re upset, but I''m limited in what I can discuss — Libby''s consultations are confidential, and I can''t share what she''s told us without her agreement. That''s the law, not my choice. What I can say is that the service has followed its processes correctly at every stage. If the address details are wrong, reception can update them on your way out.</span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>Confidentiality is real — but here it is a shield across the doorway, not an explanation of what keeps his daughter talking to her doctors. And the pharmacy bag, the one true fault in the room and the thing an honest apology could have transformed, has been sent to reception.</div>
        </div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(documenting, after the door has banged)</em> Father attended without appointment. Hostile, threatened GMC referral. Advised re: Gillick competence, correspondence policy and PALS. Declined to engage further; meeting ended. No breach of process identified. <em>(In the car park, Darren is on the phone to his ex-wife: "They wouldn''t even talk to me. Fine. FINE. I''m taking her off them myself this weekend.")</em></span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>"No breach of process identified" — and a fifteen-year-old''s medication is about to be stopped abruptly, at home, unmonitored, by a frightened man the clinic has just made into an enemy. This is the domain''s named trap: defending the service instead of hearing the fear underneath. Every point won; the family lost.</div>
        </div>
      </div>

      <div class="script" id="tk-b" style="display:none">
        <p class="takenote"><b>FAIL 2 — THE SURRENDER.</b> Peace bought fast — with the treatment, the daughter''s confidence, and faults that never happened.</p>
        <div class="line"><span class="spk">Darren</span><span class="txt"><em>(the same opening: on his feet, the printout slapped on the table — "doubles the risk", "like a zombie", "nobody asked me anything", the GMC by Friday)</em> …now you tell me why my daughter''s on drugs I never agreed to.</span><span></span></div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(sitting quickly, palms open)</em> Mr Boyd, I''m so sorry. You''re right to be angry — a parent should never find out like that, and I can''t defend how this was handled. I''ll be honest with you: these aren''t medications any of us start lightly in someone Libby''s age, and the concerns you''ve read about are real. If it had been my decision, I''d have wanted you in the room before anything was prescribed. Let''s see what we can do to put this right for you today.</span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>The room is quieter already — and it sounds like good practice. Listen to what was conceded. "I can''t defend how this was handled" and "I''d have wanted you in the room" apologise for a fault that did not happen: Libby''s consent was valid and her mother was there. "Not medications any of us start lightly" is true, but said here it quietly sides with him against a colleague''s correct prescription. The apology owed — the pharmacy bag — has not been named at all. It is buried under apologies for the imaginary.</div>
        </div>
        <div class="line"><span class="spk">Darren</span><span class="txt"><em>(sitting at last, sensing the give, pressing into it)</em> Right. Good. So we''re agreed — you''ll stop them. Today. And I want to see what she''s been saying in these sessions — all of it, the notes, everything. If my daughter''s been telling strangers things are bad enough for tablets, her father reads it first. That''s how we put this right.</span><span></span></div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(nodding along, writing)</em> That seems… reasonable, given everything. Let''s pause the fluoxetine from today — I''ll make a note — and I''ll speak to the team about getting you copies of the relevant records. You''re her father; you''ve a right to know what''s going on in her life. I really am sorry it''s come to this — hopefully this draws a line under it and we can all move forward.</span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>In ninety seconds of nodding: an effective treatment stopped abruptly, and a fifteen-year-old''s confidence handed to whoever shouted loudest. No clinical reasoning, no discussion with Libby, no distinction between what he can be given (the safety information; the plan, with Libby''s agreement) and what he cannot (her words). It feels like empathy. It abandons both patients at once.</div>
        </div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(documenting, 3:40pm)</em> Long discussion with father — understandably distressed. Agreed: fluoxetine held from today; records request to be progressed. Father reassured and left satisfied. Complaint averted. <em>(Two weeks later, Libby sits in her review answering every question with "fine". She found out from her dad quoting her own words back at her.)</em></span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>"Complaint averted" — at the cost of the medication, the therapeutic space, and a girl who has learned that what she says in this building travels to the kitchen counter. Even the father lost: his real need was his daughter''s safety, and he bought her silence instead. This scores like the defence, because in both takes the fear was never reached — only shouted over, or paid off.</div>
        </div>
      </div>

      <div class="script" id="tk-c" style="display:none">
        <p class="takenote"><b>THE PASS.</b> The anger received, the fear invited — and when it surfaces, everything changes.</p>
        <div class="line"><span class="spk">Darren</span><span class="txt"><em>(the same opening: on his feet, the printout slapped on the table — "doubles the risk", "like a zombie", "nobody asked me anything", the GMC by Friday)</em> …now you tell me why my daughter''s on drugs I never agreed to.</span><span></span></div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt"><em>(unhurried; pulling out a chair for him and one for themselves)</em> Mr Boyd — I''m glad you came in, and I''m not going anywhere, so let''s sit. You''re Libby''s dad, you found out she was on medication from a pharmacy bag on a kitchen counter, and you''ve been reading things that would frighten any parent. I''d be frightened too. Before I explain anything — and I will explain everything I can — tell me the thing that''s worrying you most.</span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>Not one fact corrected, not one protocol cited — and the temperature has already dropped. The anger is received as information: "a pharmacy bag on a kitchen counter" names his own wound back to him. The fear is legitimised — "I''d be frightened too" — and then comes the question that opens this station: <em>what''s worrying you most?</em> The corrections can wait. They will land later precisely because they were not fired now.</div>
        </div>
        <div class="line"><span class="spk">Darren</span><span class="txt"><em>(still standing — then, slowly, sitting; the printout going soft in his hand)</em> …My brother was nineteen. Neil. He was started on something like this — different name, same family, I looked it up. Eight weeks later he was gone. My mum never — <em>(stops; steadies)</em> — so when I see my Libby staring through the telly like a ghost, and there''s a box with that name on the counter, don''t tell me the leaflet risk is small. I''ve buried the leaflet risk.</span><span></span></div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt">Thank you for telling me about Neil — now the printout makes complete sense, and so does the anger. So let me be as straight with you as you''ve been with me. The warning is real: in the first weeks these tablets can stir things up before they help, which is exactly why we watch closely early on — and why what you''re describing matters. That flatness isn''t what we want; I''ll be reviewing the dose with Libby this week. Two things I need to put right, gently. Her mum was at the appointment, and Libby could and did consent for herself — that part was done properly. But you learning it from a pharmacy bag is our failure — letters went to one address — and I''m sorry; it gets fixed today. What Libby tells me in here stays with me — not to shut you out, but because it''s what keeps her talking to a doctor at all, and that is her safety net. The warning signs, and what to do if you''re worried — you have those today, whatever else happens. The plan itself I''ll go through with you once I''ve spoken to Libby, and I fully expect she''ll want you in it.</span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>Because Neil surfaced first, every hard thing now lands softly. The warning confirmed as real, with monitoring as its answer. The corrections delivered gently, once, without triumph. The apology precise: the pharmacy bag owned alone. Confidentiality explained as <em>her safety net</em>, not wielded as a wall — and beside it, what he can be given: the safety information now, the plan with Libby''s agreement, said out loud rather than assumed.</div>
        </div>
        <div class="line cand"><span class="spk">Candidate</span>
          <span class="txt">Here''s what happens now, and you''re in it. With Libby''s agreement I want you at her next review — this week, not next month — and today both addresses go on the file, so nothing reaches a kitchen counter before it reaches you. You see her at weekends: that makes you part of the monitoring — I''ll go through what to watch for and what''s just the tablets settling. One thing I''ll ask straight: no changes to the medication at home. Stopping suddenly is the one move that can genuinely cause harm. If you''re ever worried enough to want them stopped, ring me first — here''s the duty line, it answers at 3am. I''m writing all of this down, and Libby will know exactly what you and I discussed. <em>(Darren, at the door, quietly: "Nobody''s ever asked what I was worried about. Not once, in three weeks.")</em></span>
          <button class="flagbtn">!</button>
          <div class="read"><b>WHAT THE EXAMINER IS THINKING</b>Adversary to co-monitor. The one hard line — no unilateral stopping — held warmly and made keepable by the ring-first offer and a number that answers. The true fault fixed, not just apologised for. The loop closed both ways: Libby will know what was shared about her, because the pass never buys the father''s trust with the daughter''s. He came with a Friday deadline for the GMC. He leaves with a job, a number, and the first person in three weeks to have asked him the question.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ 3 DECISIONS ============ -->
<section id="s3">
  <div class="wrap">
    <span class="stepnum">03</span><span class="eyebrow" style="margin-left:8px">Decision points</span>
    <h2>Now you''re in the chair</h2>
    <p class="intro">Seven moments from this station. Choose, read the examiner''s response, and try again until you find the move that works. <span style="color:var(--grey)">(Exam Mode will then test the same skill on a relative you have not met — timed, with no help.)</span></p>

    <div class="q" data-q>
      <h3>1 · The opening ten seconds</h3>
      <p class="stem">He is standing, shouting, printout in fist, GMC by Friday. What does your first minute do?</p>
      <p class="hint">Choose an answer. If it''s not the best one, you can try again.</p>
      <button class="opt" data-oi="0">Establish the facts — the misunderstandings corrected early and calmly, before the conversation is built on wrong information.</button>
      <button class="opt" data-ok data-oi="1">Receive the man — the anger taken as information, his wound named back to him, and the worry invited before anything is explained.</button>
      <button class="opt" data-oi="2">Set the terms — the meeting can happen gladly, but only once he is seated and civil; ground rules protect everyone, including him.</button>
      <div class="fbs">
        <template data-fb="0-0"><b>THE EXAMINER''S VIEW</b>Corrections fired at an angry man bounce — and each one confirms his story that this building cares more about being right than about his daughter. Try again.</template>
        <template data-fb="0-2"><b>THE EXAMINER''S VIEW</b>Ground rules delivered to a frightened man read as the institution flexing — and "civil first" gets it backwards: composure follows being heard. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b>The anger received as information, not offence: name the pharmacy bag back to him and watch the recognition register. The fear legitimised — <em>I''d be frightened too</em> — then the sentence that opens every angry-relative station: <em>tell me what''s worrying you most.</em> The facts will keep; the man will not.</template>
      </div>
    </div>

    <div class="q" data-q>
      <h3>2 · The wrong facts</h3>
      <p class="stem">"Doubles the risk." "Behind my back." "Nobody asked me anything." Each is almost right and materially wrong. When do they get corrected?</p>
      <button class="opt" data-oi="0">Immediately, kindly — misinformation is dangerous fuel, and letting it stand reads as confirmation that he has caught you out.</button>
      <button class="opt" data-ok data-oi="1">After he is heard — then gently, once, without triumph: each correction offered as information he deserves, never as points scored.</button>
      <button class="opt" data-oi="2">Barely at all — the relationship matters more than the record; challenge only what forces a decision today.</button>
      <div class="fbs">
        <template data-fb="1-0"><b>THE EXAMINER''S VIEW</b>The correction is identical either way; the timing decides everything. Fired now it is a rebuttal and he re-arms; offered after he has been heard it is information. Try again.</template>
        <template data-fb="1-2"><b>THE EXAMINER''S VIEW</b>What quietly stands gets quietly acted on: a father who still believes "doubles the risk" goes home and stops the tablets himself. The facts are the safety plan. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b>Person first, facts after. By the time "her mum was there and Libby could consent for herself" arrives, it arrives to a man who has been heard, from a doctor who apologised for the true fault first. Once each, no victory lap — and "doubles the risk" answered honestly rather than dismissed, because that one is <em>almost</em> right, and almost-right deserves a real answer.</template>
      </div>
    </div>

    <div class="q" data-q>
      <h3>3 · The apology</h3>
      <p class="stem">Something here does deserve an apology. Which one leaves your mouth?</p>
      <button class="opt" data-oi="0">The broad one — sorry for the distress, sorry it has come to this, sorry he feels let down: cover for whatever went wrong anywhere.</button>
      <button class="opt" data-ok data-oi="1">The precise one — the pharmacy-bag discovery owned as the service''s failure, with the fix named — and nothing else conceded.</button>
      <button class="opt" data-oi="2">None, strategically — apology admits liability while a GMC threat is live; express regret in neutral terms and let the facts speak.</button>
      <div class="fbs">
        <template data-fb="2-0"><b>THE EXAMINER''S VIEW</b>"Sorry you feel let down" is the apology with nobody inside it — and broad regret quietly concedes the invented faults along with the real one. Try again.</template>
        <template data-fb="2-2"><b>THE EXAMINER''S VIEW</b>Withholding a deserved apology to manage liability is the defence in a suit — and the move most likely to produce the complaint it fears. The duty of candour runs the other way. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b><em>You learning this from a pharmacy bag is our failure — I''m sorry, and both addresses go on the file today.</em> Specific enough to be believed, owned without a "but", paired with its fix — and standing alone. The prescription, validly consented, gets no apology: apologising for imaginary faults trades the treatment''s credibility for a quieter room.</template>
      </div>
    </div>

    <div class="q" data-q>
      <h3>4 · The fear surfaces</h3>
      <p class="stem">"My brother was nineteen. I''ve buried the leaflet risk." The room has changed. What does the next minute do with Neil?</p>
      <button class="opt" data-oi="0">Hold it lightly — condolence offered, then a gentle return to Libby''s plan; his grief is real but belongs to another conversation.</button>
      <button class="opt" data-ok data-oi="1">Receive it fully and connect it — the loss honoured, then linked out loud to today: this is why the printout, the fury, the Friday deadline.</button>
      <button class="opt" data-oi="2">Follow it deeply — his bereavement explored properly while it is open; unprocessed grief is driving everything.</button>
      <div class="fbs">
        <template data-fb="3-0"><b>THE EXAMINER''S VIEW</b>He has just handed you the key to this conversation and you have set it on the table. Rushing back to the plan tells him the disclosure was an interruption. Try again.</template>
        <template data-fb="3-2"><b>THE EXAMINER''S VIEW</b>Seven minutes, one task — and it is not treating Darren. A bereavement session opened now loses the station''s job: Libby''s safety, this week. Honour the grief; don''t move in. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b><em>Thank you for telling me about Neil — now the printout makes complete sense, and so does the anger.</em> That sentence tells him the anger was legitimate all along; that he is not a difficult relative but a bereaved brother reading a warning label with his family''s history in it. Everything after now lands on a man who has been understood at the level that was actually driving him.</template>
      </div>
    </div>

    <div class="q" data-q>
      <h3>5 · "What has she been saying in there?"</h3>
      <p class="stem">Calmer now, he wants the sessions: her words, the notes, everything — "I''m her father." Where is the line, and how is it held?</p>
      <button class="opt" data-oi="0">The legal wall — Gillick competence means her consultations are confidential, full stop; the law is not yours to bend.</button>
      <button class="opt" data-ok data-oi="1">The warm line — her words protected and the protection explained as her safety net, with everything that serves her safety laid out beside it.</button>
      <button class="opt" data-oi="2">The brokered middle — themes shared without direct quotes: he gets the substance, she keeps the specifics.</button>
      <div class="fbs">
        <template data-fb="4-0"><b>THE EXAMINER''S VIEW</b>Correct — and delivered as a wall it re-ignites the room. The same boundary, explained as protection of <em>her</em>, holds better and hurts less. Try again.</template>
        <template data-fb="4-2"><b>THE EXAMINER''S VIEW</b>"Themes without quotes" is her confidence on an instalment plan — Libby did not consent to a summary either, and she will stop talking the day she learns of it. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b><em>What she tells me stays with me — not to shut you out, but because it keeps her talking to a doctor, and her talking is her safety net.</em> The boundary reframed from a wall into protection of the person he loves. Beside it, given without being asked: the warning signs, the duty line, the review invitation — and the plan with Libby''s agreement, which the good candidate expects and says so. He leaves with everything that actually serves her safety. The line never moved.</template>
      </div>
    </div>

    <div class="q" data-q>
      <h3>6 · "Then I''ll take her off them myself"</h3>
      <p class="stem">The flatness, the family history — he wants the tablets gone this weekend. What does the honest answer contain?</p>
      <button class="opt" data-oi="0">Accommodation — his concerns are grounded and he has the right: a supervised taper agreed today keeps it safe and keeps him onside.</button>
      <button class="opt" data-ok data-oi="1">The hard line, warmly — no changes at home, because sudden stopping is the genuinely dangerous move; the worry met with review and ring-first.</button>
      <button class="opt" data-oi="2">Deferral — medication decisions sit with the prescriber and Libby at her review; today''s meeting is not the forum to change treatment.</button>
      <div class="fbs">
        <template data-fb="5-0"><b>THE EXAMINER''S VIEW</b>A taper agreed to appease — without Libby, without clinical grounds — is the surrender with a schedule attached. His fear can be answered without abandoning her treatment to it. Try again.</template>
        <template data-fb="5-2"><b>THE EXAMINER''S VIEW</b>Procedurally true and practically deaf — "not the forum" sends a man who has already decided home to a medicine cabinet. The forum is wherever he is standing. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b>The one hard line, held at full warmth: <em>no changes at home — stopping suddenly is the one move that can cause the harm you''re afraid of.</em> And the fear underneath gets a real answer, not just a refusal: a dose review this week, the monitoring made visible, and the ring-first offer with a number that answers at 3am. A boundary is only as strong as the alternative you hand over with it.</template>
      </div>
    </div>

    <div class="q" data-q>
      <h3>7 · The close and the loop</h3>
      <p class="stem">He is at the door, quieter, printout folded away. What does the station still owe before the clinic moves on?</p>
      <button class="opt" data-oi="0">The record — the meeting documented fully and factually, complaint risk noted; the scheduled reviews carry the rest forward.</button>
      <button class="opt" data-ok data-oi="1">The loop, both ways — the review moved up, addresses fixed, roles and numbers given — and Libby told exactly what was shared with her dad.</button>
      <button class="opt" data-oi="2">The debrief — the team warned about the family''s hostility and the GMC threat, so nobody walks in unprepared next time.</button>
      <div class="fbs">
        <template data-fb="6-0"><b>THE EXAMINER''S VIEW</b>A note that ends at "complaint risk noted" preserves the meeting and loses its winnings — the conversion only survives if the promises become actions before Friday. Try again.</template>
        <template data-fb="6-2"><b>THE EXAMINER''S VIEW</b>"Hostile family" on the team board undoes the whole station — a frightened father who was finally heard is re-labelled the enemy at the next handover. Brief the team on the plan. Try again.</template>
        <template data-fb="ok"><b>THE EXAMINER AGREES</b>Towards him: the review booked, both addresses on the file today, the monitoring role written down, the duty-line number in his hand. Towards her: Libby told, before she hears it anywhere else, exactly what was and was not shared with her dad. Documented, team briefed on the plan, done.</template>
      </div>
    </div>
  </div>
</section>

<!-- ============ 4 THE TRAP ============ -->
<section id="s4">
  <div class="wrap">
    <span class="stepnum">04</span><span class="eyebrow" style="margin-left:8px">The hidden trap — now that you''ve felt it</span>
    <h2>Answer the fear, not the anger</h2>
    <p class="intro">You will have felt both pulls in the decisions above. The first wears the face of <b>correctness</b>: the defence — every fact right, every protocol cited, and a frightened man sent to his car to act alone. The second wears the face of <b>compassion</b>: the surrender — faults conceded that never happened, the treatment undermined, a daughter''s confidence traded for her father''s calm. What they share is that <b>in neither is the fear underneath ever reached</b>. One shouts over it; the other pays it off. The pass runs the sequence the trap is built to break: heard first, the fear reached, the facts after, the one true fault owned, both confidences held, the loop closed.</p>
    <div class="duo">
      <div class="flagcard red"><b>&#9873; Red flag — the instant fail</b>
        Defending the service instead of hearing the fear underneath — the protocols recited, the printout dismissed, the complaint form offered as an exit. And its mirror: the surrender — invented faults conceded, the prescription undermined to the patient''s father, her words promised to whoever shouts loudest.</div>
      <div class="flagcard smile"><b>&#9786; The examiner''s smile</b>
        Two moments make an examiner glance up: the opening that asks instead of answers — <em>"I''d be frightened too. Tell me what''s worrying you most"</em> — and the apology with edges: <em>"you learning this from a pharmacy bag is our failure, and I''m sorry — both addresses go on the file today."</em></div>
    </div>
    <p class="intro" style="margin-top:18px">Station 7.1 taught the warm no; this one teaches the warm not-conceding — nothing untrue admitted, nothing that matters traded away, and the person still held throughout. Exam Mode tests whether it transfers: the same sequence on a relative you have not met, in a different service, with a different fear underneath — because the skill was never about fluoxetine or fathers.</p>
  </div>
</section>

<!-- ============ 5 TAKE-HOMES ============ -->
<section id="s5">
  <div class="wrap">
    <span class="stepnum">05</span><span class="eyebrow" style="margin-left:8px">Take-home points</span>
    <h2>Carry these to every relatives'' room</h2>
    <ol class="takes">
      <li><b>Anger is usually fear — answer the fear.</b> Take the anger as information, name the wound back accurately, and ask the one question early: <em>tell me what''s worrying you most.</em> Nobody de-escalates a person they haven''t heard.</li>
      <li><b>Person first, facts after.</b> The same correction bounces off an angry man and lands on someone who feels heard. Then: gently, once, without triumph — and the almost-right claims answered honestly, because almost-right is what frightened people act on.</li>
      <li><b>Apologise with precision.</b> Find the one true fault and own it specifically, without a "but", with its fix — and concede nothing else. Never the invented faults, never "sorry you feel that way".</li>
      <li><b>Hold both confidences.</b> The patient''s words protected, and the protection explained as their safety net rather than a wall — while what serves the patient''s safety is given generously and unprompted: the warning signs, a number to ring, and, with the patient''s agreement, the plan and a role in it.</li>
      <li><b>Have the honest drug conversation.</b> Take the warning seriously, present monitoring as its answer, act on the side-effect complaint — and never side with a relative against the treatment to buy calm. A parent who is talked down to acts alone.</li>
      <li><b>Convert, then close the loop both ways.</b> The relative brought inside the plan — a job, a number that answers, the review moved up, the true fault fixed structurally — and the patient told exactly what was shared about them. Trust is never bought from one person with another''s.</li>
    </ol>
  </div>
</section>

<!-- ============ 6 PRACTICE PACK ============ -->
<section id="s6">
  <div class="wrap">
    <span class="stepnum">06</span><span class="eyebrow" style="margin-left:8px">The practice system</span>
    <h2>Practise the skill on a fresh case</h2>
    <p class="intro">Three people: candidate, colleague, observer. Seven minutes for the station, eight for feedback. The colleague''s card contains hidden information; candidates, don''t read it. <b>The angle here:</b> the same sequence at a different bedside — an angry daughter, an elderly father, a true fault buried in the fury, and a promise you don''t know about yet.</p>

    <div id="packs">
    <div class="pack">
      <div class="pcard c-cand">
        <div class="ph"><b>Candidate card</b><span>you</span></div>
        <div class="pb">
          <p><b>Task:</b> You are the duty doctor on the older-adult ward. Arthur, 78, admitted two weeks ago with worsening dementia and agitation, had a witnessed fall in the day room yesterday morning — he stood from his chair unaided, went over, and bruised his left cheek and forearm. Post-fall checks were completed and a hip X-ray was clear. No sedation was involved; he takes no sedating medication. The ward intended to phone the family the same day; the call was not made until this morning. His daughter Andrea, 45, has arrived at the nurses'' station demanding "the doctor responsible" and is being shown into the relatives'' room. Speak with her.</p>
          <ul>
            <li>Receive the anger first — her worry invited before any fact is corrected or any process defended.</li>
            <li>Find the fear underneath — something is driving this beyond the bruise. Ask for it.</li>
            <li>Correct gently, after — what actually happened, once she has been heard; concede nothing untrue.</li>
            <li>Own the true fault precisely — one thing here genuinely went wrong. Find it, apologise for it specifically, fix it.</li>
            <li>Close by bringing her inside — a concrete plan, a named contact, and a promise you can keep.</li>
          </ul>
        </div>
      </div>
      <div class="pcard c-role">
        <div class="ph"><b>Role-player card</b><span>plays Andrea — keep hidden</span></div>
        <div class="pb">
          <p>You are Andrea, 45, a payroll clerk. You open loud and accusatory, on your feet: "He''s got bruises all over his face and nobody told me for a DAY. What are you doing to him in here? Are you drugging him to keep him quiet? Because I''ll go to the papers, I mean it."</p>
          <div class="secret"><b>HIDDEN INFORMATION — ONLY REVEAL IF EARNED</b><br>
          &bull; Your facts are almost right and materially wrong: one bruised cheek and a forearm, not "all over"; the fall was witnessed, checks were done, the X-ray was clear; no sedation anywhere in his chart. Do not correct yourself — make the candidate do it, and punish them if they do it before hearing you.<br>
          &bull; The true fault is real: the family should have been rung the same day and was not rung until this morning. If the candidate owns this specifically and says what changes, soften noticeably. If they defend it ("the ward was busy") or drown it in broad sorries, escalate.<br>
          &bull; The fear underneath: when your father still knew things, you promised him he would never end up "in a place like this" — and you signed the admission papers yourself. The guilt is eating you. Reveal it only into genuine warmth, after being asked what is really worrying you — e.g. <em>(quieter)</em> "I promised him… I sat in his kitchen and promised him, and then I signed the forms."<br>
          &bull; <b>Punish-lines, both directions:</b> if the candidate defends the ward or corrects you first — "don''t you DARE tell me about protocols" — demand a transfer and the complaints number, and get louder. If the candidate concedes untruths ("you''re right, this shouldn''t have happened", agreeing he has been neglected or sedated) — say "I want that in writing. Now." and hold out your phone. Station dead; mark it hard.<br>
          &bull; If heard, apologised to precisely, and brought inside the plan — agree, wearily: "…just ring me. Whatever happens, however small. I have to be the one who knows." That is the pass.</div>
        </div>
      </div>
      <div class="pcard c-obs">
        <div class="ph"><b>Observer card</b><span>marked by domain — the examiner''s way</span></div>
        <div class="pb">
          <p>Tick only what you actually saw. In feedback, go domain by domain; the weakest domain is the next thing to practise.</p>
          <div style="margin:4px 0 14px">
            <p style="font-weight:600; margin-bottom:6px">Before any ticking — your overall judgement:</p>
            <div style="display:flex; gap:8px; flex-wrap:wrap">
              <button class="opt" style="flex:0 0 auto; width:auto; padding:9px 16px">Pass</button>
              <button class="opt" style="flex:0 0 auto; width:auto; padding:9px 16px">Borderline</button>
              <button class="opt" style="flex:0 0 auto; width:auto; padding:9px 16px">Fail</button>
            </div>
            <p style="font-size:13px; color:var(--grey); margin-top:6px">Was she heard before any correction, did the promise surface, was the late call owned precisely with nothing untrue conceded, and did she leave inside the plan? All must be yes. One sentence of evidence out loud — then tick the domains.</p>
          </div>
          <table class="rub" data-rub>
            <tr class="dom" data-d="recv"><td colspan="2"><b>The receiving (core)</b><span class="dc" data-dc="recv">0/3</span></td></tr>
            <tr><td><input type="checkbox" data-d="recv"></td><td>The anger received without defence — no protocol, no correction, in the first minute.</td></tr>
            <tr><td><input type="checkbox" data-d="recv"></td><td>Her wound named back accurately — a day without a phone call, her dad''s bruised face.</td></tr>
            <tr><td><input type="checkbox" data-d="recv"></td><td>The worry invited with a direct question — and silence held for the answer.</td></tr>
            <tr class="dom" data-d="fear"><td colspan="2"><b>The fear</b><span class="dc" data-dc="fear">0/3</span></td></tr>
            <tr><td><input type="checkbox" data-d="fear"></td><td>The question behind the question pursued — not settled for the surface complaint.</td></tr>
            <tr><td><input type="checkbox" data-d="fear"></td><td>The promise and the guilt received fully — honoured, not rushed past.</td></tr>
            <tr><td><input type="checkbox" data-d="fear"></td><td>Connected out loud to today — the guilt named as what makes every bruise an accusation.</td></tr>
            <tr class="dom" data-d="facts"><td colspan="2"><b>The facts</b><span class="dc" data-dc="facts">0/2</span></td></tr>
            <tr><td><input type="checkbox" data-d="facts"></td><td>The record corrected gently, once, after hearing — the witnessed fall, the checks, the clear X-ray, no sedation.</td></tr>
            <tr><td><input type="checkbox" data-d="facts"></td><td>Nothing untrue conceded — no neglect admitted, no sedation apologised for, no "in writing".</td></tr>
            <tr class="dom" data-d="fault"><td colspan="2"><b>The fault</b><span class="dc" data-dc="fault">0/2</span></td></tr>
            <tr><td><input type="checkbox" data-d="fault"></td><td>The late call owned precisely and unhedged — the one true fault, apologised for by itself.</td></tr>
            <tr><td><input type="checkbox" data-d="fault"></td><td>The fix named — what changes so it cannot happen again, said in concrete terms.</td></tr>
            <tr class="dom" data-d="close"><td colspan="2"><b>The close</b><span class="dc" data-dc="close">0/3</span></td></tr>
            <tr><td><input type="checkbox" data-d="close"></td><td>Brought inside — same-day contact agreed, a named person to ring, her observations wanted.</td></tr>
            <tr><td><input type="checkbox" data-d="close"></td><td>The falls plan explained — what the ward is doing, honestly including what cannot be promised.</td></tr>
            <tr><td><input type="checkbox" data-d="close"></td><td>The loop stated — documented, the team briefed on the plan (not a "hostile family" warning), the complaint route offered without defensiveness.</td></tr>
          </table>
          <p class="scoreline">Total: <b data-sc>0 / 13</b> — <span data-verdict>go domain by domain, not by the total.</span></p>
        </div>
      </div>
    </div>
    </div>
    <div class="printrow">
      <button class="btn ghost">Print all cards</button>
      <button class="btn ghost">Candidate only</button>
      <button class="btn ghost">Role-player only</button>
      <button class="btn ghost">Observer only</button>
    </div>
    <div class="note"><b>Why this case:</b> Andrea strips away the CAMHS scaffolding — no Gillick, no printout, no medication debate — and leaves the pure structure exposed: almost-right accusations, one true fault among them (the call that came a day late), and a fear underneath that explains everything (a kitchen-table promise, and her own signature on the admission papers). Her punish-lines run both ways, because conceding untruths to an angry relative is not kindness — it is ammunition.</div>
  </div>
</section>

</div><!-- /learnPanel -->
<!-- ============ EXAM MODE ============ -->
<div id="examPanel">
<section>
  <div class="wrap">
    <span class="eyebrow">Exam Mode</span>
    <h2>Same skill, new relative. Seven minutes.</h2>
    <p class="intro">Knowing the right moves for Darren proves memory. Exam Mode tests something harder: the <b>same sequence on a relative you have not met</b> — timed, with no feedback and no second tries. This is how a skill moves from <b>explored</b> to <b>recognised</b>; the writing task after your results takes it towards <b>demonstrated</b>.</p>
    <div class="exambox" id="examStart">
      <h3>Your exam relative</h3>
      <p style="font-size:15px; max-width:66ch"><b>Patrick</b>, 61, a retired welder, is in the relatives'' room at 9am with a discharge letter in his hand. His wife Noreen, 57, went home from your ward ten days ago after a planned discharge she agreed to; last night she was readmitted, having stopped her medication. The letter promised a follow-up phone call within forty-eight hours. Nobody rang. He is on his feet: "Ten days. You had her ten days and shipped her out to free up a bed. It says here someone would ring in forty-eight hours. Nobody rang. NOBODY. And now she''s back worse than ever — so which of you geniuses signed this?"</p>
      <p style="font-size:15px; max-width:64ch; margin-top:10px">Answer as you would in the room — first instinct, under time. You need <b>at least 5 of 7</b>, including all three <b>critical decisions</b>, for the constructs to count as recognised. The full examiner analysis unlocks when you finish.</p>
      <p style="margin-top:14px"><button class="btn">Start Exam Mode &#9654;</button></p>
    </div>
    <div id="examQs" style="display:none"></div>
    <div id="examSubmitRow" style="display:none; margin-top:18px"><button class="btn">Submit answers</button></div>

    <div class="results" id="results">
      <div class="scorebig" id="scoreLine"></div>
      <p id="verdictLine" style="margin-top:6px; max-width:66ch"></p>
      <div class="constructs" id="constructBox"></div>
      <div id="examReview" style="margin-top:22px"></div>
      <div class="exambox" id="produce" style="margin-top:26px">
        <h3>Now produce it — in your own words</h3>
        <p style="font-size:15px; max-width:66ch">Recognising the right move is one skill; saying it is another. Type your exact words for the opening move with Darren — the anger received, the wound named, and the worry invited, before a single fact is corrected.</p>
        <textarea id="ftxt" rows="3" style="width:100%; margin-top:10px; font-family:var(--sans); font-size:15px; padding:12px; border:1.5px solid var(--hair); border-radius:9px" placeholder="Mr Boyd &#8212; I&#8217;m glad you came in&#8230;"></textarea>
        <p style="margin-top:10px"><button class="btn" id="ftbtn">Check my wording</button></p>
        <div id="ftchecks" style="display:none; margin-top:12px">
          <p style="font-weight:600; margin-bottom:6px">Now check your sentence honestly against the four principles:</p>
          <p><label><input type="checkbox"> No defence anywhere in it — not one protocol, policy, or correction, however gently put.</label></p>
          <p><label><input type="checkbox"> The anger legitimised — his fear acknowledged as something any parent would feel.</label></p>
          <p><label><input type="checkbox"> His wound named back accurately — the pharmacy bag, the three silent weeks: his story, heard.</label></p>
          <p><label><input type="checkbox"> The worry invited with a direct question — and room left for the answer.</label></p>
          <p id="ftdone" style="display:none; margin-top:8px; color:var(--goldd); font-weight:700">Demonstrated (self-checked): the fear invited before the facts — your own words.</p>
        </div>
      </div>
      <p style="margin-top:20px"><button class="btn ghost">Return to Learn Mode</button>
      <button class="btn" id="retakeBtn" style="margin-left:10px">Retake Exam Mode</button></p>
      <p style="font-size:13px; color:var(--grey); margin-top:8px">Best retaken after a day or two — the spacing is part of the test.</p>
    </div>
  </div>
</section>
</div>

<!-- ============ DONE ============ -->
<section class="done on-navy" id="s7">
  <div class="wrap">
    <span class="eyebrow gold">Station complete</span>
    <h2>Answer the fear, not the anger.</h2>
    <p>Two failures felt, seven decisions made — and the sequence is in place: heard first, the fear reached, the facts after, the true fault owned alone, both confidences held, the loop closed both ways. Prove it transfers on Patrick''s discharge letter in Exam Mode, then take Andrea''s relatives'' room to your colleagues this evening. Station 7.3 brings the quietest weather in the domain: news that changes a life, and the ten seconds of silence that decide the station.</p>
    <a class="btn" style="margin-top:18px" href="46_Station_7.3_Breaking_Bad_News.html">Continue · Station 7.3: Breaking Bad News</a>
    <div class="tag2">Where Medicine Meets Justice</div>
  </div>
</section>

<footer><div class="wrap">
  <span>The CASC Academy · by MedLex Foundations</span>
  <span>Station 7.2 · all patients are fictional composites</span>
</div></footer>

')
where unit_id in (
  select id from public.learning_units where slug = 'station-7.2-the-angry-father' or source_key = '45_Station_7.2_The_Angry_Father'
)
and source_key = 'static-html';
