import {
  requireAnonymous,
  requireAuthenticatedAndVerified,
} from "@/utils/auth-route-guards";
import { cookies, headers } from "next/headers";

interface CreateAccountLayoutProps {
  children: React.ReactNode;
}

export default async function CreateAccountLayout({
  children,
}: CreateAccountLayoutProps) {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAnonymous(cookieStore);
  return <>{children}</>;
}
