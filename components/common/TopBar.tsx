"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchInAppNotifications } from "@/api/apiNotifications";
import { useUser } from "@/context/UserContext";
import { getDevices } from "@/api/apiDevices"; // اضافه شده

export default function TopBar() {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [deviceCount, setDeviceCount] = useState<number>(0); // جدید
  const router = useRouter();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();

  const tooltips: Record<
    string,
    { title: string; desc: string; icon: string }
  > = {
    search: {
      title: "جستجو",
      desc: "آگهی‌ها، کارفرمایان و کارجویان",
      icon: "🔍",
    },
    notification: {
      title: "اعلان‌ها",
      desc: " ",
      icon: "🔔",
    },
    chat: { title: "چت", desc: " ", icon: "💬" },
    home: { title: "خانه", desc: " ", icon: "🏠" },
  };

  const renderTooltip = (key: string) => (
    <div className="hidden md:flex pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out bg-[#0B1220]/95 backdrop-blur-lg text-white px-2 py-3 rounded-2xl shadow-2xl z-[9999]">
      <div className="flex flex-col text-right">
        <div className="flex items-center gap-1">
          <span className="text-[2.4vh]">{tooltips[key].icon}</span>
          <span className="text-[2vh] font-semibold">
            {tooltips[key].title}
          </span>
        </div>
        <span className="text-xs text-gray-300 leading-5 w-full block text-right">
          {tooltips[key].desc}
        </span>
      </div>
    </div>
  );

  // دریافت تعداد نوتیفیکیشن‌های خوانده‌نشده
  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    console.log("🔄 در حال دریافت تعداد پیام‌های خوانده‌نشده از سرور...");
    try {
      const notifications = await fetchInAppNotifications();
      const unread = notifications.filter((n) => !n.isRead).length;
      console.log(`📊 تعداد پیام‌های خوانده‌نشده: ${unread} عدد`);
      setUnreadCount(unread);
    } catch (error) {
      console.error("❌ خطا در دریافت نوتیفیکیشن‌ها:", error);
    }
  }, [user]);

  // دریافت تعداد دستگاه‌های فعال (جدید)
  const loadDevices = useCallback(async () => {
    if (!user) {
      setDeviceCount(0);
      return;
    }
    console.log("🔄 در حال دریافت تعداد دستگاه‌های فعال...");
    try {
      const res = await getDevices();
      const sessions = res?.sessions || [];
      setDeviceCount(sessions.length);
      console.log(`📱 تعداد دستگاه‌های فعال: ${sessions.length}`);
    } catch (error) {
      console.error("❌ خطا در دریافت دستگاه‌ها:", error);
      setDeviceCount(0);
    }
  }, [user]);

  // مجموع عددی که روی آیکون اعلان نشان داده می‌شود
  const totalBadgeCount = unreadCount + deviceCount;

  useEffect(() => {
    loadUnreadCount();
    loadDevices(); // اضافه شده

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("👁️ تب مرورگر فعال شد - بروزرسانی");
        loadUnreadCount();
        loadDevices(); // به‌روزرسانی دستگاه‌ها هنگام فعال شدن تب
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handlePopState = () => {
      console.log("🔙 کاربر با دکمه Back برگشت - بروزرسانی");
      loadUnreadCount();
      loadDevices(); // به‌روزرسانی دستگاه‌ها هنگام بازگشت
    };
    window.addEventListener("popstate", handlePopState);

    const handleNotificationRead = () => {
      console.log("🔔 رویداد مطالعه پیام دریافت شد - بروزرسانی");
      loadUnreadCount();
    };
    window.addEventListener("notificationRead", handleNotificationRead);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("notificationRead", handleNotificationRead);
    };
  }, [loadUnreadCount, loadDevices]); // وابستگی‌ها به‌روز شد

  const handleNotificationClick = () => {
    router.push("/dashboard/messages?tab=barchasb");
  };

  const performRedirect = (query: string) => {
    const trimmed = query.trim();
    if (trimmed === "") return;
    router.push(`/search-ads?q=${encodeURIComponent(trimmed)}`);
  };

  const debouncedRedirect = (query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performRedirect(query);
    }, 500);
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      debouncedRedirect(searchQuery);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  const handleImmediateSearch = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    performRedirect(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      performRedirect(searchQuery);
    }
  };

  return (
    <div className="flex justify-between h-[7vh] items-end">
      {/* Logo + Search */}
      <div className="flex items-center gap-4 flex-1 relative">
        <div className="relative w-[8vh] h-[7vh]">
          <Image
            src="/images/logo_barchasb.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="relative flex items-center flex-1">
          <div
            className="w-[7vh] h-[7vh] rounded-[10px] flex items-center justify-center bg-[#F5F5F5] cursor-pointer group z-10"
            onClick={() => {
              if (isActive && searchQuery.trim()) {
                handleImmediateSearch();
              } else {
                setIsActive(!isActive);
              }
            }}
          >
            <Image
              src="/images/search_panel.svg"
              alt="Search"
              width={25}
              height={25}
            />
            {renderTooltip("search")}
          </div>

          <div
            className={`absolute top-0 right-0 h-[7vh] bg-[#F5F5F5] rounded-[10px] flex items-center overflow-hidden transition-all duration-500 ease-in-out ${
              isActive
                ? "w-[calc(100%-60px)] opacity-100 translate-x-0 shadow-sm"
                : "w-0 opacity-0 translate-x-5"
            }`}
            style={{ zIndex: 5 }}
          >
            <div
              className={`flex items-center justify-center w-[50px] h-full transition-all duration-500 ${
                isActive
                  ? "opacity-100 translate-x-0 cursor-pointer"
                  : "opacity-0 translate-x-3"
              }`}
              onClick={handleImmediateSearch}
            >
              <Image
                src="/images/search_panel.svg"
                alt="Search"
                width={22}
                height={22}
              />
            </div>
            <input
              type="text"
              placeholder="جستجوی آگهی‌ها، کارفرمایان و ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 h-full bg-transparent text-right text-[16px] font-normal pr-2 outline-none placeholder-gray-500 transition-all duration-500 ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-3"
              }`}
            />
          </div>
        </div>
      </div>

      {/* دکمه‌های سمت راست (ثبت آگهی، اعلان، چت، خانه) */}
      <div className="flex items-center gap-4 ml-1 relative">
        <button
          onClick={() => router.push("/dashboard/createform")}
          className="flex items-center bg-[#143A62] text-white text-[2.5vh] rounded-[2vh] px-[14px] h-[6.6vh] gap-[12px]"
        >
          <Image
            src="/images/ads_icon.svg"
            alt="Ads Icon"
            width={20}
            height={22}
          />
          ثبت آگهی
        </button>

        {/* دکمه اعلان‌ها با نشانگر مجموع (اعلان‌های نخوانده + دستگاه‌های فعال) */}
        <div
          onClick={handleNotificationClick}
          className="relative w-[7vh] h-[7vh] rounded-[10px] flex items-center justify-center bg-[#F5F5F5] group cursor-pointer"
        >
          <Image
            src="/images/notification_panel.svg"
            alt="Notification"
            width={22}
            height={22}
          />
          {totalBadgeCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full shadow-md">
              {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
            </span>
          )}
          {renderTooltip("notification")}
        </div>

        <div
          onClick={() => router.push("/dashboard/chat")}
          className="relative w-[7vh] h-[7vh] rounded-[10px] flex items-center justify-center bg-[#F5F5F5] group cursor-pointer"
        >
          <Image src="/images/chat.svg" alt="Chat" width={22} height={22} />
          {renderTooltip("chat")}
        </div>

        <div
          onClick={() => router.push("/")}
          className="relative w-[7vh] h-[7vh] rounded-[10px] flex items-center justify-center bg-[#F5F5F5] group cursor-pointer"
        >
          <Image src="/images/homeicon.svg" alt="Home" width={22} height={22} />
          {renderTooltip("home")}
        </div>
      </div>
    </div>
  );
}
