"use client";

import React, { useEffect, useState } from "react";
import {
  fetchInAppNotifications,
  InAppNotification,
  markNotificationAsRead,
} from "@/api/apiNotifications";
import { getDevices } from "@/api/apiDevices";

interface DeviceSession {
  _id: string;
  deviceInfo?: {
    deviceType: string;
    browser: string;
    ip: string;
    userAgent?: string;
  };
  deviceType?: string;
  browser?: string;
  ip?: string;
  lastActiveAt: string;
  createdAt: string;
  isActive: boolean;
}

export default function MessagesBarchasb() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);

  // اعلان‌ها
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

  // دستگاه‌ها
  useEffect(() => {
    setLoadingDevices(true);
    getDevices()
      .then((res) => {
        const sessions = res?.sessions || [];
        setDevices(sessions);
      })
      .catch((err) => {
        console.error("خطا در دریافت دستگاه‌ها:", err);
        setDevices([]);
      })
      .finally(() => setLoadingDevices(false));
  }, []);

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

  const handleDeviceClick = (deviceId: string) => {
    setExpandedDeviceId((prev) => (prev === deviceId ? null : deviceId));
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

  const DeviceCard = ({ device }: { device: DeviceSession }) => {
    const isExpanded = expandedDeviceId === device._id;

    const deviceType =
      device.deviceInfo?.deviceType || device.deviceType || "نامشخص";
    const browser = device.deviceInfo?.browser || device.browser || "نامشخص";
    const ip = device.deviceInfo?.ip || device.ip || "نامشخص";

    return (
      <div
        onClick={() => handleDeviceClick(device._id)}
        className="bg-transparent rounded-xl shadow-md p-4 border-r-4 border-gray-300 transition-all cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800 mt-1">
              {deviceType} - {browser}
            </h3>
          </div>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>نوع دستگاه:</strong> {deviceType}
              <br />
              <strong>مرورگر:</strong> {browser}
              <br />
              <strong>IP:</strong> {ip}
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
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              notif.isRead ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
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
      {/* Notifications */}
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

      {/* Devices */}
      <div>
        <h2 className="text-lg font-bold text-right text-gray-700 mb-3 border-b pb-1">
          📱 دستگاه‌های متصل
        </h2>
        {loadingDevices ? (
          <div>در حال بارگذاری دستگاه‌ها...</div>
        ) : devices.length === 0 ? (
          <div>هیچ دستگاه فعالی یافت نشد.</div>
        ) : (
          <div className="space-y-3">
            {devices.map((device, index) => (
              <DeviceCard key={device._id || index} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
