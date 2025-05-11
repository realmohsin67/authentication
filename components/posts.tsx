import prisma from "@/prisma/prisma-client";
import ToasterButton from "./toast-button";

export default async function Users() {
  const posts = await prisma.post.findMany();
  const postsJson = JSON.stringify(posts, null, 2);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Posts</h2>
        <ToasterButton toastMessage="Toast Message from Posts" />
      </div>
      <pre>{postsJson}</pre>
    </div>
  );
}
