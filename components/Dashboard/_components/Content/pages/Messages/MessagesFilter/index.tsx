"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useSkills } from "@/context/SkillsContext";
import { useUser } from "@/context/UserContext";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import ChatMessagesContent from "../../Chat/[adType]/[adId]/[receiverId]/ChatMessagesContent";
import MessagesBarchasb from "./MessagesBarchasb";
import { fetchInAppNotifications } from "@/api/apiNotifications";
import { getDevices } from "@/api/apiDevices";

type OptionKey = "barchasb" | "karjo" | "karfarma" | "agahi";

const options: { key: OptionKey; label: string }[] = [
  { key: "barchasb", label: "برچسب" },
  { key: "karjo", label: "کارجو" },
  { key: "karfarma", label: "کارفرما" },
  { key: "agahi", label: "آگهی" },
];

interface Conversation {
  _id: string;
  participants: { _id: string; name: string }[];
  adId: string;
  adType: string;
  lastMessage: string;
  adImage?: string;
  adTitle?: string;
  unreadCount?: number;
}

const BASE_URL = "https://barchasb-server.liara.run/api";

export default function MessagesFilter() {
  const { activeTab, setActiveTab } = useSkills();
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [dragOffset, setDragOffset] = useState(0);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const [unreadCounts, setUnreadCounts] = useState<Record<OptionKey, number>>({
    barchasb: 0,
    karjo: 0,
    karfarma: 0,
    agahi: 0,
  });

  const adTypeParam = (params as any)?.adType;
  const adIdParam = (params as any)?.adId;
  const receiverIdParam = (params as any)?.receiverId;

  const typeMap: Record<OptionKey, string> = {
    barchasb: "",
    karjo: "JobSeekerAd",
    karfarma: "EmployerAd",
    agahi: "SellerAd",
  };

  // هماهنگ‌سازی اولیه با URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "barchasb" && activeTab !== "barchasb") {
      setActiveTab("barchasb");
    }
  }, []);

  // ======================= NEW: تابع دریافت مجموع (اعلان‌ها + دستگاه‌ها) برای برچسب =======================
  const refreshTotalBarchasbCount = useCallback(async () => {
    if (!user?._id) return;
    try {
      const [notifications, devicesRes] = await Promise.all([
        fetchInAppNotifications(),
        getDevices().catch(() => ({ sessions: [] })),
      ]);
      const unreadNotifs = notifications.filter((n) => !n.isRead).length;
      const deviceCount = devicesRes?.sessions?.length || 0;
      const total = unreadNotifs + deviceCount;
      setUnreadCounts((prev) => ({ ...prev, barchasb: total }));
    } catch (err) {
      console.error("Error fetching total barchasb count:", err);
    }
  }, [user?._id]);

  // توابع به‌روزرسانی برای سایر تب‌ها
  const refreshOtherCounts = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${BASE_URL}/chat/unread-count/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUnreadCounts((prev) => ({
          ...prev,
          karjo: data.data.karjo ?? 0,
          karfarma: data.data.karfarma ?? 0,
          agahi: data.data.agahi ?? 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching unread chat counts:", err);
    }
  }, [user?._id]);

  const refreshUnreadDetails = useCallback(async () => {
    if (!user?._id || !conversations.length) return;
    try {
      const res = await fetch(`${BASE_URL}/chat/unread-details/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.data) {
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            unreadCount: data.data[conv._id] || 0,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching unread details:", err);
    }
  }, [user?._id, conversations.length]);

  // دریافت اولیه و تنظیم بازه زمانی
  useEffect(() => {
    if (!user?._id) return;
    refreshTotalBarchasbCount();
    refreshOtherCounts();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshTotalBarchasbCount();
        refreshOtherCounts();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user?._id, refreshTotalBarchasbCount, refreshOtherCounts]);

  // گوش دادن به رویدادهای به‌روزرسانی فوری
  useEffect(() => {
    const handleRefresh = () => {
      refreshTotalBarchasbCount();
      refreshOtherCounts();
      refreshUnreadDetails();
    };
    window.addEventListener("refreshUnreadCounts", handleRefresh);
    window.addEventListener("notificationRead", handleRefresh);
    return () => {
      window.removeEventListener("refreshUnreadCounts", handleRefresh);
      window.removeEventListener("notificationRead", handleRefresh);
    };
  }, [refreshTotalBarchasbCount, refreshOtherCounts, refreshUnreadDetails]);

  // گرفتن مکالمات
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    const fetchConversationsFast = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chat/conversations/${user._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) {
          setConversations([]);
          setLoading(false);
          return;
        }
        const convs: Conversation[] = data.conversations || [];
        setConversations(convs);
        setLoading(false);
        // دریافت تصاویر و عنوان‌ها در پس‌زمینه
        const convsWithImages = await Promise.all(
          convs.map(async (conv) => {
            if (!conv.adId) return conv;
            let url = "";
            if (conv.adType === "EmployerAd")
              url = `${BASE_URL}/ads/employer/${conv.adId}`;
            else if (conv.adType === "JobSeekerAd")
              url = `${BASE_URL}/ads/jobseeker/${conv.adId}`;
            else if (conv.adType === "SellerAd")
              url = `${BASE_URL}/ads/seller/${conv.adId}`;
            else return conv;
            try {
              const res = await fetch(url, { credentials: "include" });
              const data = await res.json();
              let adTitle = "";
              if (conv.adType === "EmployerAd")
                adTitle = data.title || data.jobTitle || "";
              else if (conv.adType === "JobSeekerAd")
                adTitle = data.title || data.jobTitle || "";
              else if (conv.adType === "SellerAd")
                adTitle = data.title || data.productName || "";
              conv.adTitle = adTitle;
              let mainUrl: any = undefined;
              if (
                conv.adType === "EmployerAd" ||
                conv.adType === "JobSeekerAd"
              ) {
                mainUrl = data.images?.[0];
              } else if (conv.adType === "SellerAd") {
                const mainIndex = data.mainImageIndex ?? 0;
                mainUrl = data.images?.[mainIndex];
              }
              if (mainUrl) {
                if (
                  typeof mainUrl === "object" &&
                  "url" in mainUrl &&
                  mainUrl.url
                ) {
                  conv.adImage = mainUrl.url.startsWith("http")
                    ? mainUrl.url
                    : `${BASE_URL}/${mainUrl.url}`;
                } else if (typeof mainUrl === "string") {
                  conv.adImage = mainUrl.startsWith("http")
                    ? mainUrl
                    : `${BASE_URL}/${mainUrl}`;
                }
              }
            } catch (err) {
              console.error("Error fetching ad details:", err);
            }
            return conv;
          }),
        );
        setConversations(convsWithImages);
        refreshUnreadDetails();
      } catch (err) {
        console.error(err);
        setConversations([]);
        setLoading(false);
      }
    };
    fetchConversationsFast();
  }, [user?._id, refreshUnreadDetails]);

  const handleConversationClick = (conv: Conversation) => {
    const otherUser = conv.participants.find((p) => p._id !== user?._id);
    if (!otherUser) return;
    if (conv.unreadCount && conv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c)),
      );
    }
    router.push(`/dashboard/chat/${conv.adType}/${conv.adId}/${otherUser._id}`);
  };

  if (user?._id && adTypeParam && adIdParam && receiverIdParam) {
    return (
      <ChatMessagesContent
        currentUserId={user._id}
        receiverId={receiverIdParam}
        adId={adIdParam}
        adType={adTypeParam}
      />
    );
  }

  const filteredConversations =
    activeTab !== "barchasb"
      ? conversations.filter((c) => c.adType === typeMap[activeTab])
      : [];

  // رویدادهای اسکرول با صفحه‌کلید (برای دسکتاپ)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = desktopContainerRef.current;
      if (!container) return;
      const scrollAmount = 100;
      const pageScrollAmount = container.clientHeight;
      switch (e.key) {
        case "ArrowDown":
          container.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          container.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          container.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          container.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // اسکرول با کشیدن ماوس (drag)
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      const container = desktopContainerRef.current;
      if (!container) return;
      const delta = dragOffset - e.clientY;
      container.scrollTop = Math.max(0, container.scrollTop + delta);
      setDragOffset(e.clientY);
    },
    [dragOffset],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragOffset(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = mobileContainerRef.current;
    if (!container) return;
    const delta = dragOffset - e.touches[0].clientY;
    container.scrollTop = Math.max(0, container.scrollTop + delta);
    setDragOffset(e.touches[0].clientY);
  };

  const UnreadBadge = ({ count }: { count: number }) => {
    return (
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <span className="flex items-center justify-center min-w-[20px] h-5 bg-red-600 text-white text-[11px] font-bold rounded-full px-1 shadow-md">
          {count > 99 ? "99+" : count}
        </span>
      </div>
    );
  };

  return (
    <div className="h-[50vh] md:h-screen overflow-hidden">
      {/* حالت دسکتاپ */}
      <div className="hidden sm:block w-full h-full">
        <div className="w-full flex flex-col items-center h-full">
          <div className="w-[80%] pr-1 py-1 rounded-t-[10px] mt-[4vh] flex-shrink-0">
            <div className="w-fit-content bg-white shadow-[0px_0px_4px_0px_#0000001A] rounded-[10px] flex items-center relative">
              {options.map((opt) => {
                const isSelected = opt.key === activeTab;
                return (
                  <div
                    key={opt.key}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTab(opt.key);
                      Promise.resolve().then(() => {
                        if (
                          opt.key !== "barchasb" &&
                          searchParams.get("tab") === "barchasb"
                        ) {
                          router.replace("/dashboard/messages");
                        } else if (
                          opt.key === "barchasb" &&
                          !searchParams.has("tab")
                        ) {
                          router.replace("/dashboard/messages?tab=barchasb");
                        }
                      });
                    }}
                    className="flex-1 cursor-pointer px-1 relative"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#143A62] rounded-[10px] z-0"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="relative flex items-center justify-center z-10 py-2 px-5">
                      <span
                        className={`text-[2.2vh] ${isSelected ? "text-white" : "text-[#143A62]"}`}
                      >
                        {opt.label}
                      </span>
                    </div>
                    <UnreadBadge count={unreadCounts[opt.key]} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* کانتینر اسکرول دسکتاپ - بدون نوار اسکرول و با قابلیت اسکرول با ماوس، کیبورد و درگ */}
          <div
            ref={desktopContainerRef}
            className="w-full mt-3 flex flex-col items-center flex-1 min-h-0 overflow-y-auto hide-scrollbar"
            onMouseDown={activeTab !== "barchasb" ? handleMouseDown : undefined}
          >
            {!loading && (
              <>
                {activeTab === "barchasb" ? (
                  <MessagesBarchasb />
                ) : filteredConversations.length === 0 ? (
                  <div className="py-8 text-center w-full text-gray-500">
                    <p>📭 هیچ پیامی وجود ندارد</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const otherUser = conv.participants.find(
                      (p) => p._id !== user?._id,
                    );
                    const unreadCount = conv.unreadCount ?? 0;
                    return (
                      <div
                        key={conv._id}
                        className="relative flex justify-between items-center cursor-pointer border rounded-lg p-4 mb-2 bg-transparent hover:bg-gray-100 w-[95%] max-w-3xl"
                        onClick={() => handleConversationClick(conv)}
                      >
                        {conv.adImage ? (
                          <img
                            src={conv.adImage}
                            alt="ad"
                            loading="lazy"
                            className="w-16 h-16 object-cover rounded-lg ml-4"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg ml-4 flex flex-col items-center justify-center text-gray-500 text-xs">
                            <span>بدون عکس</span>
                          </div>
                        )}
                        <div className="flex flex-col flex-1 mr-4">
                          <div className="font-bold text-gray-700 flex items-center">
                            {otherUser?.name}
                            {conv.adTitle && ` - ${conv.adTitle}`}
                          </div>
                          <div className="text-gray-600 truncate">
                            {conv.lastMessage}
                          </div>
                        </div>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          {unreadCount === 0 ? (
                            <img
                              src="/images/tick_read.svg"
                              alt="read"
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 bg-red-600 text-white text-xs font-bold rounded-full px-1 shadow-md">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* حالت موبایل */}
      <div className="sm:hidden flex items-start justify-center h-full w-[100%] md:w-full bg-gray-50 p-4 overflow-hidden">
        <div className="w-4/5 max-w-md bg-white rounded-2xl shadow-xl p-4 flex flex-col max-h-full">
          <div className="flex bg-white rounded-xl shadow-md w-full px-2 py-2 gap-1 relative flex-shrink-0">
            {options.map((opt) => {
              const isSelected = opt.key === activeTab;
              return (
                <div
                  key={opt.key}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab(opt.key);
                    Promise.resolve().then(() => {
                      if (
                        opt.key !== "barchasb" &&
                        searchParams.get("tab") === "barchasb"
                      ) {
                        router.replace("/dashboard/messages");
                      } else if (
                        opt.key === "barchasb" &&
                        !searchParams.has("tab")
                      ) {
                        router.replace("/dashboard/messages?tab=barchasb");
                      }
                    });
                  }}
                  className="flex-1 cursor-pointer relative"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-[#143A62] rounded-xl z-0"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <div className="relative flex items-center justify-center z-10 py-[6px]">
                    <span
                      className={`text-[14px] ${isSelected ? "text-white" : "text-[#143A62]"}`}
                    >
                      {opt.label}
                    </span>
                  </div>
                  <UnreadBadge count={unreadCounts[opt.key]} />
                </div>
              );
            })}
          </div>

          <div
            ref={mobileContainerRef}
            className="flex-1 overflow-y-auto flex flex-col items-center gap-2 min-h-0 mt-4 hide-scrollbar"
            onTouchStart={
              activeTab !== "barchasb" ? handleTouchStart : undefined
            }
            onTouchMove={activeTab !== "barchasb" ? handleTouchMove : undefined}
          >
            {!loading && (
              <>
                {activeTab === "barchasb" ? (
                  <MessagesBarchasb />
                ) : filteredConversations.length === 0 ? (
                  <div className="py-8 text-center w-full text-gray-500">
                    <p>📭 هیچ پیامی وجود ندارد</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const otherUser = conv.participants.find(
                      (p) => p._id !== user?._id,
                    );
                    const unreadCount = conv.unreadCount ?? 0;
                    return (
                      <div
                        key={conv._id}
                        className="relative flex justify-between items-center cursor-pointer border rounded-lg p-3 mb-2 bg-transparent hover:bg-gray-100 w-full"
                        onClick={() => handleConversationClick(conv)}
                      >
                        {conv.adImage ? (
                          <img
                            src={conv.adImage}
                            alt="ad"
                            loading="lazy"
                            className="w-12 h-12 object-cover rounded-lg ml-3"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg ml-3 flex flex-col items-center justify-center text-gray-500 text-xs">
                            <span>بدون عکس</span>
                          </div>
                        )}
                        <div className="flex flex-col flex-1 mr-2">
                          <div className="font-bold text-gray-700 text-sm flex items-center">
                            {otherUser?.name}
                            {conv.adTitle &&
                              ` - ${conv.adTitle.substring(0, 20)}`}
                          </div>
                          <div className="text-gray-600 text-xs truncate">
                            {conv.lastMessage}
                          </div>
                        </div>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                          {unreadCount === 0 ? (
                            <img
                              src="/images/tick_read.svg"
                              alt="read"
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 bg-red-600 text-white text-[10px] font-bold rounded-full px-1 shadow-md">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Opera */
        }
      `}</style>
    </div>
  );
}
