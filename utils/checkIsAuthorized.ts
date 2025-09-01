import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { PermissionString, RequireAtLeastOne, Role } from "./types";
import prisma from "@/prisma/prisma-client";
import { parsePermissionString } from "./parsePermissionString";
import { getUserIdFromSession } from "./auth-functions";

export async function checkIsAuthorized(
  cookieStore: ReadonlyRequestCookies,
  {
    roleNeeded,
    permissionNeeded,
  }: RequireAtLeastOne<{
    roleNeeded: Role;
    permissionNeeded: PermissionString;
  }>,
) {
  const userId = await getUserIdFromSession(cookieStore);
  if (!userId) {
    return false;
  }
  // // we know userId cookie exists because userId is true
  // const userId = cookieStore.get("userId")?.value as string;

  let passesRoleCheck = !roleNeeded ? true : false;
  let passesPermissionCheck = !permissionNeeded ? true : false;

  if (roleNeeded) {
    const roleNeededFound = await prisma.role.findFirst({
      select: { id: true },
      where: {
        name: roleNeeded,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    if (roleNeededFound) {
      passesRoleCheck = true;
    }
  }

  if (permissionNeeded) {
    const permission = parsePermissionString(permissionNeeded);
    const permissionNeededFound = await prisma.permission.findFirst({
      select: { id: true },
      where: {
        roles: {
          some: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
        entity: permission.entity,
        action: permission.action,
        access: permission.access,
      },
    });
    if (permissionNeededFound) {
      passesPermissionCheck = true;
    }
  }

  return passesRoleCheck && passesPermissionCheck;
}
