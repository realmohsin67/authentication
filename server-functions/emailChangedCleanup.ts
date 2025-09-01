"use server";

import prisma from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { logout } from "./logout";
import { flashToastCookie } from "@/utils/flashToastCookie";

export async function emailChangedCleanup(): Promise<void> {
  const cookieStore = await cookies();
  const verificationId = cookieStore.get("verification_change_email")?.value;

  await prisma.verification.delete({
    where: {
      id: verificationId,
    },
  });

  cookieStore.delete("verification_change_email");

  flashToastCookie(
    cookieStore,
    "Email changed successfully. Log in with new email.",
  );
  logout();
}
