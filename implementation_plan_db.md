# CASC Academy — Database and Learning Engine Implementation Plan

## 1. الهدف والنطاق

تحويل محتوى CASC Academy الموجود في ملف CASC_Academy 2.zip من صفحات HTML مستقلة إلى Learning Engine داخل MedLex يعتمد على Supabase، مع الحفاظ على:

- ترتيب المحتوى من 00 إلى 51.
- بنية Course → Domain → Station.
- Learn Mode وExam Mode.
- قواعد النجاح والأسئلة الحرجة.
- الإجابة الإنشائية والـ self-check.
- Practice Packs وأدوار Candidate وPatient وObserver وInterpreter.
- Rubrics وسلم Explored → Recognised → Demonstrated → Validated.
- التقدم، المحاولات، النقاط، والشهادات.
- دعم الترجمة وإصدارات المحتوى دون كسر النتائج القديمة.

هذه المرحلة تخص CASC Academy فقط. صفحات FAQ وPathways وباقي الصفحات التسويقية خارج النطاق حاليًا.

---

## 2. جرد المحتوى المؤكد

تمت مراجعة جميع ملفات الـ ZIP:

| النوع | العدد |
|---|---:|
| Orientation | 1 |
| Domain hubs | 8 |
| Stations | 43 |
| إجمالي صفحات HTML | 52 |
| Competency constructs | 61 |
| Learn questions | 311 |
| Exam questions | 301 |
| Critical Exam questions | 129 |
| Answer options | 1,836 |
| Written production tasks | 43 |
| Practice role cards | 130 |
| Observer rubric items | 559 |

كل Station بها 7 Learn decisions و7 Exam questions. زمن Exam Mode هو 420 ثانية، والنجاح يحتاج 5 من 7 مع صحة كل الأسئلة الحرجة الثلاثة.

Station المترجم بها أربعة أدوار، بينما باقي المحطات غالبًا ثلاثة؛ لذلك الأدوار يجب أن تكون dynamic وليست hardcoded.

---

## 3. القرار المعماري

سنستخدم Hybrid Content Model:

1. المحتوى التحريري المرن مثل الفقرات، العناوين، الحوارات، callouts، takeaways وexaminer reveals يُخزن كـ ordered content blocks.
2. البيانات التي لها قواعد أو تقارير أو صلاحيات — الأسئلة، الاختيارات، answer keys، المحاولات، rubrics وmastery — تُخزن في جداول relational.

لا يوضع النظام كله في JSON؛ لأن ذلك يصعّب التصحيح الآمن، التقارير، الترجمة، الـ RLS، وربط النتائج بنسخة المحتوى التي اختبر عليها المتعلم.

### 3.1 Multi-Course Design Rules

CASC Academy هي أول محتوى يستخدم النظام وليست تعريف النظام نفسه. لذلك:

- لا يوجد أي FK أوRLS policy أوRPC تعتمد على slug يساوي casc-academy.
- كل سجل محتوى يُعزل عن الكورسات الأخرى عن طريق release_id، وكل release تتبع course واحدة.
- Domain وStation وConstruct وPractice Pack features اختيارية؛ يمكن لكورس آخر استخدام Modules وLessons وQuizzes فقط.
- أنواع الوحدات والتقييمات لا تُغلق داخل CHECK constraint خاص بـ CASC، بل تأتي من lookup tables قابلة للتوسعة.
- قواعد الإكمال والنجاح والنقاط والشهادات configuration مرتبطة بالـ release وليست شروطًا hardcoded داخل التطبيق.
- الـ UI يستخدم renderer registries بحسب unit kind وblock type وassessment kind، وليس if statements على course slug.
- enrollment لا يمكنها الإشارة إلى unit أوattempt أوrelease تابعة لكورس آخر.
- البيانات التاريخية لكل كورس ونسخة تظل مستقلة حتى لو كان المستخدم مشتركًا في عدة كورسات.

مسار الملكية الأساسي:

~~~text
courses
  -> course_releases
    -> learning_units
      -> blocks / assessments / production tasks / practice packs

users
  -> enrollments (course_id + release_id)
    -> progress / attempts / submissions / mastery / rewards
~~~

لا نكرر course_id في كل child table عندما يمكن اشتقاقه بأمان من release أوunit؛ حتى لا تتعارض القيم. في نقاط الربط الحساسة مثل enrollments وimports نحتفظ به مع constraint/trigger يثبت تطابقه مع release.

---

## 4. تقسيم الـ migrations

~~~text
supabase/migrations/
  0001_medlex_foundation.sql
  0002_learning_content.sql
  0003_assessments_and_mastery.sql
  0004_learning_records.sql
  0005_learning_security_and_rpcs.sql
  0006_seed_casc_academy.sql
