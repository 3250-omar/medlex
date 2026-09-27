-- Insert initial courses into the database if they do not exist
-- Update them if they already exist

INSERT INTO public.courses (
  slug, 
  title_en, title_ar, 
  description_en, description_ar, 
  features_en, features_ar,
  course_status, is_published, 
  price, currency
) 
VALUES 
(
  'medico-legal',
  'Medico-Legal Education',
  'التعليم الطبي القانوني',
  'A progressive framework in four levels — fourteen foundation masterclasses, professional skills programmes, a three-month blended programme and advanced certification. Home of the flagship programme, Writing Psychiatric Evidence.',
  'إطار متدرج في أربعة مستويات — أربع عشرة ماستر كلاس تأسيسية، وبرامج مهارات مهنية، وبرنامج مدمج لمدة ثلاثة أشهر، واعتماد متقدم. موطن البرنامج الرائد: كتابة الدليل النفسي',
  ARRAY[
    'Live interactive online, cohort-based',
    'Bilingual English and Arabic',
    'One knowledge base, adapted for clinical and legal audiences'
  ],
  ARRAY[
    'تفاعلي مباشر عبر الإنترنت، قائم على دفعات',
    'ثنائي اللغة: الإنجليزية والعربية',
    'قاعدة معرفية واحدة، مكيّفة للجمهورين الإكلينيكي والقانوني'
  ],
  'waiting_list',
  true,
  0,
  'EGP'
),
(
  'casc-academy',
  'The CASC Academy',
  'أكاديمية CASC',
  'A self-paced digital preparation library that mirrors the real examination — 43 stations across eight domains, each taken apart from the examiner''s side of the table, with particular attention to international candidates.',
  'مكتبة تحضير رقمية ذاتية التعلّم تحاكي الامتحان الحقيقي — 43 محطة عبر ثمانية مجالات، مفككة بدقة من جانب الممتحن، مع اهتمام خاص بالمتقدمين الدوليين',
  ARRAY[
    'Self-paced online, 6 months'' access',
    'English only',
    'Interactive stations, not recorded lectures'
  ],
  ARRAY[
    'تعلّم ذاتي عبر الإنترنت، وصول لمدة ٦ أشهر',
    'باللغة الإنجليزية فقط',
    'محطات تفاعلية تحاكي الواقع، وليست محاضرات مسجلة'
  ],
  'active',
  true,
  0,
  'EGP'
),
(
  'foundations',
  'MedLex Foundations',
  'مِدلكس للتأسيس',
  'An expandable portfolio for the professional skills clinicians need throughout their careers but are rarely taught — opening with The Clinician''s Edge and the Clinical Leadership Programme.',
  'محفظة برامج مرنة ومتوسعة للمهارات المهنية التي يحتاجها الأطباء في مسيرتهم ونادرًا ما تُدرَّس — تُفتتح ببرنامج حافة الممارس وبرنامج القيادة الإكلينيكية',
  ARRAY[
    'Self-paced & live interactive',
    'Bilingual English & Arabic',
    'New programmes added continuously'
  ],
  ARRAY[
    'برامج ذاتية وتفاعلية مباشرة',
    'ثنائي اللغة: الإنجليزية والعربية',
    'برامج جديدة تُضاف تباعًا'
  ],
  'launching',
  true,
  0,
  'EGP'
)
ON CONFLICT (slug) DO UPDATE 
SET 
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  features_en = EXCLUDED.features_en,
  features_ar = EXCLUDED.features_ar,
  course_status = EXCLUDED.course_status,
  is_published = EXCLUDED.is_published;
