"use client";

import Button from "@/components/buttons/button";
import { requestPasswordResetAction } from "@/server-functions/form-actions/requestPasswordResetAction";
import log from "@/utils/consoleLogger";
import { useActionState } from "react";
import { useState } from "react";

interface ForgotPasswordSectionProps {
  alreadySentEmailAddress?: string | null;
}

export function ForgotPasswordSection({
  alreadySentEmailAddress,
}: ForgotPasswordSectionProps) {
  const [resetState, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    { error: null, success: false },
  );

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
      <h2 style={{ marginBottom: "1rem" }}>Forgot password?</h2>
      <p style={{ marginBottom: "2rem", color: "inherit" }}>
        Enter the email address associated with your account and we will send
        you a link to reset your password.
      </p>
      {alreadySentEmailAddress ? (
        <div style={{ color: "#06402B", fontWeight: 500 }}>
          If an account exists for <b>{alreadySentEmailAddress}</b>, a password
          reset link has been sent.
        </div>
      ) : (
        <form action={formAction} style={{ width: "100%" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "inherit",
            }}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Email address"
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              borderRadius: 4,
              border: "1px solid #ccc",
              boxSizing: "border-box",
              background: "inherit",
              color: "inherit",
              marginBottom: "2rem",
            }}
          />
          {resetState.error && (
            <div
              style={{
                backgroundColor: "#8B0000",
                color: "white",
                padding: "7px 20px",
                borderRadius: "5px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {resetState.error}
            </div>
          )}
          <Button type="submit" style={{ width: "100%" }} isLoading={isPending}>
            Request Password Reset
          </Button>
        </form>
      )}
    </div>
  );
}