~~~

كل migration يجب أن تعمل من الصفر بواسطة supabase db reset.

---

## 5. Content and Versioning Schema

### 5.1 الجداول الحالية

يتم الاحتفاظ بـ public.profiles وpublic.courses، مع:

- إضافة updated_at إلى courses.
- تطبيق trigger موحد لتحديث updated_at.
- عدم وضع محتوى الدروس داخل courses مباشرة.
- إبقاء courses جدولًا عامًا للمنتجات التعليمية، وليس جدول إعدادات CASC.

يضاف جدول public.course_categories اختياريًا لتصنيف الكورسات في الـ catalogue، وجدول ربط public.course_category_assignments بعلاقة many-to-many. التصنيف لا يتحكم في منطق التعلم.

### 5.2 Course Releases

جدول public.course_releases:

| العمود | النوع/الغرض |
|---|---|
| id | UUID PK |
| course_id | FK إلى courses |
| version_number | رقم النسخة |
| status | draft / published / archived |
| source_sha256 | بصمة ملف الـ ZIP |
| settings | JSONB لإعدادات العرض العامة غير الحساسة |
| published_at | وقت النشر |
| created_at / updated_at | timestamps |

Constraints:

- unique(course_id, version_number).
- Published releases immutable.
- كل enrollment ترتبط بالـ release التي بدأ عليها المستخدم.
- تعديل المحتوى بعد النشر ينشئ draft release جديدة.

يضاف جدول public.course_release_features:

- release_id.
- feature_key مثل assessments أوcompetencies أوpractice أوpoints أوcertificates.
- is_enabled.
- config JSONB.
- primary key(release_id, feature_key).

هذا يسمح لكورس جديد بتفعيل ما يحتاجه فقط دون إضافة أعمدة nullable جديدة إلى courses.

### 5.3 Learning Units

ينشأ lookup table عام public.learning_unit_kinds:

- id.
- key unique، مثل orientation أوmodule_hub أوlesson أوstation أوassessment_only.
- renderer_key.
- is_system.
- created_at.

إضافة نوع جديد تتم بسجل وrenderer جديدين، دون migration تغير CHECK constraint.

جدول public.learning_units يمثل أي وحدة تعليمية. في CASC سيمثل الصفحات الـ 52:

| العمود | الغرض |
|---|---|
| id | UUID PK |
| release_id | نسخة الكورس |
| parent_unit_id | Parent اختياري لبناء hierarchy بأي عمق |
| source_key | اسم ثابت مشتق من ملف المصدر |
| slug | رابط الوحدة داخل الكورس |
| unit_kind_id | FK إلى learning_unit_kinds |
| unit_code | كود عرض اختياري مثل 4.8 |
| sequence_number | الترتيب العام 00–51 |
| position_in_parent | الترتيب داخل Domain |
| estimated_seconds | الزمن المتوقع |
| is_required | هل تدخل في الإكمال |
| is_published | النشر داخل release |
| metadata | إعدادات نادرة فقط |
| created_at / updated_at | timestamps |

Constraints:

- unique(release_id, source_key).
- unique(release_id, slug).
- unique(release_id, sequence_number).
- parent_unit_id يجب أن ينتمي لنفس release.
- unit_kind_id لا يحمل منطق CASC داخل قاعدة البيانات.

بالنسبة لـ CASC: Domain يستخدم module_hub، وStation تستخدم station. كورس آخر يمكن أن يستخدم module_hub وlesson أوhierarchy مختلفة تمامًا.

أمثلة source_key:

~~~text
00_Start_Here
01_Domain_1_Hub_Communication_and_Rapport
02_Station_1.1_The_Simple_Station
~~~

### 5.4 Unit Translations

جدول public.learning_unit_translations:

- unit_id.
- locale: en أو ar.
- title.
- summary.
- eyebrow.
- lens_text.
- completion_title.
- completion_body.
- primary key(unit_id, locale).

الاستيراد الأول يضيف الإنجليزية فقط. عند غياب العربية يعرض التطبيق الإنجليزية كـ fallback بدل تخزين JSON عربي فارغ.

### 5.5 Content Blocks

جدول public.content_blocks:

- id.
- unit_id.
- source_key.
- block_type.
- sort_order.
- settings JSONB NOT NULL DEFAULT {}.
- is_required_for_progress.
- created_at / updated_at.
- unique(unit_id, source_key).
- unique(unit_id, sort_order).

جدول public.content_block_translations:

- block_id.
- locale.
- content JSONB.
- primary key(block_id, locale).

