"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import socket from "@/lib/socket";

/* ================= TYPES ================= */

export interface NotificationType {
  _id: string | number;
  fromUserId: string;
  message: string;
  adId: string;
  adType: string;
}

interface NotificationContextType {
  notifications: NotificationType[];
  addNotification: (notification: NotificationType) => void;
  clearNotifications: () => void;
}

/* ================= CONTEXT ================= */

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

/* ================= PROVIDER ================= */

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  /* ===== دریافت اعلان‌های آفلاین ===== */
  useEffect(() => {
    socket.on("offlineNotifications", (list: NotificationType[]) => {
      setNotifications(list);
    });

    /* ===== پیام realtime ===== */
    socket.on("receiveMessage", (msg: any) => {
      // اگر صفحه چت باز نیست اینجا نوتیفیکیشن بساز
      const newNotification: NotificationType = {
        _id: Date.now(),
        fromUserId: msg.from,
        message: msg.content,
        adId: msg.adId,
        adType: msg.adType,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off("offlineNotifications");
      socket.off("receiveMessage");
    };
  }, []);

  const addNotification = (notification: NotificationType) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }
  return context;
};
