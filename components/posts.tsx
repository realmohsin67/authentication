import prisma from "@/prisma/prisma-client";
import { RequireOnlyOneOrNone } from "@/utils/types";

type PostsPropOptions = {
  userId: string;
  postId: string;
};

type PostsProps = RequireOnlyOneOrNone<PostsPropOptions>;

export default async function Posts({ userId, postId }: PostsProps) {
  let posts;

  if (postId) {
    posts = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
  } else if (userId) {
    posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
  } else {
    posts = await prisma.post.findMany();
  }

  const postsJson = JSON.stringify(posts, null, 2);

  return (
    <div>
      <pre>{postsJson}</pre>
    </div>
  );
}
