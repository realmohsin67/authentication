"use server";

import type { Theme } from "@/utils/types";
import { cookies } from "next/headers";

export async function toggleThemeCookie() {
  const cookieStore = await cookies();
  const currentTheme = (cookieStore.get("theme")?.value ?? "light") as Theme;
  const newTheme: Theme = currentTheme === "dark" ? "light" : "dark";
  cookieStore.set("theme", newTheme, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