الـ block types المطلوبة:

| النوع | الاستخدام |
|---|---|
| heading | عنوان section |
| prose | نص منظم ومُعقم |
| callout | Lens / Note / Red Flag / Examiner Smile |
| dialogue_comparison | Fail 1 / Fail 2 / Pass |
| dialogue_turns | Candidate وPatient turns |
| takeaway_list | Take-home points |
| activity_ref | Learn أوExam activity |
| practice_pack_ref | Practice Pack |
| production_task_ref | الإجابة الإنشائية |
| cta | Next unit أوcompletion |
| divider | فاصل بصري |

كل examiner reveal داخل block يأخذ stable key مثل reveal-01 لكي يمكن تسجيله في progress/events.

لا يتم تخزين أو تنفيذ HTML/JavaScript الخام. المحتوى يتحول إلى rich-text JSON أو HTML محدود يتم تعقيمه على الخادم.

### 5.6 Media

جدول public.media_assets:

- id.
- storage_bucket.
- storage_path.
- mime_type.
- sha256.
- alt_text_en / alt_text_ar.
- created_at.
- unique(sha256).

الشعار المكرر Base64 في الصفحات الـ 52 يرفع مرة واحدة فقط إلى Supabase Storage.

---

## 6. Domains and Competencies

### 6.1 Competencies

جدول public.competencies:

- id.
- release_id.
- domain_unit_id.
- source_key.
- position.
- unique(release_id, source_key).
- unique(domain_unit_id, position).

جدول public.competency_translations:

- competency_id.
- locale.
- title.
- description.
- primary key(competency_id, locale).

جدول public.unit_competencies:

- unit_id.
- competency_id.
- is_primary.
- primary key(unit_id, competency_id).

هذه الجداول هي مصدر Mastery Spine في صفحات الـ Domain hubs، وتسمح لنفس Construct أن يظهر في أكثر من Station.

---

## 7. Assessments

### 7.1 Assessment Configuration

ينشأ lookup table public.assessment_kinds:

- id.
- key unique، مثل learn_decision أوtimed_exam أوknowledge_check أوsurvey.
- scoring_strategy_key.
- renderer_key.
- created_at.

جدول public.assessments:

- id.
- unit_id.
- source_key.
- assessment_kind_id: FK إلى assessment_kinds.
- duration_seconds.
- pass_score.
- require_all_critical.
- shuffle_options.
- allow_retry_per_question.
- feedback_policy: after_answer / after_submit / never.
- rules JSONB لإعدادات النوع غير المشتركة.
- sort_order.
- unique(unit_id, source_key).

الإعدادات القياسية:

| Mode | Duration | Pass | Critical | Retry | Feedback |
|---|---:|---:|---|---|---|
| Learn | بدون timer | كل الأسئلة | حسب المحتوى | حتى الصحيح | بعد كل اختيار |
| Exam | 420 ثانية | 5/7 | الثلاثة مطلوبة | لا | بعد submit |

### 7.2 Questions and Options

ينشأ كذلك public.question_kinds كـ lookup قابل للتوسعة بدل CHECK مغلق. النسخة الأولى تدعم single_choice وtrue_false، ويمكن لاحقًا إضافة multiple_choice أوfree_text أوfile_submission دون تغيير الجداول الأساسية.

جدول public.assessment_questions:

- id.
- assessment_id.
- source_key.
- question_kind_id: FK إلى question_kinds.
- sort_order.
- is_critical.
- critical_label.
- unique(assessment_id, source_key).
- unique(assessment_id, sort_order).
- critical_label مطلوب عندما is_critical = true.

جدول public.question_translations:

- question_id.
- locale.
- stem.
- explanation.
- primary key(question_id, locale).

جدول public.answer_options:

- id.
- question_id.
- source_key.
- sort_order.
- unique(question_id, source_key).
- unique(question_id, sort_order).

جدول public.answer_option_translations:

- option_id.
- locale.
- option_text.
- feedback.
- primary key(option_id, locale).

الـ feedback يوجد على مستوى الاختيار؛ لأن اختيارات Learn Mode الخاطئة لها تفسيرات مختلفة.

### 7.3 Private Answer Keys

ينشأ schema اسمه private وجدول private.question_answer_keys:

- question_id PK.
- correct_option_id FK.

لا يضاف is_correct إلى public.answer_options. التصحيح يتم فقط من خلال Security Definer RPC بعد التحقق من auth.uid() والـ enrollment والـ attempt.

### 7.4 Attempts

جدول public.assessment_attempts:

