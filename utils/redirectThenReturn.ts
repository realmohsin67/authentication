import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { redirect } from "next/navigation";
import { AbsolutePath } from "./types";

/**
 * Redirects to a specified path and appends the current URL as a query parameter.
 *
 * Should be used to redirect to a page that will handle the redirect back to the original page
 *
 * @param redirectTo - The absolute path to redirect to.
 * @param requestHeaders - The headers from the request to extract the current URL.
 * @return never - This function does not return, it redirects the user.
 */

export function redirectThenReturn(
  redirectTo: AbsolutePath,
  requestHeaders: ReadonlyHeaders,
): never {
  const pathname = requestHeaders.get("x-pathname");
  const search = requestHeaders.get("x-search");
  const currentUrl = `${pathname}${search}`;
  const currentUrlEncoded = encodeURIComponent(currentUrl);
  redirect(`${redirectTo}?redirectTo=${currentUrlEncoded}`);
}
