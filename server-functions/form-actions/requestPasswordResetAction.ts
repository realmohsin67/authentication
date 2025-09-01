"use server";

import prisma from "@/prisma/prisma-client";
import { sendPasswordResetEmail } from "@/utils/send-email-functions";
import { cookies, headers } from "next/headers";
import { generateConfig, Totp, TotpConfig } from "time2fa";

type RequestPasswordResetState = {
  success: boolean;
  error: string | null;
};

export async function requestPasswordResetAction(
  _prevState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const emailAddress = formData.get("email") as string | null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddress || !emailRegex.test(emailAddress)) {
    return {
      success: false,
      error: "Please provide a valid email address.",
    };
  }

  const sha256Algo: TotpConfig["algo"] = "sha256";

  const totpConfig = generateConfig({
    algo: sha256Algo,
    digits: 12,
    period: 1 * 60 * 30, // 30 minutes
  });
  const key = Totp.generateKey(
    {
      issuer: "nextjs-auth-app",
      user: "browser",
    },
    totpConfig,
  );

  const expirationDate = new Date(Date.now() + totpConfig.period * 1000);

  const verificationData = {
    type: "password-reset",
    target: emailAddress,
    secret: key.secret,
    algorithm: totpConfig.algo,
    digits: totpConfig.digits,
    period: totpConfig.period,
    expiresAt: expirationDate,
  };

  const [otp] = Totp.generatePasscodes({ secret: key.secret }, totpConfig);

  const verification = await prisma.verification.upsert({
    where: {
      target_type: {
        type: verificationData.type,
        target: verificationData.target,
      },
    },
    create: verificationData,
    update: verificationData,
    select: {
      id: true,
    },
  });

  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto");
  const host = headersList.get("host");

  const passwordResetLink = `${protocol}://${host}/verify/password-reset?otp=${otp}`;

  await sendPasswordResetEmail(emailAddress, passwordResetLink);

  const cookieStore = await cookies();
  cookieStore.set("verification_forgot_password", verification.id, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: expirationDate,
  });

  return {
    success: true,
    error: null,
  };
}
