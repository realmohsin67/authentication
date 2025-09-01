import { requireAuthenticatedAndVerified } from "@/utils/auth-route-guards";
import { cookies, headers } from "next/headers";

interface Activate2faLayoutProps {
  children: React.ReactNode;
}

export default async function Activate2faLayout({
  children,
}: Activate2faLayoutProps) {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAuthenticatedAndVerified(cookieStore, headersList);
  return <>{children}</>;
}
