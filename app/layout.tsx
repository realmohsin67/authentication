import { cookies } from "next/headers";
import ThemeProvider from "@/contexts/theme-provider";
import Toaster from "@/components/toaster";
import styles from "./layout.module.css";
import { Theme } from "@/utils/types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value ?? "light") as Theme;
  const toast = cookieStore.get("toast")?.value ?? null;

  return (
    <html lang="en">
      <body className={styles[theme === "dark" ? "darkTheme" : "lightTheme"]}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
        <Toaster toast={toast} />
      </body>
    </html>
  );
}
