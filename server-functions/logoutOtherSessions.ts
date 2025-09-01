"use server";

import prisma from "@/prisma/prisma-client";
import { flashToastCookie } from "@/utils/flashToastCookie";
import { cookies } from "next/headers";

export async function logoutOtherSessions() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) return;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });
  if (!session) return;
  await prisma.session.deleteMany({
    where: {
      userId: session.userId,
      id: { not: sessionId },
    },
  });
  flashToastCookie(cookieStore, `Logged out of other sessions`);
}
