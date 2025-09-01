"use client";

import { useEffect } from "react";
import { logout } from "@/server-functions/logout";

export default function LogoutOnMount() {
  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
}
