import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {
  checkIsAuthenticated,
  checkIsUserVerified,
  getUserIdFromSession,
} from "./auth-functions";
import { redirectThenReturn } from "./redirectThenReturn";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { redirect } from "next/navigation";

export async function requireAnonymous(cookieStore: ReadonlyRequestCookies) {
  const isAuthenticated = await checkIsAuthenticated(cookieStore);
  if (isAuthenticated) {
    redirect("/");
  }
}

/**
 * Should be used in server components ONLY, not in server functions.
 *
 * This is an auth guard for routes that require authentication.
 *
 * If user is not authenticated, it redirects to the login page
 * with search parameter set to current url
 * so login page can redirect back after log in.
 *
 * If user is authenticated, it does nothing.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @param headersList - The headers from the request to extract the current URL for redirection.
 * @returns - Returns void if authenticated, otherwise redirects the user and never returns.
 *
 */
export async function requireAuthenticated(
  cookieStore: ReadonlyRequestCookies,
  headersList: ReadonlyHeaders,
) {
  const isAuthenticated = await checkIsAuthenticated(cookieStore);
  if (!isAuthenticated) {
    redirectThenReturn("/login", headersList);
  }
}

/**
 * Should be used in server components ONLY, not in server functions.
 *
 * This is an auth guard for routes that require authentication and verification.
 *
 * If user is not authenticated, it redirects to the login page
 * with search parameter set to current url
 * so login page can redirect back after log in.
 *
 * If user is not verified, it redirects to the verify email page
 * with search parameter set to current url
 * so verify email page can redirect back after verification.
 *
 * If user is authenticated and verified, it does nothing.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @param headersList - The headers from the request to extract the current URL for redirection.
 * @returns - Returns void if authenticated, otherwise redirects the user and never returns.
 *
 */
export async function requireAuthenticatedAndVerified(
  cookieStore: ReadonlyRequestCookies,
  headersList: ReadonlyHeaders,
) {
  const userId = await getUserIdFromSession(cookieStore);
  const isAuthenticated = Boolean(userId);
  if (!isAuthenticated) {
    redirectThenReturn("/login", headersList);
  }

  const isVerified = await checkIsUserVerified(userId as string); // If authenticated, userId will be a string.
  if (!isVerified) {
    redirectThenReturn("/verify/email", headersList);
  }
}

/**
 * Should be used in server components ONLY, not in server functions.
 *
 * This is an auth guard for routes that require authentication but not verified.
 *
 * If user is not authenticated, it redirects to the login page
 * with search parameter set to current url
 * so login page can redirect back after log in.
 *
 * If user is verified, it redirects to the home page.
 * If user is authenticated and not verified, it does nothing.
 *
 * Mostly likely only needed for the verify email page.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @param headersList - The headers from the request to extract the current URL for redirection.
 * @returns - Returns void if authenticated, otherwise redirects the user and never returns.
 *
 */
export async function requireAuthenticatedButNotVerified(
  cookieStore: ReadonlyRequestCookies,
  headersList: ReadonlyHeaders,
) {
  const userId = await getUserIdFromSession(cookieStore);
  const isAuthenticated = Boolean(userId);
  if (!isAuthenticated) {
    redirectThenReturn("/login", headersList);
  }

  const isVerified = await checkIsUserVerified(userId as string); // If authenticated, userId will be a string.
  if (isVerified) {
    redirect("/");
  }
}
