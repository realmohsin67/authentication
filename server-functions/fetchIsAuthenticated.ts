"use server";

import { checkIsAuthenticated } from "@/utils/auth-functions";
import { cookies } from "next/headers";

export async function fetchIsAuthenticated() {
  const cookieStore = await cookies();
  return await checkIsAuthenticated(cookieStore);
}
