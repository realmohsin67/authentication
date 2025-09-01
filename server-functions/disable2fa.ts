"use server";

import prisma from "@/prisma/prisma-client";
import { getUserIdFromSession } from "@/utils/auth-functions";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "./logout";
import log from "@/utils/consoleLogger";

interface Disable2faState {
  error: string | null;
}

export async function disable2fa(
  _prevState: Disable2faState,
): Promise<Disable2faState> {
  const cookieStore = await cookies();
  const userId = await getUserIdFromSession(cookieStore);
  if (!userId) {
    return { error: "Error disabling 2FA" };
  }

  const timeOfLastTotpVerified = cookieStore.get(
    "time_of_last_totp_verified",
  )?.value;
  const twoHours = 1000 * 60 * 60 * 2; // 2 hours in milliseconds
  if (
    !timeOfLastTotpVerified ||
    Date.now() - parseInt(timeOfLastTotpVerified) > twoHours
  ) {
    flashToastCookie(cookieStore, "Please log in again to disable 2FA", {
      isError: true,
    });
    log.error("2FA disable attempt without recent verification");
    await logout({
      toastMessage: "Please log in again to disable 2FA",
      isToastMessageError: true,
    });
    redirect("/login");
  }

  await prisma.verification.delete({
    where: {
      target_type: {
        type: "2fa",
        target: userId,
      },
    },
  });

  flashToastCookie(cookieStore, "2FA disabled successfully");
  redirect("/profile");
}
