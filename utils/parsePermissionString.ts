import {
  Permission,
  PermissionAccess,
  PermissionAction,
  PermissionEntity,
  PermissionString,
} from "./types";

export function parsePermissionString(
  permissionString: PermissionString,
): Permission {
  const [action, entity, access] = permissionString.split(":") as [
    PermissionAction,
    PermissionEntity,
    PermissionAccess,
  ];
  return {
    action,
    entity,
    access,
  };
}
