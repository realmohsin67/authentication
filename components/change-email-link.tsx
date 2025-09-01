import { User } from "@/prisma/generated-prisma-client";
import prisma from "@/prisma/prisma-client";
import Link from "next/link";

// You can use a Heroicon, Lucide, or any SVG icon. Here's an example with a simple SVG:
function MailEditIcon({ style }: { style?: React.CSSProperties }) {
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
      <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" strokeLinejoin="round" />
      <path
        d="M15.5 13.5l2 2M19 15l-2.5-2.5-5.5 5.5V21h3.5l5.5-5.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function ChangeEmailLink({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  return (
    <Link
      href={`/change-email`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5em",
      }}
    >
      <MailEditIcon style={{ marginRight: 2, verticalAlign: "middle" }} />
      Change email from {user?.email}
    </Link>
  );
}
