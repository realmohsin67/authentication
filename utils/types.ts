export type Theme = "light" | "dark";

export type ToastCookie = {
  message: string;
  isError: boolean;
  toastSetTime: number;
};

export type Role = "admin" | "user";

export type PermissionAction = "create" | "read" | "update" | "delete";
export type PermissionEntity = "user" | "post";
export type PermissionAccess = "own" | "any";

export type PermissionString =
  `${PermissionAction}:${PermissionEntity}:${PermissionAccess}`;

export type Permission = {
  action: PermissionAction;
  entity: PermissionEntity;
  access: PermissionAccess;
};

export interface Email {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export type AbsolutePath = `/${string}`;

// This utility type allows you to require at least one of the specified keys in T.
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Omit<
  T,
  Keys
> &
  { [P in Keys]: Required<Pick<T, P>> & Partial<Omit<T, P>> }[Keys];

// Require only one or none of the specified keys in T, but never more than one.
export type RequireOnlyOneOrNone<T, Keys extends keyof T = keyof T> = Omit<
  T,
  Keys
> &
  Partial<Pick<T, Keys>> &
  (
    | {
        [K in Keys]: Required<Pick<T, K>> & {
          [P in Exclude<Keys, K>]?: never;
        };
      }[Keys]
    | { [K in Keys]?: never }
  );
