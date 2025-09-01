"use client";

import { emailChangedCleanup } from "@/server-functions/emailChangedCleanup";
import { useEffect } from "react";

export default function ChangeEmailSuccess({ newEmail }: { newEmail: string }) {
  useEffect(() => {
    emailChangedCleanup();
  }, []);

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
      <div style={{ color: "#06402B", fontWeight: 500 }}>
        Email successfully changed to
        <b>{newEmail}</b>.
      </div>
    </div>
  );
}
