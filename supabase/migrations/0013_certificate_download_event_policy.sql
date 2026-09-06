-- Allow learners to record downloads of certificates issued for their own enrollments.
create policy "learners record own certificate downloads"
on public.certificate_download_events
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.certificates certificate
    join public.enrollments enrollment
      on enrollment.id = certificate.enrollment_id
    where certificate.id = certificate_download_events.certificate_id
      and enrollment.user_id = auth.uid()
  )
);