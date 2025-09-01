import { cookies } from "next/headers";
import ThemeProvider from "@/contexts/theme-provider";
import Toaster from "@/components/toaster";
import { Theme } from "@/utils/types";
import Navbar from "@/components/navbar";
import LogoutTimer from "@/components/logout-timer";
import ForceLogoutChecker from "@/components/force-logout-checker";
import "@/styles/globals.css";
import ForceLogoutRouteChecker from "@/components/forced-logout-path-checker";

if (process.env.MOCKS === "true") {
  const { server } = require("@/mocks/server");
  const log = require("@/utils/consoleLogger").default;
  log.info("Mock API server is running...");
  server.listen({ onUnhandledRequest: "warn" });
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value ?? "light") as Theme;
  const toast = cookieStore.get("toast")?.value ?? null;
  const sessionId = cookieStore.get("sessionId")?.value ?? null;
  console.log("Theme:", theme);
  return (
    <html lang="en">
      <body className={`${theme}-theme`}>
        <ForceLogoutRouteChecker>
          <ThemeProvider theme={theme}>
            <Navbar />
            {children}
          </ThemeProvider>
          <Toaster toast={toast} />
          <LogoutTimer sessionId={sessionId} />
          <ForceLogoutChecker sessionId={sessionId} />
        </ForceLogoutRouteChecker>
      </body>
    </html>
  );
}
