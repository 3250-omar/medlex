import EditorialPage from "@/components/marketing/EditorialPage";

export default function RefundPolicyPage() {
  return <EditorialPage eyebrow="Legal / Refunds" title="A straightforward approach to refunds." intro="Our refund approach is designed to be clear before you enrol and fair when circumstances change." sections={[{ eyebrow: "Before access", title: "Cancel with clarity", body: "Requests made before course access begins can be reviewed for a full refund, subject to the published course terms." }, { eyebrow: "After access", title: "Talk to the team", body: "If access has started, contact us promptly. We review exceptional circumstances individually and explain the outcome." }, { eyebrow: "Contact", title: "Keep your receipt", body: "Include your order reference and registered email when contacting info@medlex.academy so we can help quickly." }]} />;
}
