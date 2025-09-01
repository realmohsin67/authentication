"use client";

import Button from "@/components/buttons/button";
import { verifyEmailAction } from "@/server-functions/form-actions/verifyEmailAction";
import { getNewCodeToVerifyEmail } from "@/server-functions/getNewCodeToVerifyEmail";
import { showToastMessage } from "@/server-functions/showToastMessage";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { redirect, useSearchParams } from "next/navigation";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

const inputStyle: React.CSSProperties = {
  width: "3rem",
  height: "3rem",
  fontSize: "2rem",
  textAlign: "center",
  margin: "0 0.5rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  outline: "none",
  background: "inherit",
  color: "inherit",
  transition: "border 0.2s",
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const otpFromParams = searchParams.get("otp");

  const [code, setCode] = useState(
    otpFromParams?.length === 6 ? otpFromParams.split("") : Array(6).fill(""),
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [verifyState, formAction, isVerifyingCode] = useActionState(
    verifyEmailAction,
    {
      status: "not-verified",
      error: null,
    },
  );

  const [, getNewEmailAction, isNewEmailPending] = useActionState(
    getNewCodeToVerifyEmail,
    undefined,
  );

  useEffect(() => {
    if (
      verifyState.status === "verified" &&
      !verifyState.error &&
      !isVerifyingCode
    ) {
      const redirectTo = searchParams.get("redirectTo") || "/";
      redirect(redirectTo);
    }
  }, [verifyState]);

  const handleChange = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digit
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);

    // Move to next input if value entered
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      // Move to previous input if current is empty
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const handleRequestNewCode = () => {
    startTransition(() => {
      getNewEmailAction();
    });
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "6rem auto",
        padding: "2rem",
        border: "1px solid #eee",
        borderRadius: 8,
        background: "inherit",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        color: "inherit",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Verify Your Email</h2>
      <p style={{ marginBottom: "2rem", color: "inherit" }}>
        Enter the 6-digit code sent to your email address.
      </p>
      <form action={formAction}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "1.5rem 0",
          }}
        >
          {code.map((digit, idx) => (
            <input
              key={idx}
              name={`digit-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              ref={(el) => void (inputsRef.current[idx] = el)}
              style={inputStyle}
              autoFocus={idx === 0}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>
        <Button
          type="submit"
          style={{
            width: "100%",
            padding: "0.55rem 2rem",
            fontSize: "1rem",

            cursor: "pointer",
            marginTop: "1rem",
          }}
          disabled={code.some((d) => d === "")}
          isLoading={isVerifyingCode}
        >
          Verify
        </Button>
      </form>
      {verifyState.error && (
        <div
          style={{
            color: "#8B0000",
            background: "#fff0f0",
            padding: "7px 20px",
            borderRadius: "5px",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          {verifyState.error}
        </div>
      )}
      <div style={{ marginTop: "40px", textAlign: "center", fontSize: "14px" }}>
        <div style={{ marginBottom: "20px" }}>
          Need a new verification code sent to your email?
        </div>
        <Button
          onClick={handleRequestNewCode}
          isLoading={isNewEmailPending}
          style={{ width: "50%" }}
        >
          Request new code
        </Button>
      </div>
    </div>
  );
}
