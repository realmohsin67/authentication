import { requireAuthenticatedButNotVerified } from "@/utils/auth-route-guards";
import { cookies, headers } from "next/headers";

interface VerifyPageLayoutProps {
  children: React.ReactNode;
}

export default async function VerifyPageLayout({
  children,
}: VerifyPageLayoutProps) {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAuthenticatedButNotVerified(cookieStore, headersList);
  return <>{children}</>;
}
