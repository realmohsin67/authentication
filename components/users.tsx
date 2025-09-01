import prisma from "@/prisma/prisma-client";

interface UsersProps {
  userId?: string;
}

export default async function Users({ userId }: UsersProps) {
  const users = userId
    ? await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
    : await prisma.user.findMany();

  const usersJson = JSON.stringify(users, null, 2);

  return (
    <div>
      <pre>{usersJson}</pre>
    </div>
  );
}
