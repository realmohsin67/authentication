"use client";
import { use } from "react";
import DarkModeIcon from "./icons/dark-mode-icon";
import LightModeIcon from "./icons/light-mode-icon";
import styles from "./theme-switcher.module.css";
import { ThemeContext } from "@/contexts/theme-provider";

import { toggleThemeCookie } from "@/server-functions/toggleThemeCookie";

export default function ThemeSwitcher() {
  const theme = use(ThemeContext);
  const handleClick = async () => {
    const result = await toggleThemeCookie();
  };
  return (
    <button className={styles.themeSwitcher} onClick={handleClick}>
      {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </button>
  );
}
