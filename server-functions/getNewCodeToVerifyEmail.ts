"use server";

import { User } from "@/prisma/generated-prisma-client";
import { getUser } from "@/utils/auth-functions";
import log from "@/utils/consoleLogger";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { sendVerificationEmail } from "@/utils/send-email-functions";
import { createTotpAndVerificationForEmail } from "@/utils/verification-functions";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getNewCodeToVerifyEmail() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const user = (await getUser(cookieStore, {
    email: true,
    isEmailVerified: true,
  })) as Pick<
    { [K in keyof User]: NonNullable<User[K]> },
    "email" | "isEmailVerified"
  > | null;

  if (!user) {
    redirect("/login");
  }

  if (user.isEmailVerified) {
    log.error("Email is already verified");
    flashToastCookie(cookieStore, "Email is already verified", {
      isError: true,
    });
    redirect("/");
  }

  const otp = await createTotpAndVerificationForEmail(user.email);

  const verificationLink = `${headersList.get("host")}/verify/email?otp=${otp}}`;

  await sendVerificationEmail(user.email, otp, verificationLink);

  flashToastCookie(
    cookieStore,
    "Verification email sent. Please check your inbox.",
  );
}
