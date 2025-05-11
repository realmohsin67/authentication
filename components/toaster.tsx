"use client";

import { useEffect, useState } from "react";
import styles from "./toaster.module.css";
import { ToastCookie } from "@/utils/types";

type ToasterProps = {
  toast: string | null;
};

export default function Toaster({ toast }: ToasterProps) {
  const message = toast ? (JSON.parse(toast) as ToastCookie).message : null;

  const [toastMsg, setToastMsg] = useState(message);
  const [isVisible, setIsVisible] = useState(!!toast);

  useEffect(() => {
    if (toast) {
      setToastMsg(message);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(null);
        setTimeout(() => {
          setToastMsg(null);
        }, 500);
      }, 3000);
    }
  }, [toast, message]);

  return (
    <div className={isVisible ? styles.toaster : styles.hiddenToaster}>
      <div className={styles.toasterContent}>
        <p>{toastMsg}</p>
      </div>
    </div>
  );
}