- id.
- enrollment_id.
- assessment_id.
- attempt_number.
- status: in_progress / submitted / expired / abandoned.
- started_at / submitted_at.
- elapsed_seconds.
- score / max_score.
- critical_misses.
- passed.
- unique(enrollment_id, assessment_id, attempt_number).

جدول public.attempt_question_order:

- attempt_id.
- question_id.
- question_position.
- option_order UUID array.
- primary key(attempt_id, question_id).
- unique(attempt_id, question_position).

جدول public.attempt_answers:

- id.
- attempt_id.
- question_id.
- selected_option_id.
- answer_sequence.
- is_correct.
- answered_at.
- unique(attempt_id, question_id, answer_sequence).

answer_sequence يحفظ محاولات Learn المتعددة. Exam يقبل إجابة واحدة فقط لكل سؤال، وتفرض الـ RPC هذه القاعدة.

---

## 8. Written Production

الجداول:

### public.production_tasks

- id.
- unit_id.
- source_key.
- minimum_characters DEFAULT 20.
- sort_order.
- unique(unit_id, source_key).

### public.production_task_translations

- task_id.
- locale.
- prompt.
- primary key(task_id, locale).

### public.production_criteria

- id.
- task_id.
- source_key.
- sort_order.
- unique(task_id, source_key).

### public.production_criterion_translations

- criterion_id.
- locale.
- criterion_text.
- primary key(criterion_id, locale).

### public.production_submissions

- id.
- enrollment_id.
- task_id.
- response_text.
- submitted_at.
- server-side minimum-length validation.

### public.production_self_checks

- submission_id.
- criterion_id.
- is_met.
- primary key(submission_id, criterion_id).

حفظ النص وتحقيق كل المعايير الأربعة المطلوبة يضيف Evidence لمستوى demonstrated.

---

## 9. Practice Packs and Rubrics

### 9.1 Dynamic Roles

جدول public.practice_packs:

- id.
- unit_id.
- source_key.
- station_duration_seconds DEFAULT 420.
- feedback_duration_seconds DEFAULT 480.
- unique(unit_id, source_key).

جدول public.practice_roles:

- id.
- practice_pack_id.
- source_key.
- role_type كنص غير مغلق.
- sort_order.
- contains_hidden_information.
- unique(practice_pack_id, source_key).

جدول public.practice_role_translations:

- role_id.
- locale.
- title.
- instructions JSONB.
- primary key(role_id, locale).

الـ API يعيد role card المطلوبة فقط. Hidden Patient information لا تظهر داخل Candidate payload.

### 9.2 Rubric Definition

الجداول:

- public.rubrics: pack_id وpass_rule.
- public.rubric_sections: rubric_id وsource_key وsort_order.
- public.rubric_section_translations: section_id وlocale وtitle.
- public.rubric_items: section_id وsource_key وsort_order وweight وis_critical.
- public.rubric_item_translations: item_id وlocale وitem_text.

تضاف unique constraints للترتيب والمفاتيح داخل كل parent.

### 9.3 Practice Sessions

جدول public.practice_sessions:

- id.
- enrollment_id.
- practice_pack_id.
- status: planned / in_progress / completed / cancelled.
- started_at / completed_at / created_at.

جدول public.practice_participants:

- session_id.
- role_id.
- user_id nullable.
- display_name nullable.
- يجب وجود user_id أوdisplay_name.
- primary key(session_id, role_id).

جدول public.rubric_submissions:

- id.
- session_id unique.
- submitted_by.
- overall_rating: pass / borderline / fail.
- evidence_note مطلوب.
- submitted_at.

جدول public.rubric_item_scores:

- submission_id.
- rubric_item_id.
- achieved.
- primary key(submission_id, rubric_item_id).

Rubric مكتملة وoverall_rating = pass تضيف Evidence لمستوى validated.

---

## 10. Enrollments and Progress

### 10.1 Enrollments

يستبدل التصميم القديم بجدول public.enrollments يحتوي على:

- id.
- user_id.
- course_id.
- release_id.
- last_accessed_unit_id.
- status: active / completed / expired / paused / cancelled.
- enrolled_at.
- access_starts_at.
- expires_at.
- completed_at.
- updated_at.

Partial unique index:

~~~sql
create unique index one_open_enrollment_per_course
on public.enrollments(user_id, course_id)
where status in ('active', 'paused');
~~~

هذا يسمح بتاريخ إعادة التسجيل، ويمنع وجود اشتراكين مفتوحين في نفس الوقت.

لا نخزن current_step_order. يتم حساب Next Unit من sequence_number والوحدات المطلوبة غير المكتملة. Trigger يتحقق أن release تتبع course وأن last_accessed_unit تتبع نفس release.

### 10.2 Unit Progress

