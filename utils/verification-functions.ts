import prisma from "@/prisma/prisma-client";
import { T } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { generateConfig, Totp, TotpConfig } from "time2fa";

/**
 * Creates a 30 minute TOTP verification session for verifying user's email address.
 *
 * Generates TOTP config and secret, stores them in a verification record in the database,
 * sets a cookie with the verification ID, and then creates and returns TOTP passcode.
 *
 * @param emailAddress - The email address to be verified.
 * @returns - Returns the generated TOTP passcode.
 *
 */

export async function createTotpAndVerificationForEmail(emailAddress: string) {
  const sha256Algo: TotpConfig["algo"] = "sha256";

  const totpConfig = generateConfig({
    algo: sha256Algo,
    digits: 6,
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
    type: "email",
    target: emailAddress,
    secret: key.secret,
    algorithm: totpConfig.algo,
    digits: totpConfig.digits,
    period: totpConfig.period,
    expiresAt: expirationDate,
  };

  const [otp] = Totp.generatePasscodes({ secret: key.secret }, totpConfig);

  await prisma.verification.upsert({
    where: {
      target_type: {
        type: "email",
        target: emailAddress,
      },
    },
    create: verificationData,
    update: verificationData,
  });

  return otp;
}
