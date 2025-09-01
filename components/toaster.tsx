"use client";

import { useEffect, useState } from "react";
import styles from "./toaster.module.css";
import { ToastCookie } from "@/utils/types";

interface ToasterProps {
  toast: string | null;
}

export default function Toaster({ toast }: ToasterProps) {
  const message = toast ? (JSON.parse(toast) as ToastCookie).message : null;
  const isError = toast ? (JSON.parse(toast) as ToastCookie).isError : false;

  const [toastMsg, setToastMsg] = useState(message);
  const [isVisible, setIsVisible] = useState(!!toast);
  const [isErrorToast, setIsErrorToast] = useState(isError);

  useEffect(() => {
    if (toast) {
      // Base the actions of the toast on state instead of props because state will remain
      // the same between re-renders and gives time for animation to finish, at which point state can be reset
      setToastMsg(message);
      setIsVisible(true);
      setIsErrorToast(isError);
      setTimeout(() => {
        // reset state after animation finishes
        setIsVisible(false);
        setTimeout(() => {
          setToastMsg(null);
          setIsErrorToast(false);
        }, 500);
      }, 3000);
    }
  }, [toast, message, isError]);

  return (
    <div
      className={isVisible ? styles.toaster : styles.hiddenToaster}
      style={{ backgroundColor: isErrorToast ? "#8B0000" : "#06402B" }}
    >
      <div className={styles.toasterContent}>
        <p>{toastMsg?.toUpperCase()}</p>
      </div>
    </div>
  );
}
