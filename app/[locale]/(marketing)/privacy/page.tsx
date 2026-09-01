import EditorialPage from "@/components/marketing/EditorialPage";

export default function PrivacyPage() {
  return <EditorialPage eyebrow="Legal / Privacy" title="Your information, handled with care." intro="This page explains the principles MedLex follows when collecting and using information through the platform." sections={[{ eyebrow: "Collection", title: "Only what we need", body: "We collect information required to provide course access, respond to enquiries, and improve the learning experience." }, { eyebrow: "Control", title: "Your choices matter", body: "You can request access, correction, or deletion of your personal information by contacting the MedLex team." }, { eyebrow: "Protection", title: "Designed for trust", body: "Access controls, secure storage, and server-side authorization help protect account and learning data." }]} />;
}
