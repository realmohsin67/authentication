"use server";

import { User } from "@/prisma/generated-prisma-client";
import prisma from "@/prisma/prisma-client";
import { getUser } from "@/utils/auth-functions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateConfig, Totp } from "time2fa";

type Request2faLoginState =
  | {
      error: string | null;
    }
  | undefined;

export async function request2faLogin(
  _prevState: Request2faLoginState,
): Promise<Request2faLoginState> | never {
  const cookieStore = await cookies();
  const user = (await getUser(cookieStore, {
    id: true,
    email: true,
    isEmailVerified: true,
  })) as Pick<
    { [K in keyof User]: NonNullable<User[K]> },
    "id" | "email" | "isEmailVerified"
  > | null;

  // if (!user) return void redirect("/login");
  // if (!user.isEmailVerified) return void redirect("/verify/email");

  if (!user || !user.isEmailVerified) {
    return {
      error: "User must be logged in and email verified to enable 2FA.",
    };
  }

  const verificationExists = cookieStore.has("verification_2fa_activation");
  if (verificationExists) redirect("/verify/2fa-activation");

  const totpConfig = generateConfig();
  const key = Totp.generateKey(
    {
      issuer: "nextjs-auth-app",
      user: user.email,
    },
    totpConfig,
  );

  // this is not for the totp config, because we want to test that user has auth app which defaults to 30 seconds
  // this is for how long the user has to verify they have an auth app
  const expirationDate = new Date(Date.now() + 1 * 60 * 30 * 1000);

  const verificationData = {
    type: "2fa-activation",
    target: user.id,
    secret: key.secret,
    algorithm: totpConfig.algo,
    digits: totpConfig.digits,
    period: totpConfig.period,
    expiresAt: expirationDate,
  };

  // const [otp] = Totp.generatePasscodes({ secret: key.secret }, totpConfig);

  const verification = await prisma.verification.upsert({
    where: {
      target_type: {
        type: "2fa-activation",
        target: user.id,
      },
    },
    create: verificationData,
    update: verificationData,
    select: {
      id: true,
    },
  });

  cookieStore.set("verification_2fa_activation", verification.id, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: expirationDate,
  });

  redirect("/verify/2fa-activation");
}
