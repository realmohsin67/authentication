"use client";

import { useActionState, useRef } from "react";
import Button from "./buttons/button";
import { sendEmailAction } from "@/server-functions/form-actions/sendEmailAction";
import { send } from "process";

export default function SendEmail() {
  const formRef = useRef<HTMLFormElement>(null);

  const [sendEmailState, formAction, isLoading] = useActionState(
    sendEmailAction,
    {
      status: "idle",
      error: null,
    },
  );

  const handleSendEmail = () => formRef.current?.requestSubmit();

  return (
    <div>
      <Button onClick={handleSendEmail} isLoading={isLoading}>
        Send Test Email
      </Button>
      {sendEmailState.status === "success" && <p>Email sent successfully!</p>}
      {sendEmailState.status === "error" && (
        <p style={{ color: "red" }}>{sendEmailState.error}</p>
      )}
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="toEmail" value="realmohsin67@gmail.com" />
        <input
          type="hidden"
          name="subject"
          value="Hello from SendEmailActionButton"
        />
        <input
          type="hidden"
          name="text"
          value="This is a test email sent using Resend API."
        />
      </form>
    </div>
  );
}