جدول public.unit_progress:

- enrollment_id.
- unit_id.
- status: not_started / in_progress / completed.
- progress_percent من 0 إلى 100.
- started_at / completed_at / last_accessed_at / updated_at.
- primary key(enrollment_id, unit_id).

أوزان Station الحالية:

| النشاط | الوزن |
|---|---:|
| مشاهدة الأقسام المطلوبة | 30% |
| فتح reveals المطلوبة | 25% |
| حل Learn decisions | 25% |
| إكمال Exam attempt | 20% |

نسبة الصفحة ليست Mastery level.

### 10.3 Mastery Evidence

جدول public.mastery_evidence:

- id.
- enrollment_id.
- competency_id.
- unit_id.
- mastery_level: explored / recognised / demonstrated / validated.
- source_type: learn_completion / exam_attempt / production_submission / practice_rubric.
- source_id.
- achieved_at.
- revoked_at.
- unique على enrollment + competency + unit + level + source.

القواعد:

- Explored: كل Learn questions والـ required reveals/sections اكتملت.
- Recognised: Exam score على الأقل 5/7 وكل Critical questions صحيحة.
- Demonstrated: production محفوظ وكل self-check criteria متحققة.
- Validated: peer practice rubric مكتملة والنتيجة Pass.

أعلى مستوى لكل Construct يُحسب من Evidence ولا يكتب من المتصفح.

### 10.4 Course Completion

قواعد الإكمال لا تُكتب داخل RPC باسم CASC. ينشأ جدول public.course_completion_policies:

- id.
- release_id.
- policy_key.
- policy_type: all_required_units أوminimum_units أوminimum_mastery أوassessment_pass أوmanual.
- config JSONB validated server-side.
- sort_order.
- is_required.
- unique(release_id, policy_key).

تقيّم RPC السياسات المطلوبة للـ release. يمكن أن تجمع release أكثر من شرط، ويمكن لكورس جديد استخدام completion model مختلف دون migration.

سياسة CASC الافتراضية تُخزن كسجلات configuration:

- Orientation مكتملة.
- Domain hubs المطلوبة مكتملة.
- جميع الـ 43 Stations وصلت على الأقل إلى Recognised.

Demonstrated وValidated درجات أعلى اختيارية ولا تمنع الشهادة الأساسية.

لا يستخدم auto-advance trigger يعتمد على الصفحة التي انتهت. بعد كل نشاط موثوق، تستدعى RPC تعيد حساب unit progress ثم course completion داخل transaction.

أي كورس لا يستخدم Competencies يعتمد على unit_progress وcompletion policies فقط؛ جدول mastery_evidence اختياري ولا يعيق إكماله.

---

## 11. Learning Sessions and Events

جدول public.learning_sessions:

- id.
- enrollment_id.
- unit_id.
- started_at / ended_at.
- active_seconds.
- last_heartbeat_at.
- client_session_key.
- unique(enrollment_id, client_session_key).

جدول public.learning_events:

- bigint identity id.
- session_id.
- event_type.
- unit_id.
- block_id nullable.
- activity_key nullable.
- occurred_at.
- payload JSONB.
- idempotency_key unique.

Initial event types:

~~~text
unit_viewed
section_seen
reveal_opened
learn_option_selected
learn_question_completed
exam_started
exam_submitted
production_submitted
role_card_printed
practice_validated
~~~

Events للتحليلات، لكن attempts وprogress وmastery هي مصدر الحقيقة.

الوقت يُحسب بواسطة heartbeat مع server-side cap، وليس browser unload فقط.

لا يوجد anonymous tracking داخل Academy في النسخة الأولى.

---

## 12. Points and Certificates

### public.point_ledger

- id.
- user_id.
- enrollment_id nullable.
- points.
- reason.
- source_type.
- source_id.
- created_at.
- unique(user_id, source_type, source_id) لمنع تكرار المكافأة.

### public.certificates

- id.
- certificate_number unique.
- enrollment_id unique.
- recipient_name_snapshot.
- course_title_snapshot.
- release_version_snapshot.
- issued_at.
- revoked_at / revocation_reason.
- storage_path.

### public.certificate_download_events

- identity id.
- certificate_id.
- user_id.
- downloaded_at.

النقاط والشهادة تصدر من server-side RPC فقط بعد تحقق completion policy.

---

## 13. RLS and Security

### 13.1 Admin Helper

إنشاء private.is_admin(requesting_user uuid) كدالة stable وSECURITY DEFINER، بدل استعلام profiles مباشرة داخل policy على profiles لتجنب recursive RLS.

