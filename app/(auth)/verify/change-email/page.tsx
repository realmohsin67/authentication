import ChangeEmailSuccess from "@/components/change-email-success";
import { User } from "@/prisma/generated-prisma-client";
import prisma from "@/prisma/prisma-client";
import { getUserIdFromSession } from "@/utils/auth-functions";
import { checkIsTotpValid } from "@/utils/checkIsTotpValid";
import { cookies } from "next/headers";
import Link from "next/link";
import { useEffect } from "react";

function ChangeEmailFailed() {
  return (
    <div className="text-center">
      <h1>Request to change email failed.</h1>
      <p>Please try again.</p>
      <Link href="/change-email">
        <button className="btn btn-primary">Go back to Settings</button>
      </Link>
    </div>
  );
}

interface ChangeEmailPageProps {
  searchParams: Promise<{ otp?: string }>;
}

export default async function ChangeEmailPage({
  searchParams,
}: ChangeEmailPageProps) {
  const otp = (await searchParams)?.otp;

  const cookieStore = await cookies();
  const userId = await getUserIdFromSession(cookieStore);
  const verificationId = cookieStore.get("verification_change_email")?.value;

  if (!otp || !verificationId || !userId) {
    return <ChangeEmailFailed />;
  }

  // get verification from db
  const verification = await prisma.verification.findUnique({
    where: {
      id: verificationId,
      OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
    },
  });
  // if verification not found or expired show Try Again page
  if (!verification) {
    return <ChangeEmailFailed />;
  }

  const isCodeValid = checkIsTotpValid(otp, verification);

  if (!isCodeValid) {
    return <ChangeEmailFailed />;
  }

  const user = await prisma.user.update({
    select: { email: true },
    where: { id: userId },
    data: { email: verification.target },
  });

  return <ChangeEmailSuccess newEmail={user.email as string} />;
}
