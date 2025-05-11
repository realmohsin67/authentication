import prisma from "@/prisma/prisma-client";
import ToasterButton from "./toast-button";

export default async function Users() {
  const users = await prisma.user.findMany();
  const usersJson = JSON.stringify(users, null, 2);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Users</h2>
        <ToasterButton toastMessage="Toast Message from Users" />
      </div>
      <pre>{usersJson}</pre>
    </div>
  );
}
