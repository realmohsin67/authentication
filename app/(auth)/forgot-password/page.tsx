import { ForgotPasswordSection } from "@/components/sections/forgot-password-section";
import prisma from "@/prisma/prisma-client";
import log from "@/utils/consoleLogger";
import { cookies } from "next/headers";

export default async function ForgotPasswordPage() {
  const cookieStore = await cookies();
  const verificationId = cookieStore.get("verification_forgot_password")?.value;
  let emailAddress = verificationId
    ? await prisma.verification
        .findUnique({
          where: { id: verificationId },
          select: { target: true },
        })
        .then((verification) => verification?.target)
    : null;

  return <ForgotPasswordSection alreadySentEmailAddress={emailAddress} />;
}
