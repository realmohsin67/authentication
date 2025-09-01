"use server";

import prisma from "@/prisma/prisma-client";
import log from "@/utils/consoleLogger";
import { createPassword } from "@/utils/createPassword";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ResetPasswordState {
  success: boolean;
  error: string | null;
}

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  log(
    "resetPasswordAction called with password:",
    password,
    "confirmPassword:",
    confirmPassword,
  );
  if (!password || !confirmPassword) {
    return {
      success: false,
      error: "Please provide both password and confirm password.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match.",
    };
  }

  const cookieStore = await cookies();

  const verificationId = cookieStore.get("verification_forgot_password")?.value;

  if (!verificationId) {
    return {
      success: false,
      error: "Your password reset link has expired.",
    };
  }
  const verification = await prisma.verification.findUnique({
    where: {
      id: verificationId,
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
    select: {
      target: true,
    },
  });

  if (!verification) {
    return {
      success: false,
      error: "Your password reset link has expired.",
    };
  }

  const hashedPassword = createPassword(password);

  await prisma.user.update({
    where: {
      email: verification.target,
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.verification.delete({
    where: {
      id: verificationId,
    },
  });

  cookieStore.delete("verification_forgot_password");
  flashToastCookie(cookieStore, "Password reset successfully.");

  redirect("/login");
}
