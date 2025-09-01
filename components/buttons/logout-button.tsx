"use client";

import { logout } from "@/server-functions/logout";
import Button from "./button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };
  return <Button onClick={handleLogout}>LOG OUT</Button>;
}
