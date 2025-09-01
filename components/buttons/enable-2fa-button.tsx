"use client";

import { request2faLogin } from "@/server-functions/request2faLogin";
import { startTransition, useActionState } from "react";

// Simple shield/lock icon for 2FA
function ShieldLockIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="2" />
      <path d="M12 12v2" strokeLinecap="round" />
    </svg>
  );
}

export default function Enable2FAButton() {
  const [request2faState, request2faLoginAction, isPending] = useActionState(
    request2faLogin,
    {
      error: null,
    },
  );

  const handleEnable2Fa = () => {
    startTransition(() => {
      request2faLoginAction();
    });
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div
          onClick={handleEnable2Fa}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5em",
            cursor: "pointer",
          }}
        >
          <ShieldLockIcon style={{ marginRight: 2, verticalAlign: "middle" }} />
          Enable 2-Factor Authentication{" "}
          {request2faState?.error && (
            <span style={{ marginLeft: "20px", color: "red" }}>
              Error enabling 2FA
            </span>
          )}
        </div>
      )}
    </div>
  );
}
