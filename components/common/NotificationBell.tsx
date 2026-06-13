"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import socket from "@/lib/socket"; // مسیر فایل socket.ts
import axios from "axios";

interface NotificationItem {
  id: string | number;
  text: string;
}

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notificationCount = notifications.length;

  // 🔹 مرحله 1: گرفتن اعلان‌های ذخیره‌شده از بک‌اند
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get(
          `https://barchasb-server.liara.run/api/notifications/${userId}`,
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }

    fetchNotifications();
  }, [userId]);

  // 🔹 مرحله 2: اتصال به Socket.io برای اعلان‌های جدید
  useEffect(() => {
    // join کردن کاربر در socket
    socket.emit("join", { userId });

    // دریافت اعلان‌های ذخیره شده از سرور (زمانی که کاربر آنلاین شد)
    socket.on(
      "offlineNotifications",
      (offlineNotifications: NotificationItem[]) => {
        setNotifications((prev) => [...offlineNotifications, ...prev]);
      },
    );

    // دریافت پیام/اعلان جدید realtime
    socket.on("newNotification", (notif: NotificationItem) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("offlineNotifications");
      socket.off("newNotification");
    };
  }, [userId]);

  return (
    <div className="relative">
      {/* Icon */}
      <div
        onClick={() => setIsNotifOpen(!isNotifOpen)}
        className="w-[7vh] h-[7vh] rounded-[10px] flex items-center justify-center bg-[#F5F5F5] cursor-pointer relative"
      >
        <Image
          src="/images/notification_panel.svg"
          alt="Notification"
          width={22}
          height={22}
        />

        {/* Red Badge */}
        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[12px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center font-semibold shadow-md">
            {notificationCount}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isNotifOpen && (
        <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
          <div className="p-3 border-b font-semibold text-gray-700 text-sm">
            {notificationCount} اتفاق جدید
          </div>

          <div className="max-h-[250px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                اعلانی وجود ندارد
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 text-sm hover:bg-gray-100 cursor-pointer transition border-b last:border-none"
                >
                  {notif.text}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
