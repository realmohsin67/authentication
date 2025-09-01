import prisma from "@/prisma/prisma-client";
import Button from "./buttons/button";
import { User } from "@/prisma/generated-prisma-client";
import { logoutOtherSessions } from "@/server-functions/logoutOtherSessions";

interface SessionsManagerProps {
  userId: string;
}

export default async function SessionsManager({
  userId,
}: SessionsManagerProps) {
  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: {
        select: { sessions: { where: { expirationDate: { gt: new Date() } } } },
      },
    },
  }))!;

  const otherSessionsCount = user?._count?.sessions - 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginRight: "25px",
      }}
    >
      <p>
        Number of logged in sessions on other windows and devices:{" "}
        {otherSessionsCount}
      </p>
      {otherSessionsCount > 0 && (
        <Button style={{ fontSize: "10px" }} onClick={logoutOtherSessions}>
          Log out of other sessions
        </Button>
      )}
    </div>
  );
}
