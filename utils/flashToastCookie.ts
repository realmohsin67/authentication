import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { ToastCookie } from "@/utils/types";

type ToastSettings = {
  isError: boolean;
};

export async function flashToastCookie(
  cookieStore: ReadonlyRequestCookies,
  toastMessage: string,
  toastSettings: ToastSettings = { isError: false },
) {
  const toast: ToastCookie = {
    message: toastMessage,
    isError: toastSettings.isError,
    toastSetTime: new Date().getTime(),
  };

  cookieStore.set("toast", JSON.stringify(toast), {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0, // cookie will expire immediately after hitting browser
  });
}
