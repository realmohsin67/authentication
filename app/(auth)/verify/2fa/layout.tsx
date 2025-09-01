import prisma from "@/prisma/prisma-client";
import { requireAuthenticatedAndVerified } from "@/utils/auth-route-guards";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

interface LoginWith2faLayoutProps {
  children: React.ReactNode;
}

export default async function LoginWith2faLayout({
  children,
}: LoginWith2faLayoutProps) {
  const cookieStore = await cookies();
  const unverifiedSessionId = cookieStore.get("unverified_sessionId")?.value;
  if (!unverifiedSessionId) redirect("/login");
  const session = await prisma.session.findUnique({
    where: { id: unverifiedSessionId },
  });
  if (!session) redirect("/login");
  return <>{children}</>;
}
