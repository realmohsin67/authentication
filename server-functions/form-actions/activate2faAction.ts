"use server";

import { User } from "@/prisma/generated-prisma-client";
import prisma from "@/prisma/prisma-client";
import { getUser, getUserIdFromSession } from "@/utils/auth-functions";
import { checkIsTotpValid } from "@/utils/checkIsTotpValid";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Activate2faState {
  error: string | null;
}

export async function activate2faAction(
  _prevState: Activate2faState,
  formData: FormData,
): Promise<Activate2faState> {
  const cookieStore = await cookies();
  let code = "";

  for (let i = 0; i < 6; i++) {
    const digit = formData.get(`digit-${i}`) as string | null;
    if (digit === null) {
      console.error(`Digit ${i} is required`);
      const errorMessage = `6 digits are required`;
      flashToastCookie(cookieStore, errorMessage, { isError: true });
      return {
        error: errorMessage,
      };
    }
    code += digit;
  }

  const userId = await getUserIdFromSession(cookieStore);
  if (!userId) {
    const errorMessage = "User is not logged in.";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    redirect("/login");
  }

  const verification = await prisma.verification.findUnique({
    where: {
      target_type: {
        type: "2fa-activation",
        target: userId,
      },
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
  });
  if (!verification) {
    const errorMessage =
      "Took too long to activate 2FA, or not initiated. Please start the process again.";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    redirect(`/users/${userId}`);
  }

  const isCodeValid = checkIsTotpValid(code, verification);

  if (!isCodeValid) {
    const errorMessage = "Invalid code. Please try again.";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      error: errorMessage,
    };
  }

  await prisma.verification.update({
    where: {
      target_type: {
        type: "2fa-activation",
        target: userId,
      },
    },
    data: {
      expiresAt: null,
      type: "2fa",
    },
  });

  flashToastCookie(cookieStore, "2FA activated successfully!", {
    isError: false,
  });

  cookieStore.delete("verification_2fa_activation");

  redirect(`/users/${userId}`);
}
