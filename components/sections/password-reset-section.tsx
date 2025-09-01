"use client";

import { useState } from "react";
import { useActionState } from "react";
import Button from "@/components/buttons/button";
import { resetPasswordAction } from "@/server-functions/form-actions/resetPasswordAction";
// import { resetPassword } from "@/server-functions/form-actions/resetPassword";

export default function PasswordResetSection() {
  const [formState, formAction, isPending] = useActionState(
    resetPasswordAction,
    {
      error: null,
      success: false,
    },
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <h1 style={{ marginBottom: "1rem" }}>Reset Your Password</h1>
      <p style={{ marginBottom: "2rem", color: "inherit" }}>
        Please enter your new password below.
      </p>
      {formState.success ? (
        <div
          style={{
            color: "#06402B",
            fontWeight: 500,
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Your password has been reset successfully. You can now log in with
          your new password.
        </div>
      ) : (
        <form action={formAction}>
          {formState.error && (
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
              {formState.error}
            </div>
          )}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "inherit",
              }}
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "inherit",
                color: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "inherit",
              }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                background: "inherit",
                color: "inherit",
              }}
            />
          </div>
          <Button
            type="submit"
            isLoading={isPending}
            style={{ width: "100%" }}
            disabled={
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              isPending
            }
          >
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
}
