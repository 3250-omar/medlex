import EditorialPage from "@/components/marketing/EditorialPage";

export default function CoursesPage() {
  return (
    <EditorialPage
      eyebrow="The catalogue"
      title="Learn the work behind the evidence."
      intro="Explore structured courses designed to move from foundational understanding to confident medicolegal practice."
      sections={[
        {
          eyebrow: "Flagship",
          title: "Forensic Psychiatry Essentials",
          body: "A practical foundation in assessment, formulation, report writing, and courtroom communication.",
        },
        {
          eyebrow: "Academy",
          title: "CASC Academy",
          body: "A focused preparation pathway for clinicians building confidence through structured practice.",
        },
        {
          eyebrow: "Coming soon",
          title: "Advanced pathways",
          body: "More specialist courses and institutional cohorts are being shaped with the MedLex community.",
        },
      ]}
      cta={{ label: "Register for updates", href: "/register" }}
    />
  );
}
