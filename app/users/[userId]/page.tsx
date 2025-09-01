import { cookies, headers } from "next/headers";
import { forbidden } from "next/navigation";
import { checkIsAuthorized } from "@/utils/checkIsAuthorized";
import UserDetailsSection from "@/components/sections/user-details-section";
import SessionsManager from "@/components/sessions-manager";
import { requireAuthenticated } from "@/utils/auth-route-guards";
import { getUserIdFromSession } from "@/utils/auth-functions";
import ChangeEmailLink from "@/components/change-email-link";
import Enable2FAButton from "@/components/buttons/enable-2fa-button";
import Disable2FAButton from "@/components/buttons/disable-2fa-button";
import prisma from "@/prisma/prisma-client";

interface UserDetailsPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const cookieStore = await cookies();
  const headersList = await headers();
  await requireAuthenticated(cookieStore, headersList);
  const loggedInUserId = await getUserIdFromSession(cookieStore);
  const { userId: userIdOfProfile } = await params;

  let isAuthorized: boolean;

  if (userIdOfProfile === loggedInUserId) {
    isAuthorized = await checkIsAuthorized(cookieStore, {
      permissionNeeded: "read:user:own",
    });
  } else {
    isAuthorized = await checkIsAuthorized(cookieStore, {
      permissionNeeded: "read:user:any",
    });
  }

  if (!isAuthorized) {
    console.log("forbidden was called here");
    forbidden();
  }

  let is2FAEnabled: boolean = false;
  if (userIdOfProfile === loggedInUserId) {
    const verification = await prisma.verification.findUnique({
      select: {
        id: true,
      },
      where: {
        target_type: {
          type: "2fa",
          target: userIdOfProfile,
        },
      },
    });
    is2FAEnabled = Boolean(verification);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "25px",
        }}
      >
        <h2>User with ID: {userIdOfProfile}</h2>
        {userIdOfProfile === loggedInUserId && (
          <div>
            <SessionsManager userId={loggedInUserId} />
            <ChangeEmailLink userId={loggedInUserId} />
            {is2FAEnabled ? <Disable2FAButton /> : <Enable2FAButton />}
          </div>
        )}
      </div>
      <UserDetailsSection userId={userIdOfProfile} />
    </div>
  );
}
