"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./logout-timer.module.css";
import { logout } from "@/server-functions/logout";
// import { User } from "@/prisma/generated-prisma-client";

const TIME_TO_MODAL = 1000 * 60 * 30;
const TIME_TO_AUTO_LOGOUT = 1000 * 60 * 35;

interface LogoutTimerProps {
  sessionId: string | null;
}

export default function LogoutTimer({ sessionId }: LogoutTimerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showModal, setShowModal] = useState(false);

  const modalTimerHandle = useRef<ReturnType<typeof setTimeout>>(null);
  const logoutTimerHandle = useRef<ReturnType<typeof setTimeout>>(null);

  const clearTimers = () => {
    if (modalTimerHandle.current) clearTimeout(modalTimerHandle.current);
    if (logoutTimerHandle.current) clearTimeout(logoutTimerHandle.current);
  };

  const handleLogout = async () => {
    await logout();
  };

  const setTimers = () => {
    modalTimerHandle.current = setTimeout(() => {
      setShowModal(true);
    }, TIME_TO_MODAL);
    logoutTimerHandle.current = setTimeout(() => {
      setShowModal(false);
      handleLogout();
    }, TIME_TO_AUTO_LOGOUT);
  };

  useEffect(() => {
    clearTimers();
    if (sessionId) setTimers();
    return () => {
      clearTimers();
    };
  }, [pathname, searchParams, sessionId]);

  const handleStayLoggedIn = () => {
    setShowModal(false);
    clearTimers();
    setTimers();
  };

  const handleLogOut = () => {
    setShowModal(false);
    clearTimers();
    handleLogout();
  };

  return (
    <div>
      <div
        className={`${styles.modalBg} ${showModal ? styles.shownModalBg : styles.hiddenModalBg}`}
      >
        <div
          className={`${styles.modal} ${showModal ? styles.shownModal : styles.hiddenModal}`}
        >
          <h2>Are you still there?</h2>
          <p>Your session is about to expire. Do you want to stay logged in?</p>
          <div style={{ marginTop: "20px" }}>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleStayLoggedIn}
            >
              Stay Logged In
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleLogOut}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
