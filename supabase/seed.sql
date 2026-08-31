insert into public.courses (slug, title_en, title_ar, description_en, price, access_duration_days, points_on_completion, is_published)
values
  ('writing-psychiatric-evidence', 'Writing Psychiatric Evidence', 'كتابة الأدلة النفسية', 'A structured pathway to court-conscious psychiatric reporting.', 0, 365, 100, true),
  ('casc-academy', 'The CASC Academy', 'أكاديمية CASC', 'Self-paced preparation for the MRCPsych CASC examination.', 0, 365, 100, true)
on conflict (slug) do nothing;