يتم سحب EXECUTE من public ومنحه للأدوار المطلوبة فقط، مع search_path ثابت.

### 13.2 Access Rules

- الزائر يقرأ بيانات catalogue المنشورة فقط.
- محتوى Academy الكامل يحتاج مستخدمًا authenticated وenrollment فعالًا وغير منتهي لنفس release.
- المتعلم يقرأ سجلاته فقط.
- المتعلم لا يستطيع كتابة passed أوscore أوmastery أوpoints أوcompletion أوcertificate مباشرة.
- private.question_answer_keys غير متاحة للعميل.
- hidden role information تُعاد من endpoint/RPC scoped لدور محدد.
- Admin policies تحتوي على USING وWITH CHECK.
- Analytics لا يمكن قراءتها بواسطة المتعلمين.
- كل mutation تتحقق من auth.uid() والملكية والصلاحية والـ release والـ idempotency key.
- حذف المحتوى المنشور الذي له learner records ممنوع؛ يستخدم archive بدل الحذف.

### 13.3 Transactional RPCs

~~~text
start_assessment
submit_learn_answer
submit_exam_attempt
submit_production
create_practice_session
submit_practice_rubric
record_learning_event
recalculate_unit_progress
recalculate_course_completion
issue_completion_rewards
~~~

submit_exam_attempt تصحح الإجابات وتثبت attempt والـ mastery داخل transaction واحدة، ولا ترجع مفاتيح الإجابات قبل submission.

---

## 14. Indexes and Integrity

Indexes الأساسية:

~~~text
learning_units(release_id, sequence_number)
learning_units(parent_unit_id, position_in_parent)
content_blocks(unit_id, sort_order)
competencies(domain_unit_id, position)
unit_competencies(unit_id, competency_id)
assessments(unit_id, assessment_kind_id)
assessment_questions(assessment_id, sort_order)
answer_options(question_id, sort_order)
enrollments(user_id, status)
unit_progress(enrollment_id, status)
assessment_attempts(enrollment_id, assessment_id, started_at desc)
attempt_answers(attempt_id, question_id)
mastery_evidence(enrollment_id, competency_id, mastery_level)
learning_events(session_id, occurred_at)
point_ledger(user_id, created_at desc)
~~~

Integrity rules:

- parent unit ونجلها من نفس release.
- enrollment course وrelease متوافقان.
- option المختارة تتبع question المرسلة.
- attempt تتبع enrollment وصاحب الطلب.
- published release immutable.
- set_updated_at trigger موحد.
- ترتيب units/blocks/questions/options فريد داخل الـ parent.
- Rewards idempotent ولا تصدر مرتين لنفس المصدر.

---

## 15. ZIP Importer

### 15.1 الملفات الجديدة

~~~text
scripts/course-importers/
  core/
    importer-contract.ts
    import-runner.ts
    shared-validation.ts
  casc/
    extract-casc-archive.ts
    parse-orientation.ts
    parse-domain-hub.ts
    parse-station.ts
    validate-casc-content.ts
    build-seed.ts
    types.ts

artifacts/casc-import/
  casc-academy.manifest.json
  casc-academy.validation.json
~~~

يمكن استخدام parse5 أوcheerio لتحليل HTML وacorn لتحليل EXAM array. ممنوع تنفيذ JavaScript الموجود في HTML باستخدام eval أوbrowser context.

كل importer جديد يطبق نفس العقد العام ويخرج Course Import Manifest موحدًا. CASC parser يبقى adapter خاص بصيغة CASC، بينما الحفظ في الجداول والتحقق من العزل بين الكورسات يتمان في import-runner العام.

يضاف جدول public.content_imports:

- id.
- course_id.
- release_id.
- importer_key.
- source_filename.
- source_sha256.
- status: pending / validated / imported / failed.
- validation_report JSONB.
- started_at / completed_at.

هذا يجعل النظام مستعدًا لاستيراد كورسات مستقبلية من ZIP أوCSV أوCMS دون ربط schema بمصدر CASC.

### 15.2 خطوات الاستيراد

1. حساب ZIP SHA-256.
2. قراءة README_FILE_ORDER.md كمصدر الترتيب.
3. التأكد من وجود الملفات 00–51 مرة واحدة.
4. إنشاء draft course release.
5. إنشاء 52 learning units بمفاتيح ثابتة.
6. ربط 43 Station بالـ 8 Domains.
7. استخراج 61 Construct والربط بالمحطات.
8. تحويل الأقسام التحريرية إلى typed blocks.
9. استخراج Learn questions وper-option feedback والإجابات.
10. استخراج Exam questions وcritical flags والتفسيرات والـ pass rule.
11. استخراج production prompt وأربعة criteria لكل Station.
12. استخراج الأدوار الديناميكية والـ hidden information والـ rubrics.
13. رفع الشعار مرة واحدة بدل Base64 المكرر.
14. إنشاء deterministic manifest وseed.
15. نشر release فقط بعد نجاح validation.

