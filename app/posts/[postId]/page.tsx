import { cookies, headers } from "next/headers";
import prisma from "@/prisma/prisma-client";
import { forbidden, notFound } from "next/navigation";
import { checkIsAuthorized } from "@/utils/checkIsAuthorized";
import PostDetails from "@/components/post-details";
import { requireAuthenticatedAndVerified } from "@/utils/auth-route-guards";
import { getUserIdFromSession } from "@/utils/auth-functions";

interface PostDetailsPageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailsPage({
  params,
}: PostDetailsPageProps) {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAuthenticatedAndVerified(cookieStore, headersList);
  const loggedInUserId = await getUserIdFromSession(cookieStore);
  const { postId } = await params;

  const post = await prisma.post.findFirst({
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      id: postId,
    },
  });

  const canReadAnyPost = await checkIsAuthorized(cookieStore, {
    permissionNeeded: "read:post:any",
  });

  if (canReadAnyPost) {
    if (!post) notFound();
  } else {
    if (!post) forbidden(); // user cannot read every post so don't reveal whether a post exists or not with notFound
    const isPostAuthor = post?.authorId === loggedInUserId;
    if (!isPostAuthor) forbidden(); // if user cannot read every post and is not author, no need to check permission
    const canReadOwnPost = await checkIsAuthorized(cookieStore, {
      permissionNeeded: "read:post:own",
    });
    if (!canReadOwnPost) forbidden();
  }

  return (
    <div>
      <h2>Post Details for {postId}</h2>
      <div>
        <PostDetails post={post} />
      </div>
    </div>
  );
}
