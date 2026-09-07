import CourseCompletion from "../../../_comps/CourseCompletion";
export default async function CompletionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return <CourseCompletion locale={locale} courseSlug={slug} />;
}
