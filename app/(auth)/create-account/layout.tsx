import { requireAnonymous } from "@/utils/auth-route-guards";
import { cookies } from "next/headers";

interface CreateAccountLayoutProps {
  children: React.ReactNode;
}

export default async function CreateAccountLayout({
  children,
}: CreateAccountLayoutProps) {
  const cookieStore = await cookies();
  await requireAnonymous(cookieStore);
  return <>{children}</>;
}
