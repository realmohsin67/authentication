"use client";

import { createContext } from "react";
import { Theme } from "@/utils/types";

export const ThemeContext = createContext<Theme>("light");

export default function ThemeProvider({
  theme = "light",
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
