import prisma from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

interface UserDetailsSectionProps {
  userId: string;
}

export default async function UserDetailsSection({
  userId,
}: UserDetailsSectionProps) {
  const user = await prisma.user.findUnique({
    select: {
      name: true,
      email: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      },
      roles: {
        select: {
          name: true,
          permissions: {
            select: {
              action: true,
              entity: true,
              access: true,
            },
          },
        },
      },
      sessions: {
        select: {
          id: true,
          expirationDate: true,
        },
      },
    },
    where: {
      id: userId,
    },
  });

  if (!user) {
    notFound();
  }

  const usersJson = JSON.stringify(user, null, 2);

  return (
    <div>
      <pre>{usersJson}</pre>
    </div>
  );
}
