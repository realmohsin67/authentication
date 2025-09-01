"use server";

import prisma from "@/prisma/prisma-client";
import { Prisma } from "@/prisma/generated-prisma-client";
import { createPassword } from "@/utils/createPassword";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createTotpAndVerificationForEmail } from "@/utils/verification-functions";
import { sendVerificationEmail } from "@/utils/send-email-functions";

type SignUpActionState = {
  error: string | null;
};

export async function signUpAction(
  _prevState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const cookieStore = await cookies();
  const headersList = await headers();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  console.log("name: ", name);
  console.log("email: ", email);
  console.log("password: ", password);

  if (!email || !password || !name) {
    console.error("Name, email and password fields are required");
    const errorMessage = "Name, email and password fields are required";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      error: errorMessage,
    };
  }

  // let user: Prisma.UserGetPayload<{ select: { id: true } }>;

  let session: Prisma.SessionGetPayload<{
    select: { id: true; expirationDate: true };
  }>;

  try {
    // create session in database
    session = await prisma.session.create({
      data: {
        user: {
          create: {
            name,
            email: email.toLowerCase(),
            password: {
              create: {
                hash: createPassword(password),
              },
            },
            roles: {
              connect: [{ name: "user" }],
            },
          },
        },
        expirationDate: new Date(Date.now() + 60 * 60 * 1000),
      },
      select: {
        id: true,
        expirationDate: true,
      },
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      error: errorMessage,
    };
  }

  const otp = await createTotpAndVerificationForEmail(email);

  const verificationLink = `${headersList.get("host")}/verify/email?otp=${otp}}`;

  await sendVerificationEmail(email, otp, verificationLink);

  flashToastCookie(
    cookieStore,
    `Account successfully created. Please verify your email.`,
  );

  cookieStore.set("sessionId", session.id, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });

  redirect("/verify/email");
}
