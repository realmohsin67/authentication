import Button from "@/components/buttons/button";
import PasswordResetSection from "@/components/sections/password-reset-section";
import prisma from "@/prisma/prisma-client";
import { checkIsTotpValid } from "@/utils/checkIsTotpValid";
import log from "@/utils/consoleLogger";
import { cookies } from "next/headers";
import Link from "next/link";

function TryAgain() {
  return (
    <div>
      <h1>Try Again</h1>
      <p>Your password reset link has expired or was not initiated.</p>
      <Link href="/forgot-password">
        <Button>Go back to Forgot Password</Button>
      </Link>
    </div>
  );
}

interface PasswordResetPageProps {
  searchParams: Promise<{
    otp?: string;
  }>;
}

export default async function PasswordResetPage({
  searchParams,
}: PasswordResetPageProps) {
  // Get search param 'otp'

  const otp = (await searchParams)?.otp;

  const cookieStore = await cookies();
  const verificationId = cookieStore.get("verification_forgot_password")?.value;

  if (!otp || !verificationId) {
    log.error("from NO VERIFICATION ID");
    return <TryAgain />;
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
    log.error("from NO VERIFICATION ID");
    return <TryAgain />;
  }

  const isCodeValid = await checkIsTotpValid(otp, verification);

  if (!isCodeValid) {
    return <TryAgain />;
  }

  return <PasswordResetSection />;
}
