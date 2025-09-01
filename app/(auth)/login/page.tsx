"use client";

import Link from "next/link";
import { loginAction } from "@/server-functions/form-actions/loginAction";
import Button from "@/components/buttons/button";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

export default function LogInPage() {
  const [loginState, formAction, isPending] = useActionState(loginAction, {
    error: null,
  });

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

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
      <h1 style={{ marginBottom: "1rem" }}>Welcome Back!</h1>
      <p style={{ marginBottom: "2rem", color: "inherit" }}>
        Please enter your details.
      </p>
      <form action={formAction}>
        {loginState.error && (
          <div
            style={{
              backgroundColor: "#8B0000",
              color: "white",
              padding: "7px 20px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <p>{loginState.error}</p>
          </div>
        )}
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
            autoComplete="email"
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
            autoComplete="current-password"
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
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            style={{ marginRight: "0.5rem" }}
          />
          <label htmlFor="rememberMe" style={{ color: "inherit" }}>
            Remember Me
          </label>
          {redirectTo && (
            <input
              type="text"
              id="redirectTo"
              name="redirectTo"
              value={redirectTo}
              style={{ display: "none" }}
              readOnly
            />
          )}
        </div>
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/forgot-password"
            style={{ color: "inherit", fontSize: "0.95rem" }}
          >
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" isLoading={isPending} style={{ width: "100%" }}>
          LOG IN
        </Button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "15px",
            justifyContent: "center",
          }}
        >
          <p style={{ margin: 0 }}>New here?</p>
          <Link href="/create-account">
            <Button type="button">CREATE AN ACCOUNT</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
