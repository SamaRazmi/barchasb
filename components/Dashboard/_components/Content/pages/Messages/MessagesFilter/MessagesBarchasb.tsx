"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  fetchInAppNotifications,
  markNotificationAsRead,
  getDevices,
  markSessionAsRead,
  InAppNotification,
  DeviceSession,
} from "@/api/apiMessages";

interface GroupedDevice {
  key: string;
  deviceType: string;
  browser: string;
  ip: string;
  lastActiveAt: string;
  sessionIds: string[];
  hasUnread: boolean;
}

export default function MessagesBarchasb() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [groupedDevices, setGroupedDevices] = useState<GroupedDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [expandedDeviceKey, setExpandedDeviceKey] = useState<string | null>(
    null,
  );

  // گروه‌بندی با محاسبه وضعیت خوانده نشده
  const groupDevices = useCallback(
    (rawDevices: DeviceSession[]): GroupedDevice[] => {
      const groupMap = new Map<string, GroupedDevice>();

      for (const dev of rawDevices) {
        if (!dev.id) continue;

        const deviceType =
          dev.deviceInfo?.deviceType || dev.deviceType || "نامشخص";
        const browser = dev.deviceInfo?.browser || dev.browser || "نامشخص";
        const ip = dev.deviceInfo?.ip || dev.ip || "نامشخص";
        const key = `${deviceType}|${browser}|${ip}`;
        const lastActive = dev.lastActiveAt;
        const isUnread = !dev.isRead; // true اگر نخوانده باشد

        if (!groupMap.has(key)) {
          groupMap.set(key, {
            key,
            deviceType,
            browser,
            ip,
            lastActiveAt: lastActive,
            sessionIds: [dev.id],
            hasUnread: isUnread,
          });
        } else {
          const existing = groupMap.get(key)!;
          existing.sessionIds.push(dev.id);
          // به‌روزرسانی hasUnread: اگر قبلاً true بوده یا این جلسه نخوانده باشد
          existing.hasUnread = existing.hasUnread || isUnread;
          if (new Date(lastActive) > new Date(existing.lastActiveAt)) {
            existing.lastActiveAt = lastActive;
          }
        }
      }

      return Array.from(groupMap.values()).sort(
        (a, b) =>
          new Date(b.lastActiveAt).getTime() -
          new Date(a.lastActiveAt).getTime(),
      );
    },
    [],
  );

  useEffect(() => {
    setLoadingNotifs(true);
    fetchInAppNotifications()
      .then((data) => setNotifications(data))
      .catch((err) => {
        console.error("خطا در بارگیری اعلان‌ها:", err);
        setNotifications([]);
      })
      .finally(() => setLoadingNotifs(false));
  }, []);

  const loadDevices = useCallback(async () => {
    setLoadingDevices(true);
    try {
      const res = await getDevices();
      const sessions = res?.sessions || [];
      setDevices(sessions);
      const grouped = groupDevices(sessions);
      setGroupedDevices(grouped);
    } catch (err) {
      console.error("خطا در دریافت دستگاه‌ها:", err);
      setDevices([]);
      setGroupedDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  }, [groupDevices]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const markGroupAsRead = async (group: GroupedDevice) => {
    const validIds = group.sessionIds.filter(
      (id) => id && typeof id === "string",
    );
    if (validIds.length === 0) return;

    try {
      await Promise.all(
        validIds.map((sessionId) => markSessionAsRead(sessionId)),
      );
      console.log(`✅ گروه ${group.deviceType} - ${group.browser} خوانده شد`);
      await loadDevices();
      window.dispatchEvent(new Event("refreshUnreadCounts"));
    } catch (err) {
      console.error("خطا در علامت‌گذاری دستگاه:", err);
    }
  };

  const handleNotifClick = async (notif: InAppNotification) => {
    setExpandedNotifId((prev) => (prev === notif.id ? null : notif.id));

    if (!notif.isRead) {
      try {
        await markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeviceClick = async (deviceKey: string) => {
    const willExpand = expandedDeviceKey !== deviceKey;
    setExpandedDeviceKey((prev) => (prev === deviceKey ? null : deviceKey));

    if (willExpand) {
      const group = groupedDevices.find((g) => g.key === deviceKey);
      if (group) {
        await markGroupAsRead(group);
      }
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // کامپوننت فلش (chevron) با چرخش
  const Chevron = ({ expanded }: { expanded: boolean }) => (
    <span
      className={`inline-block transition-transform duration-200 ${
        expanded ? "rotate-180" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </span>
  );

  const DeviceCard = ({ device }: { device: GroupedDevice }) => {
    const isExpanded = expandedDeviceKey === device.key;
    // رنگ دایره: اگر hasUnread == true -> قرمز (نخوانده)، در غیر این صورت سبز (خوانده شده)
    const dotColorClass = device.hasUnread ? "bg-red-500" : "bg-green-500";

    return (
      <div
        onClick={() => handleDeviceClick(device.key)}
        className="bg-transparent rounded-xl shadow-md p-4 border-r-4 border-gray-300 transition-all cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              {device.deviceType} - {device.browser}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${dotColorClass}`}
            ></span>
            <Chevron expanded={isExpanded} />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>نوع دستگاه:</strong> {device.deviceType}
              <br />
              <strong>مرورگر:</strong> {device.browser}
              <br />
              <strong>آخرین فعالیت:</strong> {formatDate(device.lastActiveAt)}
            </p>
          </div>
        )}
      </div>
    );
  };

  const NotificationCard = ({ notif }: { notif: InAppNotification }) => {
    const isExpanded = expandedNotifId === notif.id;

    return (
      <div
        onClick={() => handleNotifClick(notif)}
        className={`bg-transparent rounded-xl shadow-md p-4 border-r-4 transition-all cursor-pointer ${
          !notif.isRead ? "border-[#143A62] bg-blue-50" : "border-gray-300"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              {notif.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                notif.isRead ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <Chevron expanded={isExpanded} />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-gray-600 whitespace-pre-wrap">{notif.message}</p>
            <span className="block text-left text-xs text-gray-500">
              {new Date(notif.createdAt).toLocaleDateString("fa-IR")}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-right text-gray-700 mb-3 border-b pb-1">
          🔔 پیام‌های سیستم
        </h2>
        {loadingNotifs ? (
          <div>در حال بارگذاری...</div>
        ) : (
          notifications.map((notif) => (
            <NotificationCard key={notif.id} notif={notif} />
          ))
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-right text-gray-700 mb-3 border-b pb-1">
          📱 دستگاه‌های متصل
        </h2>
        {loadingDevices ? (
          <div>در حال بارگذاری دستگاه‌ها...</div>
        ) : groupedDevices.length === 0 ? (
          <div>هیچ دستگاه فعالی یافت نشد.</div>
        ) : (
          <div className="space-y-3">
            {groupedDevices.map((device) => (
              <DeviceCard key={device.key} device={device} />
            ))}
          </div>
        )}
      </div>

      <div className="h-96"></div>
    </div>
  );
}
