import ChangeEmailSuccess from "@/components/change-email-success";
import { User } from "@/prisma/generated-prisma-client";
import prisma from "@/prisma/prisma-client";
import { getUserIdFromSession } from "@/utils/auth-functions";
import { checkIsTotpValid } from "@/utils/checkIsTotpValid";
import { cookies } from "next/headers";
import Link from "next/link";
import { useEffect } from "react";
import { generateConfig, generateUrl } from "time2fa";
import * as qrcode from "qrcode";
import Activate2faFormSection from "@/components/sections/activate-2fa-form-section";

function TryAgain() {
  return (
    <div className="text-center">
      <h1>Request to enable 2FA expired or failed.</h1>
      <p>Please go back and try again.</p>
      <Link href="/profile">
        <button className="btn btn-primary">Go back to Profile Settings</button>
      </Link>
    </div>
  );
}

interface Activate2faPageProps {
  searchParams: Promise<{ otp?: string }>;
}

export default async function Activate2faPage({
  searchParams,
}: Activate2faPageProps) {
  //   const otp = (await searchParams)?.otp;

  const cookieStore = await cookies();
  //   const userId = await getUserIdFromSession(cookieStore);
  const verificationId = cookieStore.get("verification_2fa_activation")?.value;

  if (!verificationId) {
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
    return <TryAgain />;
  }

  const config = generateConfig();

  const otpAuthUrl = generateUrl(
    {
      issuer: "nextjs-auth-app",
      user: verification.target, // email
      secret: verification.secret,
    },
    config,
  );

  const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "6rem auto",
        padding: "2rem",
        border: "1px solid #eee",
        borderRadius: 8,
        background: "inherit",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        color: "inherit",
      }}
    >
      <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
        Enable 2-Factor Authentication
      </h1>
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <img
          alt="qr code"
          src={qrCodeDataUrl}
          style={{
            display: "block",
            margin: "0 auto 1rem auto",
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fff",
            maxWidth: "100%",
            width: 180,
            height: 180,
            objectFit: "contain",
          }}
        />
        <p style={{ marginBottom: "1rem" }}>
          Scan this QR code with your authenticator app.
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          If you cannot scan the QR code, you can manually add this account to
          your authenticator app using this code:
        </p>
        <div
          style={{
            background: "inherit",
            color: "inherit",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: "0.75rem",
            fontSize: "1rem",
            // wordBreak: "break-all",
            margin: "1rem 0",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: "1rem",
              background: "inherit",
              color: "inherit",
              whiteSpace: "pre-wrap", // allow wrapping
            }}
          >
            {otpAuthUrl}
          </pre>
        </div>
        <p style={{ marginBottom: "1.5rem" }}>
          Once you've added the account, enter the code from your authenticator
          app below. Once you enable 2FA, you will need to enter a code from
          your authenticator app every time you log in or perform an important
          action.{" "}
          <b>
            Do not lose access to your authenticator app, or you will lose
            access to your account.
          </b>
        </p>
      </div>
      <Activate2faFormSection />
    </div>
  );
}
