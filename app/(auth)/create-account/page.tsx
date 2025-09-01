"use client";

import { signUpAction } from "@/server-functions/form-actions/signUpAction";
import Button from "@/components/buttons/button";
import { useActionState } from "react";

export default function SignUpPage() {
  const [signUpState, formAction, isPending] = useActionState(signUpAction, {
    error: null,
  });

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
      <h1 style={{ marginBottom: "1rem" }}>Create An Account</h1>
      <p style={{ marginBottom: "2rem", color: "inherit" }}>
        Please enter your details.
      </p>

      <form action={formAction}>
        {signUpState.error && (
          <div
            style={{
              backgroundColor: "#8B0000",
              color: "white",
              padding: "7px 20px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <p>{signUpState.error}</p>
          </div>
        )}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "inherit",
            }}
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
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
            autoComplete="name"
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
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
            autoComplete="email"
          />
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "inherit",
            }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
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
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" isLoading={isPending} style={{ width: "100%" }}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
