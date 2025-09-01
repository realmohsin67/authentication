import log from "./consoleLogger";
import { Email } from "./types";

export async function sendVerificationEmail(
  emailAddress: string,
  otp: string,
  verificationLink: string,
) {
  const email: Email = {
    from: "no-reply@nextauth.com",
    to: emailAddress,
    subject: "Verify your email address",
    text: `Your verification code is: ${otp}. Provide this code to complete your email verification. 
    Or visit this link: ${verificationLink}`,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    log.error("Error sending email: ", data);
  } else {
    log.success("Email successfully sent ", data);
  }
}

export async function sendPasswordResetEmail(
  emailAddress: string,
  passwordResetLink: string,
) {
  const email: Email = {
    from: "no-reply@nextauth.com",
    to: emailAddress,
    subject: "Reset your password",
    text: `Reset your password by clicking this link: ${passwordResetLink}`,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    log.error("Error sending email: ", data);
  } else {
    log.success("Email successfully sent ", data);
  }
}

export async function sendEmailToNewEmailAddress(
  emailAddress: string,
  changeEmailLink: string,
) {
  const email: Email = {
    from: "no-reply@nextauth.com",
    to: emailAddress,
    subject: "Request to change your email address",
    text: `You have requested to change your email address to ${emailAddress}. If this is correct, visit this link to confirm: ${changeEmailLink}`,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    log.error("Error sending email: ", data);
  } else {
    log.success("Email successfully sent ", data);
  }
}

export async function sendEmailToOldEmailAddress(
  oldEmailAddress: string,
  newEmailAddress: string,
) {
  const email: Email = {
    from: "no-reply@nextauth.com",
    to: oldEmailAddress,
    subject: "Request to change your email address",
    text: `You have requested to change your email address from ${oldEmailAddress} to ${newEmailAddress}. If this is not correct, please contact support.`,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    body: JSON.stringify(email),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    log.error("Error sending email: ", data);
  } else {
    log.success("Email successfully sent ", data);
  }
}
