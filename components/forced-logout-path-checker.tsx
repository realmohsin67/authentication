import { headers } from "next/headers";
import LogoutOnMount from "./logout-on-mount";
import log from "@/utils/consoleLogger";

export default async function ForceLogoutRouteChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  if (pathname === "/forced-logout") {
    log.info("pathname: ", pathname);
    return (
      <div>
        <LogoutOnMount />
      </div>
    );
  }
  return children;
}
