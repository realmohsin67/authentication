"use client";

import { useActionState } from "react";
import Button from "@/components/buttons/button";
import { requestEmailChangeAction } from "@/server-functions/form-actions/requestEmailChangeAction";

interface ChangeEmailSectionProps {
  alreadySentEmailAddress?: string | null;
}

export function ChangeEmailSection({
  alreadySentEmailAddress,
}: ChangeEmailSectionProps) {
  const [state, formAction, isPending] = useActionState(
    requestEmailChangeAction,
    { error: null },
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
      <h1 style={{ marginBottom: "1rem" }}>Change Email</h1>
      <p style={{ marginBottom: "2rem", color: "inherit" }}>
        You will receive an email at the new email address to confirm.
      </p>
      {alreadySentEmailAddress ? (
        <div style={{ color: "#06402B", fontWeight: 500 }}>
          A confirmation link has been sent to {alreadySentEmailAddress}.
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
            New Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter new email address"
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
          {state.error && (
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
              {state.error}
            </div>
          )}
          <Button type="submit" style={{ width: "100%" }} isLoading={isPending}>
            Send Confirmation
          </Button>
        </form>
      )}
    </div>
  );
}
