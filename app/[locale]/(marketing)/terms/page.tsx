import EditorialPage from "@/components/marketing/EditorialPage";

export default function TermsPage() {
  return <EditorialPage eyebrow="Legal / Terms" title="Clear terms for a serious learning platform." intro="These terms set out the conditions for using MedLex courses, account services, and platform materials." sections={[{ eyebrow: "Access", title: "Personal and considered", body: "Course access is provided to the registered learner for the period and scope described at purchase or enrolment." }, { eyebrow: "Materials", title: "Learn, don't redistribute", body: "MedLex content is protected material and may not be copied, resold, or published without written permission." }, { eyebrow: "Standards", title: "Professional use", body: "Course content supports education and professional development; it is not a substitute for case-specific legal or clinical advice." }]} />;
}
