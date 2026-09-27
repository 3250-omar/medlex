-- Seed course titles and descriptions from i18n JSON
UPDATE public.courses
SET 
  title_en = 'Medico-Legal Education',
  title_ar = 'التعليم الطبي القانوني',
  description_en = 'A progressive framework in four levels — fourteen foundation masterclasses, professional skills programmes, a three-month blended programme and advanced certification. Home of the flagship programme, Writing Psychiatric Evidence.',
  description_ar = 'إطار متدرج في أربعة مستويات — أربع عشرة ماستر كلاس تأسيسية، وبرامج مهارات مهنية، وبرنامج مدمج لمدة ثلاثة أشهر، واعتماد متقدم. موطن البرنامج الرائد: كتابة الدليل النفسي'
WHERE slug = 'medico-legal';

UPDATE public.courses
SET 
  title_en = 'The CASC Academy',
  title_ar = 'أكاديمية CASC',
  description_en = 'A self-paced digital preparation library that mirrors the real examination — 43 stations across eight domains, each taken apart from the examiner''s side of the table, with particular attention to international candidates.',
  description_ar = 'مكتبة تحضير رقمية ذاتية التعلّم تحاكي الامتحان الحقيقي — 43 محطة عبر ثمانية مجالات، مفككة بدقة من جانب الممتحن، مع اهتمام خاص بالمتقدمين الدوليين'
WHERE slug = 'casc-academy';

UPDATE public.courses
SET 
  title_en = 'MedLex Foundations',
  title_ar = 'مِدلكس للتأسيس',
  description_en = 'An expandable portfolio for the professional skills clinicians need throughout their careers but are rarely taught — opening with The Clinician''s Edge and the Clinical Leadership Programme.',
  description_ar = 'محفظة برامج مرنة ومتوسعة للمهارات المهنية التي يحتاجها الأطباء في مسيرتهم ونادرًا ما تُدرَّس — تُفتتح ببرنامج حافة الممارس وبرنامج القيادة الإكلينيكية'
WHERE slug = 'foundations';
