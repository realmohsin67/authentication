"use server";

import prisma from "@/prisma/prisma-client";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout({
  toastMessage = "Logged out",
  isToastMessageError = false,
} = {}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (sessionId) {
    cookieStore.delete("sessionId");
    void prisma.session
      .delete({
        where: {
          id: sessionId,
        },
      })
      .catch((error) => {
        // No need to throw an error here, just log it
        // possible that user was logged out via another device
        console.error("Error deleting session: ", error);
      });
  }

  cookieStore.delete("time_of_last_totp_verified");

  flashToastCookie(cookieStore, toastMessage, { isError: isToastMessageError });
  redirect("/");
}
