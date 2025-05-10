import prisma from "@/prisma/prisma-client";

export default async function Users() {
  const posts = await prisma.post.findMany();
  const postsJson = JSON.stringify(posts, null, 2);
  return (
    <div>
      <h2>Posts</h2>
      <pre>{postsJson}</pre>
    </div>
  );
}
