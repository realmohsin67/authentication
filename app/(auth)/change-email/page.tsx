import { useActionState } from "react";
import Button from "@/components/buttons/button";
import { cookies } from "next/headers";
import { ChangeEmailSection } from "@/components/sections/change-email-section";
import prisma from "@/prisma/prisma-client";
// import { sendChangeEmailConfirmAction } from "@/server-functions/form-actions/sendChangeEmailConfirmAction";

export default async function ChangeEmailPage() {
  const cookieStore = await cookies();
  const verificationId = cookieStore.get("verification_change_email")?.value;
  let emailAddress = verificationId
    ? await prisma.verification
        .findUnique({
          where: { id: verificationId },
          select: { target: true },
        })
        .then((verification) => verification?.target)
    : null;

  return <ChangeEmailSection alreadySentEmailAddress={emailAddress} />;
}
