import { redirect } from "next/navigation";

/**
 * Root page — immediately redirects to the default locale.
 * The middleware handles all other non-locale paths.
 */
export default function RootPage() {
  redirect("/en");
}
