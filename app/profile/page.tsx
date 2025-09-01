import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAuthenticated } from "@/utils/auth-route-guards";
import { getUserIdFromSession } from "@/utils/auth-functions";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAuthenticated(cookieStore, headersList);
  const userId = await getUserIdFromSession(cookieStore);
  redirect(`/users/${userId}`);
}
