"use client";

import { fetchIsAuthenticated } from "@/server-functions/fetchIsAuthenticated";
import { logout } from "@/server-functions/logout";
import log from "@/utils/consoleLogger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface ForceLogoutCheckerProps {
  sessionId: string | null;
}

// This component checks if the user is authenticated on every route change.

// Since Next.js does not automatically revalidate server components on client-side navigation,
// we need to manually check if the user is still logged in when the route changes.

// If auth cookie gets deleted from different tab, current tab will still have stale sessionId,
// that's why this component is needed to periodically check if the auth cookie still exists.

// server components that read a certain cookie, are revalidated when that cookie is updated from a server function

// checks if sessionId from parent server component is stale or not on every path change
// there is a chance for it to be stale if user is logged out remotely,
// this tab won't recheck the cookie and client navigation does not trigger page reload
// so stale session ID will be used until this component checks it

export default function ForceLogoutChecker({
  sessionId,
}: ForceLogoutCheckerProps) {
  const pathname = usePathname();

  const handleForceLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (sessionId) {
      (async function () {
        log.warn("Starting fetchIsAuthenticated in ForceLogoutChecker");
        const confirmedAsAuthenticated = await fetchIsAuthenticated();
        log.success("Done with fetchIsAuthenticated in ForceLogoutChecker");
        if (!confirmedAsAuthenticated) handleForceLogout();
      })();
    }
  }, [pathname]);

  return null;
}
