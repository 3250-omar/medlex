import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sParams = await searchParams;

  const query = new URLSearchParams();
  query.set("tab", "sign-in");

  if (sParams) {
    Object.entries(sParams).forEach(([key, val]) => {
      if (key !== "tab" && typeof val === "string") {
        query.set(key, val);
      }
    });
  }

  redirect(`/${locale}/auth?${query.toString()}`);
}