### 15.3 Import Invariants

الاستيراد يفشل إذا لم تتحقق الأرقام التالية:

~~~text
52 units
1 orientation
8 domain hubs
43 stations
61 constructs
311 Learn questions
301 Exam questions
129 Critical Exam questions
3 options لكل سؤال مستورد
7 Learn + 7 Exam لكل Station
420 seconds لكل Station Exam
43 production tasks
4 production criteria لكل Station
130 practice role cards
559 rubric items
next-link chain واحدة من 00 إلى 51
~~~

الـ importer يدعم --dry-run، وإعادة تشغيله على نفس draft لا تنشئ duplicates، ويرفض الكتابة على published release.

---

## 16. Application Structure

### 16.1 Types and Server Layer

~~~text
types/learning.ts
types/assessment.ts
types/practice.ts

server/learning/course-repository.ts
server/learning/unit-repository.ts
server/learning/progress-repository.ts
server/learning/assessment-service.ts
server/learning/practice-service.ts
~~~

يتم توليد Database TypeScript types من Supabase بعد migrations بدل صيانة ملف types/database.ts يدويًا.

Learner DTOs لا تحتوي على:

- correct option IDs قبل السماح بالـ feedback.
- Exam explanations قبل submit.
- hidden role information في Candidate payload.
- analytics أوadmin metadata.

### 16.2 Routes

~~~text
app/[locale]/(academy)/academy/courses/[courseSlug]/page.tsx
app/[locale]/(academy)/academy/courses/[courseSlug]/[unitSlug]/page.tsx

app/api/academy/assessments/start/route.ts
app/api/academy/assessments/learn-answer/route.ts
app/api/academy/assessments/exam-submit/route.ts
app/api/academy/production/submit/route.ts
app/api/academy/practice/session/route.ts
app/api/academy/practice/rubric/route.ts
app/api/academy/events/route.ts
~~~

Academy routes تنقل خارج marketing route group وتتحقق من enrollment.

### 16.3 Components

~~~text
components/academy/content/ContentBlockRenderer.tsx
components/academy/content/DialogueComparisonBlock.tsx
components/academy/content/ExaminerReveal.tsx
components/academy/content/TakeawayList.tsx

components/academy/assessment/LearnDecision.tsx
components/academy/assessment/ExamMode.tsx
components/academy/assessment/ExamTimer.tsx
components/academy/assessment/ExamResults.tsx
components/academy/assessment/ProductionTask.tsx

components/academy/practice/PracticePack.tsx
components/academy/practice/RoleCard.tsx
components/academy/practice/ObserverRubric.tsx

components/academy/progress/UnitProgress.tsx
components/academy/progress/MasterySpine.tsx
~~~

كل mutation تعرض loading/saved/error feedback واضح، وتمنع duplicate submission أثناء الطلب.

تستخدم الواجهة registries عامة:

~~~text
unitKindRenderers[unitKind.renderer_key]
blockRenderers[block.block_type]
assessmentRenderers[assessmentKind.renderer_key]
~~~

مكونات CASC الخاصة تُسجل داخل هذه الـ registries، لكن الـ course route والـ repositories لا تعرف اسم CASC ولا slug الخاص بها.

---

## 17. مراحل التنفيذ

### Phase 1 — Schema and Security

- إنشاء migrations من 0002 إلى 0005.
- توليد Supabase types.
- تطبيق RLS.
- تنفيذ assessment/progress RPCs.
- إنشاء test users للأدوار المختلفة.

### Phase 2 — Import

- بناء ZIP importer.
- إنتاج manifest وvalidation report.
- Seed لـ draft release.
- مقارنة الأعداد والنصوص بكل ملفات المصدر.
- نشر release بعد نجاح التحقق.

### Phase 3 — Read-Only Rendering

- Course وDomain Hub وOrientation وStation routes.
- Typed block renderer.
- Locale fallback.
- Responsive وaccessibility verification.

### Phase 4 — Learn and Exam

- Retry وfeedback في Learn.
- Timer وshuffle وsubmission وقاعدة Critical في Exam.
- Results/review/retake history.
- Progress وMastery Spine.

### Phase 5 — Production and Practice

- Written production وself-check.
- Dynamic role cards والطباعة.
- Observer rubrics وpeer validation.

### Phase 6 — Records and Dashboard

