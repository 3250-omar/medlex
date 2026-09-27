-- Seed course features from i18n JSON
UPDATE public.courses
SET 
  features_en = ARRAY[
    'Live interactive online, cohort-based',
    'Bilingual English and Arabic',
    'One knowledge base, adapted for clinical and legal audiences'
  ],
  features_ar = ARRAY[
    'تفاعلي مباشر عبر الإنترنت، قائم على دفعات',
    'ثنائي اللغة: الإنجليزية والعربية',
    'قاعدة معرفية واحدة، مكيّفة للجمهورين الإكلينيكي والقانوني'
  ]
WHERE slug = 'medico-legal';

UPDATE public.courses
SET 
  features_en = ARRAY[
    'Self-paced online, 6 months'' access',
    'English only',
    'Interactive stations, not recorded lectures'
  ],
  features_ar = ARRAY[
    'تعلّم ذاتي عبر الإنترنت، وصول لمدة ٦ أشهر',
    'باللغة الإنجليزية فقط',
    'محطات تفاعلية تحاكي الواقع، وليست محاضرات مسجلة'
  ]
WHERE slug = 'casc-academy';

UPDATE public.courses
SET 
  features_en = ARRAY[
    'Self-paced & live interactive',
    'Bilingual English & Arabic',
    'New programmes added continuously'
  ],
  features_ar = ARRAY[
    'برامج ذاتية وتفاعلية مباشرة',
    'ثنائي اللغة: الإنجليزية والعربية',
    'برامج جديدة تُضاف تباعًا'
  ]
WHERE slug = 'foundations';
