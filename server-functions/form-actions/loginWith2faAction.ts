"use server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { flashToastCookie } from "@/utils/flashToastCookie";
import log from "@/utils/consoleLogger";
import { getUserIdFromSession } from "@/utils/auth-functions";
import { checkIsTotpValid } from "@/utils/checkIsTotpValid";

type loginWith2faActionState = {
  status: "not-verified" | "verified";
  error: string | null;
};

export async function loginWith2faAction(
  _prevState: loginWith2faActionState,
  formData: FormData,
): Promise<loginWith2faActionState> {
  const cookieStore = await cookies();

  let code = "";

  for (let i = 0; i < 6; i++) {
    const digit = formData.get(`digit-${i}`) as string | null;
    if (digit === null) {
      console.error(`Digit ${i} is required`);
      const errorMessage = `6 digits are required`;
      flashToastCookie(cookieStore, errorMessage, { isError: true });
      return {
        status: "not-verified",
        error: errorMessage,
      };
    }
    code += digit;
  }

  const sessionId = cookieStore.get("unverified_sessionId")?.value;
  if (!sessionId) redirect("/login");
  const session = await prisma.session.findUnique({
    select: { user: { select: { id: true } }, expirationDate: true },
    where: { id: sessionId, expirationDate: { gt: new Date() } },
  });
  if (!session || !session.user?.id) redirect("/login");

  const userId = session.user.id;

  const verification = await prisma.verification.findUnique({
    where: {
      target_type: {
        type: "2fa",
        target: userId,
      },
    },
  });
  if (!verification) {
    const errorMessage =
      "Something went wrong. Please contact support or try again later.";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      status: "not-verified",
      error: errorMessage,
    };
  }

  const isCodeValid = checkIsTotpValid(code, verification);

  if (!isCodeValid) {
    const errorMessage = "Invalid code. Please try again.";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      status: "not-verified",
      error: errorMessage,
    };
  }

  const timeOfLastTotpVerified = Date.now().toString();
  cookieStore.set("time_of_last_totp_verified", timeOfLastTotpVerified, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + 60 * 60 * 24 * 7 * 1000, // 7 days
  });

  flashToastCookie(cookieStore, `Successfully logged in.`);

  cookieStore.delete("unverified_sessionId");
  const rememberMe = cookieStore.get("remember_me")?.value === "true";
  cookieStore.set("sessionId", sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    // maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days or session
    expires: rememberMe ? session.expirationDate : undefined, // 7 days or session
  });
  cookieStore.delete("remember_me");

  return {
    status: "verified",
    error: null,
  };
}
