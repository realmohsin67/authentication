"use server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { flashToastCookie } from "@/utils/flashToastCookie";
import log from "@/utils/consoleLogger";
import { generateConfig, Totp, TotpConfig } from "time2fa";
import { getUser, getUserIdFromSession } from "@/utils/auth-functions";
import { User } from "@/prisma/generated-prisma-client";
import { checkIsTotpValid, isTotpValid } from "@/utils/checkIsTotpValid";

type VerifyEmailState = {
  status: "not-verified" | "verified";
  error: string | null;
};

export async function verifyEmailAction(
  _prevState: VerifyEmailState,
  formData: FormData,
): Promise<VerifyEmailState> {
  log.warn("Starting loginAction");
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

  const user = (await getUser(cookieStore, {
    id: true,
    email: true,
  })) as Pick<{ [K in keyof User]: NonNullable<User[K]> }, "id" | "email">;

  const verification = await prisma.verification.findUnique({
    where: {
      target_type: {
        type: "email",
        target: user.email,
      },
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
  });
  if (!verification) {
    const errorMessage =
      "Verification process expired or not initiated. Please ask for a new code.";
    log.error(errorMessage);
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      status: "not-verified",
      error: errorMessage,
    };
  }

  const isCodeValid = checkIsTotpValid(code, verification);

  if (!isCodeValid) {
    const errorMessage = "Invalid code. Please try again.";
    log.error(errorMessage);
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      status: "not-verified",
      error: errorMessage,
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true },
  });

  await prisma.verification.delete({
    where: {
      target_type: {
        type: "email",
        target: user.email,
      },
    },
  });

  flashToastCookie(cookieStore, "Email verified successfully!");

  return {
    status: "verified",
    error: null,
  };
}
