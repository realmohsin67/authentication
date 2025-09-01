"use server";

import { getErrorMessage } from "@/utils/getErrorMessage";
import chalk from "chalk";
import logSymbols from "log-symbols";
import type { Email } from "@/utils/types";

interface SendEmailActionState {
  status: "success" | "error" | "idle";
  error: string | null;
}

export async function sendEmailAction(
  _prevState: SendEmailActionState,
  formData: FormData,
): Promise<SendEmailActionState> {
  const to = formData.get("toEmail") as string;
  const subject = formData.get("subject") as string;
  const html = formData.get("html") as string | undefined;
  const text = formData.get("text") as string;

  const email: Email = {
    from: "Acme <onboarding@resend.dev>",
    to: to ? ["realmohsin67@gmail.com"] : "realmohsin67@gmail.com",
    subject,
    text,
  };

  if (html) {
    email.html = html;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  const data = await response.json();
  console.log(
    chalk.blueBright(` ${logSymbols.success} Email sent, resend responded: `),
    data,
  );

  if (response.ok) {
    return { status: "success", error: null };
  } else {
    return { status: "error", error: getErrorMessage(data) };
  }
}
