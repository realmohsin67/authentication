"use server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { flashToastCookie } from "@/utils/flashToastCookie";
import log from "@/utils/consoleLogger";

type LoginActionState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  log.warn("Starting loginAction");
  const cookieStore = await cookies();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe");
  const redirectTo = formData.get("redirectTo") as string;

  if (!email) {
    console.error("Email is required");
    const errorMessage = "Email is required";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      error: errorMessage,
    };
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      password: {
        select: {
          hash: true,
        },
      },
    },
    where: {
      email,
    },
  });

  if (!user || !user.password) {
    console.error("Invalid username or password");
    const errorMessage = "Invalid username or password";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      error: errorMessage,
    };
  }

  console.log("user: ", user);

  const isValidPassword = await bcrypt.compare(password, user.password.hash);
  if (!isValidPassword) {
    console.error("Invalid username or password");
    const errorMessage = "Invalid username or password";
    flashToastCookie(cookieStore, errorMessage, { isError: true });
    return {
      error: errorMessage,
    };
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expirationDate: new Date(
        Date.now() + (rememberMe ? 60 * 60 * 24 * 7 * 1000 : 60 * 60 * 1000),
      ), // 7 days or 1 hour
    },
    select: {
      id: true,
      expirationDate: true,
    },
  });

  const verification = await prisma.verification.findUnique({
    select: { id: true },
    where: {
      target_type: {
        type: "2fa",
        target: user.id,
      },
    },
  });
  const is2faEnabled = Boolean(verification);

  if (is2faEnabled) {
    cookieStore.set("unverified_sessionId", session.id, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
    });
    cookieStore.set("remember_me", String(Boolean(rememberMe)), {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
    });
    return redirect(
      `/verify/2fa${redirectTo && redirectTo.startsWith("/") ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    );
  }

  flashToastCookie(cookieStore, `Successfully logged in as ${email}`);

  cookieStore.set("sessionId", session.id, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    // maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days or session
    expires: rememberMe ? session.expirationDate : undefined, // 7 days or session
  });

  log.success("Finished loginAction");
  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/");
}