- استبدال dashboard placeholders ببيانات فعلية.
- Resume next unit.
- Attempt history.
- Points والشهادات.

### Phase 7 — Admin Workflow

- البداية بالـ importer وSupabase administration.
- بناء CMS بصري بعد استقرار learner workflow.
- CMS يعدل draft release فقط.

---

## 18. Verification

### Migration

- supabase db reset ينجح.
- كل constraints وFKs وimmutable guards تعمل.
- إعادة seed لا تكرر السجلات.

### RLS Matrix

الاختبار كـ:

- anonymous.
- authenticated without enrollment.
- active learner.
- expired learner.
- different learner.
- admin.

Assertions إلزامية:

- لا يمكن قراءة answer keys.
- لا يمكن للمتعلم منح نفسه نتيجة أوmastery أوpoints أوcertificate.
- Candidate لا يستطيع طلب hidden role content.
- Expired enrollment لا يبدأ attempt جديدة.
- مستخدم لا يقرأ سجلات مستخدم آخر.

### Assessment

- Learn يسجل كل retry بالتسلسل.
- Exam يقبل إجابة واحدة لكل سؤال.
- option order ثابت داخل attempt.
- 5/7 مع كل Critical ينجح.
- 7/7 مع Critical miss يفشل.
- timer expiry يتبع قاعدة موثقة.
- retakes تحتفظ بنتائج المحاولة الأولى واللاحقة.
- idempotency تمنع تكرار attempts أوrewards.

### Progress and Mastery

- أوزان Station تعطي النسبة الصحيحة.
- Exam pass يضيف Recognised مرة واحدة.
- Self-check الكامل يضيف Demonstrated مرة واحدة.
- Rubric Pass تضيف Validated مرة واحدة.
- إكمال Station قديمة لا يحرك resume للخلف.
- Draft/optional units لا تمنع completion.
- Mastery Spine مشتقة بشكل صحيح.

### Import

- كل invariants في القسم 15.3 تمر.
- كل ملف مصدر ينتج unit واحدة.
- next links تطابق sequence_number.
- لا يتم استيراد JavaScript أوBase64 المكرر.
- Unicode والاقتباسات والمصطلحات الطبية تحفظ كـ UTF-8.

### Multi-Course Isolation

- إنشاء fixture لكورس ثانٍ به Modules وLessons فقط وبدون Constructs أوPractice Packs.
- تسجيل نفس المستخدم في الكورسين والتأكد من استقلال progress وattempts وrewards.
- منع ربط enrollment من Course A بـ release أوunit من Course B.
- منع تكرار slug داخل نفس release، مع السماح بنفس unit slug في كورسين مختلفين.
- تغيير completion policy في الكورس الثاني دون التأثير على CASC.
- تعطيل practice أوcertificates في release لا تستخدمها دون أخطاء أوصفوف وهمية.

### Manual UX

- اختبار Orientation وDomain وStation عادية وInterpreter Station.
- اختبار mobile وdesktop وkeyboard.
- اختبار refresh في Learn وExam.
- اختبار loading/error/timeout/blank/pass/fail states.
- التأكد من عدم كشف hidden cards في الطباعة.
- التأكد من English fallback عند غياب العربية.

---

## 19. خارج نطاق الإصدار الأول

- نقل FAQ وPathways وباقي marketing pages.
- Anonymous Academy progress.
- Video calls أو جدولة practice partners.
- AI grading للإجابة الإنشائية.
- Full visual CMS قبل اكتمال learner workflow.
- تعديل published release في مكانها.

---

## 20. Definition of Done

يعتبر النظام مكتملًا عندما:

1. تمثل قاعدة البيانات كل صفحات المصدر الـ 52.
2. يطابق الترتيب والـ Domain hierarchy ملف الـ ZIP.
3. تعمل Learn وExam وproduction وpractice وrubrics وmastery مثل المصدر.
4. لا يستطيع المتعلم الوصول إلى answer keys أوhidden role information.
5. يحفظ progress عبر refresh والأجهزة.
6. تظل النتائج مرتبطة بالـ release التي تمت عليها.
7. تمر اختبارات RLS وRPC لكل الأدوار.
8. يستخدم Dashboard سجلات enrollments وprogress وpoints وcertificates الحقيقية.
9. يمكن إضافة العربية دون تغيير الـ schema.
10. يمكن استيراد draft release جديدة دون تغيير سجلات المتعلمين التاريخية.
11. يمكن إضافة كورس ثانٍ ببنية وقواعد مختلفة دون تعديل جداول CASC أونسخها.
12. لا توجد أي قاعدة بيانات أوRLS أوroute تعتمد على course slug لتحديد السلوك.
