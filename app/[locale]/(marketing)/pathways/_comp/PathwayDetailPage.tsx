import AudienceSection from "./AudienceSection";
import CascAcademyLanding from "./CascAcademyLanding";
import MedicoLegalLanding from "./MedicoLegalLanding";
import FoundationsLanding from "./FoundationsLanding";
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
  locale?: string;
  pathway: PathwayKey;
  content: PathwayContent;
  labels: PathwayLabels;
  courseData?: { price: number; currency: string } | null;
};

export default function PathwayDetailPage({
  locale,
  pathway,
  content,
  labels,
  courseData,
}: PathwayDetailPageProps) {
  if (pathway === "casc-academy") {
    return (
      <CascAcademyLanding
        content={content}
        labels={labels}
        courseData={courseData}
      />
    );
  }

  if (pathway === "medico-legal") {
    return (
      <MedicoLegalLanding
        content={content}
        labels={labels}
        courseData={courseData}
      />
    );
  }

  if (pathway === "foundations") {
    return (
      <FoundationsLanding
        content={content}
        labels={labels}
        courseData={courseData}
      />
    );
  }

  return (
    <main className="bg-navy text-lbody">
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
      <PathwayFounderSection founder={content.founder} locale={locale} />
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
