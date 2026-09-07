import AudienceSection from "./AudienceSection";
import CascAcademyLanding from "./CascAcademyLanding";
import FeatureSection from "./FeatureSection";
import FormatsSection from "./FormatsSection";
import PathwayFaqSection from "./PathwayFaqSection";
import PathwayFounderSection from "./PathwayFounderSection";
import PathwayHeroSection from "./PathwayHeroSection";
import ProgrammesSection from "./ProgrammesSection";
import {
  type PathwayContent,
  type PathwayKey,
  type PathwayLabels,
} from "./pathwayContent";

type PathwayDetailPageProps = {
  pathway: PathwayKey;
  content: PathwayContent;
  labels: PathwayLabels;
};

export default function PathwayDetailPage({
  pathway,
  content,
  labels,
}: PathwayDetailPageProps) {
  if (pathway === "casc-academy") {
    return <CascAcademyLanding content={content} labels={labels} />;
  }

  return (
    <main className="bg-ink text-white ">
      <PathwayHeroSection pathway={pathway} content={content} labels={labels} />
      <AudienceSection audience={content.audience} />
      {content.feature ? <FeatureSection feature={content.feature} /> : null}
      {content.formats ? <FormatsSection formats={content.formats} /> : null}
      {content.programmes ? (
        <ProgrammesSection
          pathway={pathway}
          programmes={content.programmes}
          programmeLabel={labels.programme}
        />
      ) : null}
      <PathwayFounderSection founder={content.founder} />
      {content.faqs ? (
        <PathwayFaqSection
          faqs={content.faqs}
          eyebrow={labels.faqEyebrow}
          title={labels.faqTitle}
        />
      ) : null}
    </main>
  );
}
