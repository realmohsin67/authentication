import prisma from "@/prisma/prisma-client";

export default async function Users() {
  const users = await prisma.user.findMany();
  const usersJson = JSON.stringify(users, null, 2);
  return (
    <div>
      <h2>Users</h2>
      <pre>{usersJson}</pre>
    </div>
  );
}
