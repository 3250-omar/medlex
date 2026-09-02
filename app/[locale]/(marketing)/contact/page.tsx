import EditorialPage from "@/components/marketing/EditorialPage";

export default function ContactPage() {
  return (
    <EditorialPage
      eyebrow="Contact MedLex"
      title="Bring us the question behind the question."
      intro="For course guidance, institutional partnerships, or speaking enquiries, send a note and our team will respond."
      sections={[
        {
          eyebrow: "Email",
          title: "info@medlex.academy",
          body: "For general enquiries and course support.",
        },
        {
          eyebrow: "Institutions",
          title: "Partnership enquiries",
          body: "Tell us about your team, audience, and the outcome you want to build.",
        },
        {
          eyebrow: "Response",
          title: "A considered reply",
          body: "We aim to respond with a useful next step, not a generic inbox receipt.",
        },
      ]}
      cta={{ label: "Register your interest", href: "/register" }}
    />
  );
}
