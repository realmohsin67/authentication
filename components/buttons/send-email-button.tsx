"use client";

import Button from "./button";

export default function SendEmailButton() {
  const sendEmail = async () => {
    const response = await fetch("/api/send", {
      method: "POST",
    });

    const data = await response.json();
    if (data.error) {
      console.error("Error sending email:", data.error);
      alert("Failed to send email. Check console for details.");
    }
    console.log("Email sent successfully:", data);
  };
  return <Button onClick={sendEmail}>Send Test Email</Button>;
}
