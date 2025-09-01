import prisma from "@/prisma/prisma-client";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import type { Prisma } from "@/prisma/generated-prisma-client";
import log from "./consoleLogger";

// NOTE: This file contains foundational auth functions that can be used in Server Components and Server Functions.
// If user is not logged in, or if something is unexpected, we redirect to /forced-logout.
// We redirect to /forced-logout instead of logging out directly with a server function because
// these functions are meant to be used in Server Components as well, where we cannot call Server Functions.

/**
 * Can be called in Server Components and Server Functions.
 *
 * If logged in, returns userId, if not logged in returns null.
 * Checks if remotely logged out, in which case redirects to /forced-logout.
 *
 * Can be used to check if a user is authenticated or not.
 *
 * Foundational building block for other auth functions.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @returns The user ID if logged in, otherwise null.
 *
 */
export async function getUserIdFromSession(
  cookieStore: ReadonlyRequestCookies,
) {
  log.warn("starting getUserIdFromSession");
  const sessionId = cookieStore.get("sessionId")?.value;
  if (!sessionId) return null;
  log.info("sessionId cookie found:", sessionId);
  const session = await prisma.session.findUnique({
    select: { user: { select: { id: true } } },
    where: { id: sessionId, expirationDate: { gt: new Date() } },
  });
  log.info("session found:", session);
  if (!session || !session.user) {
    // sessionId cookies and their associated db sessions expire at the same time
    // so if sessionId cookie exists, but associated session in db does not,
    // then user remotely logged out, or admin deleted the session,
    // in which case we need to make sure user is logged out on the browser.
    // If no user is found, should also force logout on browser.
    log.error("from forced-logout block in getUserIdFromSession");
    redirect("/forced-logout");
  }
  log.success("finished getUserIdFromSession");
  return session.user.id;
}

/**
 * Can be called in Server Components and Server Functions.
 *
 * Returns the user object with selected properties if the user is logged in.
 * If the user is not logged in, returns null.
 *
 * Can be used to check if a user is authenticated or not.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @param select - The properties to select from the user object. Same as would be in Prisma ORM's select option.
 * @returns The user object with selected properties if logged in, otherwise null.
 */

export async function getUser(
  cookieStore: ReadonlyRequestCookies,
  select: Prisma.UserFindUniqueArgs["select"],
) {
  log.warn("starting getUser");
  const userId = await getUserIdFromSession(cookieStore);
  if (!userId) return null; // User is not logged in.
  const user = await prisma.user.findUnique({
    select: {
      ...select,
    },
    where: {
      id: userId,
    },
  });
  if (!user) redirect("/forced-logout"); // Should not happen, force logout.
  log.success("finished getUser");
  return user; // User is logged in, return user with selected properties.
}

/**
 * Can be called in Server Components and Server Functions.
 *
 * Returns true if the user is logged in (has a valid sessionId cookie).
 * Returns false if the user is not logged in (no sessionId cookie).
 *
 * Use this if you ONLY need to check if the user is logged in or not.
 *
 * If you need userId as well as knowing if they are logged in or not,
 * use getUserIdFromSession instead.
 *
 * If you need user with selected properties, as well as knowing if they are logged in or not,
 * use getUser instead.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @return {Promise<boolean>} - A promise that resolves to true if the user is logged in, otherwise false.
 */
export async function checkIsAuthenticated(
  cookieStore: ReadonlyRequestCookies,
) {
  log.warn("starting checkIsAuthenticated");
  const userId = await getUserIdFromSession(cookieStore);
  if (!userId) return false; // User is not logged in (no sessionId cookie).
  log.success("finished checkIsAuthenticated");
  return true; // User is logged in (has a valid sessionId cookie).
}

/**
 * Helper function to check if the user has verified their email.
 *
 * Meant to be used internally in auth functions and auth guards.
 *
 * @param userId - The ID of the user to check.
 * @returns true if the user's email is verified, otherwise false.
 */

export async function checkIsUserVerified(userId: string) {
  const user = await prisma.user.findUnique({
    select: { isEmailVerified: true },
    where: { id: userId },
  });
  if (!user) redirect("/forced-logout"); // Should not happen, force logout.
  return user.isEmailVerified;
}

/**
 * Can be called in Server Components and Server Functions.
 *
 * First checks if user is logged in using getUserIdFromSession.
 * If logged in, checks if the user has verified their email.
 * If email is verified, returns true.
 * If not verified, returns false.
 *
 * @param cookieStore - The cookies from the request to check for a valid session ID.
 * @returns true if user is authenticated (logged in and email verified), otherwise false.
 */

export async function checkIsAuthenticatedAndVerified(
  cookieStore: ReadonlyRequestCookies,
) {
  const userId = await getUserIdFromSession(cookieStore);
  const isAuthenticated = Boolean(userId);
  if (!isAuthenticated) return false;
  const isVerified = await checkIsUserVerified(userId as string); // If authenticated, userId will be a string.
  return isAuthenticated && isVerified; // isAuthenticated will always be true here, but keeping for clarity.
}
