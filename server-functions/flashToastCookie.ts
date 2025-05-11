"use server";

import { ToastCookie } from "@/utils/types";
import { cookies } from "next/headers";

/**
 * This function sets a cookie with the provided toast message.
 * The cookie is set to expire immediately after being set.
 * Since this is a server function being called as a POST request,
 * the associated get request is the main page and it will rerendered
 * to be sent back in the response of this POST request. The cookie we
 * set here will be immediately retrieved from that root server component
 * and sent back in response, so the cookie is not really used as a
 * cookie, but this is the flash pattern.
 *
 * @param {string} toastMessage - The message to be stored in the cookie.
 */
export async function flashToastCookie(toastMessage: string) {
  const cookieStore = await cookies();

  const toast: ToastCookie = {
    message: toastMessage,
    toastSetTime: new Date().getTime(),
  };

  cookieStore.set("toast", JSON.stringify(toast), {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0, // cookie will expire immediately after hitting browser
  });
}
