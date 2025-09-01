"use client";

import { disable2fa } from "@/server-functions/disable2fa";
import { request2faLogin } from "@/server-functions/request2faLogin";
import { startTransition, useActionState } from "react";

// Simple shield/lock icon for 2FA
function ShieldOffIcon({ style }: { style?: React.CSSProperties }) {
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
      <path d="M3 3l18 18" stroke="currentColor" strokeLinecap="round" />
      <path
        d="M12 3l7 4v5c0 5-3.5 9-7 9-1.5 0-3.1-.7-4.5-2M5 7v5c0 2.2.7 4.3 2 6"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Disable2FAButton() {
  const [disable2faState, disable2faAction, isPending] = useActionState(
    disable2fa,
    {
      error: null,
    },
  );

  const handleDisable2Fa = () => {
    startTransition(() => {
      disable2faAction();
    });
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div
          onClick={handleDisable2Fa}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5em",
            cursor: "pointer",
          }}
        >
          <ShieldOffIcon style={{ marginRight: 2, verticalAlign: "middle" }} />
          Disable 2-Factor Authentication{" "}
          {disable2faState.error && (
            <span style={{ color: "red" }}>Error: {disable2faState.error}</span>
          )}
        </div>
      )}
    </div>
  );
}
