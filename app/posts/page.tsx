import { cookies, headers } from "next/headers";
import prisma from "@/prisma/prisma-client";
import { forbidden, notFound } from "next/navigation";
import { checkIsAuthenticated } from "@/utils/checkIsAuthenticated";
import { redirectToLogin } from "@/utils/redirectThenReturn";
import { checkIsAuthorized } from "@/utils/checkIsAuthorized";
import PostDetails from "@/components/post-details";
import { requireAuthenticatedAndVerified } from "@/utils/auth-route-guards";
import { getUserIdFromSession } from "@/utils/auth-functions";

interface AllPostsPageProps {
  searchParams: Promise<{ userId: string }>;
}

export default async function AllPostsPage({
  searchParams,
}: AllPostsPageProps) {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAuthenticatedAndVerified(cookieStore, headersList);
  const loggedInUserId = await getUserIdFromSession(cookieStore);
  const { userId: userIdOfPostsToShow } = await searchParams;

  let isAuthorized: boolean;

  if (!userIdOfPostsToShow) {
    isAuthorized = await checkIsAuthorized(cookieStore, {
      roleNeeded: "admin",
    });
  } else if (userIdOfPostsToShow === loggedInUserId) {
    isAuthorized = await checkIsAuthorized(cookieStore, {
      permissionNeeded: "read:post:own",
    });
  } else {
    isAuthorized = await checkIsAuthorized(cookieStore, {
      permissionNeeded: "read:post:any",
    });
  }

  if (!isAuthorized) {
    forbidden();
  }

  const propertiesOfPostsToGet = {
    id: true,
    title: true,
    content: true,
    published: true,
    authorId: true,
  };

  const posts = userIdOfPostsToShow
    ? await prisma.post.findMany({
        select: propertiesOfPostsToGet,
        where: {
          authorId: userIdOfPostsToShow,
        },
      })
    : await prisma.post.findMany({ select: propertiesOfPostsToGet });

  if (posts.length === 0) {
    notFound();
  }

  console.log("userIdOfPostsToShow", userIdOfPostsToShow);
  return (
    <div>
      <h2>
        {userIdOfPostsToShow ? `Posts of ${userIdOfPostsToShow}` : "All Posts"}
      </h2>
      <div>
        {posts.map((post) => (
          <PostDetails post={post} key={post.id} withShowDetails />
        ))}
      </div>
    </div>
  );
}
