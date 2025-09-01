"use server";

import { User } from "@/prisma/generated-prisma-client";
import prisma from "@/prisma/prisma-client";
import { getUser } from "@/utils/auth-functions";
import {
  sendEmailToNewEmailAddress,
  sendEmailToOldEmailAddress,
} from "@/utils/send-email-functions";
import { cookies, headers } from "next/headers";
import { generateConfig, Totp, TotpConfig } from "time2fa";

type RequestPasswordResetState = {
  error: string | null;
};

export async function requestEmailChangeAction(
  _prevState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const emailAddress = formData.get("email") as string | null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddress || !emailRegex.test(emailAddress)) {
    return {
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
    type: "change-email",
    target: emailAddress, // new email address
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

  const confirmEmailChangeLink = `${protocol}://${host}/verify/change-email?otp=${otp}`;

  // send email to old address
  const cookieStore = await cookies();
  const user = await getUser(cookieStore, { email: true });
  if (!user) {
    return {
      error: "You must be logged in to change your email address.",
    };
  }
  const oldEmailAddress = user.email as string;

  await Promise.all([
    sendEmailToNewEmailAddress(emailAddress, confirmEmailChangeLink),
    sendEmailToOldEmailAddress(oldEmailAddress, emailAddress),
  ]);

  cookieStore.set("verification_change_email", verification.id, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: expirationDate,
  });

  return {
    error: null,
  };
}
