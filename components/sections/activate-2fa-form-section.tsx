"use client";

import { useState, useRef, useActionState } from "react";
import Button from "@/components/buttons/button";
import { activate2faAction } from "@/server-functions/form-actions/activate2faAction";

const inputStyle: React.CSSProperties = {
  width: "3rem",
  height: "3rem",
  fontSize: "2rem",
  textAlign: "center",
  margin: "0 0.5rem",
  border: "1px solid #ccc",
  borderRadius: 8,
  outline: "none",
  background: "inherit",
  color: "inherit",
  transition: "border 0.2s",
};

function Activate2faFormSection() {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [activate2faState, formAction, isVerifyingCode] = useActionState(
    activate2faAction,
    {
      error: null,
    },
  );

  const handleChange = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
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

  return (
    <form action={formAction} style={{ marginTop: "2rem" }}>
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
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "none",
          background: "#000",
          color: "#fff",
          cursor: "pointer",
          marginTop: "1rem",
        }}
        disabled={code.some((d) => d === "")}
        isLoading={isVerifyingCode}
      >
        Verify Code To Enable 2FA
      </Button>
      {activate2faState.error && (
        <div
          style={{
            color: "#8B0000",
            background: "#fff0f0",
            padding: "7px 20px",
            borderRadius: "5px",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          {activate2faState.error}
        </div>
      )}
    </form>
  );
}

export default Activate2faFormSection;
