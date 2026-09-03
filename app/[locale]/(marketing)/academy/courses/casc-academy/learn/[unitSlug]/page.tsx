import LearningLesson from "../../../../_comps/LearningLesson";

export default async function CascLearningPage({
  params,
}: {
  params: Promise<{ locale: string; unitSlug: string }>;
}) {
  const { locale, unitSlug } = await params;
  return (
    <LearningLesson
      locale={locale}
      courseSlug="casc-academy"
      unitSlug={unitSlug}
    />
  );
}
