import Link from "next/link";
import ThemeSwitcher from "./theme-switcher";
import HomeIcon from "./icons/home-icon";
import Button from "./buttons/button";
import LogoutButton from "@/components/buttons/logout-button";
import { checkIsAuthorized } from "@/utils/checkIsAuthorized";
import { cookies } from "next/headers";
import { getUser } from "@/utils/auth-functions";
import { User } from "@/prisma/generated-prisma-client";
import log from "@/utils/consoleLogger";

export default async function Navbar() {
  log.warn("Loading navbar...");
  const cookieStore = await cookies();
  const user = await getUser(cookieStore, { email: true, id: true });
  const isLoggedIn = Boolean(user);
  const isAdmin =
    user && (await checkIsAuthorized(cookieStore, { roleNeeded: "admin" }));
  log.success("Done with loading navbar");
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        fontSize: "14px",
      }}
    >
      <div>
        <Link href="/" style={{ color: "inherit" }}>
          <HomeIcon />
        </Link>
      </div>

      <div style={{ marginLeft: isAdmin ? "100px" : "300px" }}>
        <Link href="/" style={{ marginRight: "20px", color: "inherit" }}>
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link
              href={`/users/${(user as User).id}`} // If logged in, user exists.
              style={{ marginRight: "20px", color: "inherit" }}
            >
              My Profile
            </Link>
            <Link
              href={`/posts?userId=${(user as User).id}`} // If logged in, user exists.
              style={{ marginRight: "20px", color: "inherit" }}
            >
              My Posts
            </Link>
          </>
        )}

        {isLoggedIn && isAdmin && (
          <>
            <Link
              href="/users"
              style={{ marginRight: "20px", color: "inherit" }}
            >
              All Users
            </Link>
            <Link
              href="/posts"
              style={{ marginRight: "20px", color: "inherit" }}
            >
              All Posts
            </Link>
            <Link
              href="/rbac-settings"
              style={{ marginRight: "20px", color: "inherit" }}
            >
              RBAC Settings
            </Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "15px", color: "inherit" }}>
                <Link
                  href="/profile"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <p>Logged in as: {user.email}</p>
                </Link>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link href="/login">
                <Button>LOGIN</Button>
              </Link>
              <Link href="/create-account">
                <Button>SIGN UP</Button>
              </Link>
            </div>
          )}
        </div>
        <div style={{ paddingTop: "3px" }}>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
