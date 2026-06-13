"use client";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { getRecentViews } from "@/api/apiRecentViews";

import CardContent from "../../../Ads/__components/Desk/Content/___components/CardContent";
import KioskContent from "../../../Ads/__components/Desk/Content/___components/KioskContent";
import RecentViewsFilter from "./RecentViewsFilter";

/* ======================= TYPES ======================= */
interface RecentView {
  _id: string;
  ad: any;
  adType: "SellerAd" | "JobSeekerAd" | "EmployerAd";
  viewedAt: string;
}

/* ======================= COMPONENT ======================= */
const RecentViewsSection = () => {
  const { user, loading: userLoading } = useUser();

  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"karjo" | "karfarma" | "agahi">(
    "karjo",
  );
  const [activeTime, setActiveTime] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);

  /* ======================= FETCH DATA ======================= */
  useEffect(() => {
    const fetchRecentViews = async () => {
      if (!user?._id || userLoading) return;

      setIsLoading(true);
      try {
        const data = await getRecentViews(user._id, activeTime);
        setRecentViews(data);
      } catch (err) {
        console.error("خطا در گرفتن بازدیدهای اخیر:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentViews();
  }, [user, userLoading, activeTime]);

  /* ======================= FILTERED ADS ======================= */
  const filteredAds = recentViews.filter((view) => {
    if (activeTab === "karjo") return view.adType === "JobSeekerAd";
    if (activeTab === "karfarma") return view.adType === "EmployerAd";
    if (activeTab === "agahi") return view.adType === "SellerAd";
    return false;
  });

  /* ======================= SCROLL HANDLERS ======================= */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      const scrollAmount = 100;
      const pageScrollAmount = containerRef.current.clientHeight;

      switch (e.key) {
        case "ArrowDown":
          containerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          containerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          containerRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          containerRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDrag = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const delta = dragOffset - e.clientY;
    const newScrollTop = containerRef.current.scrollTop + delta;
    containerRef.current.scrollTop = Math.max(
      0,
      Math.min(
        newScrollTop,
        containerRef.current.scrollHeight - containerRef.current.clientHeight,
      ),
    );
    setDragOffset(e.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragOffset(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    e.preventDefault(); // جلوگیری از اسکرول صفحه
    const delta = dragOffset - e.touches[0].clientY;
    const newScrollTop = containerRef.current.scrollTop + delta;
    containerRef.current.scrollTop = Math.max(
      0,
      Math.min(
        newScrollTop,
        containerRef.current.scrollHeight - containerRef.current.clientHeight,
      ),
    );
    setDragOffset(e.touches[0].clientY);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) {
      e.preventDefault();
      const newScrollTop = containerRef.current.scrollTop + e.deltaY;
      containerRef.current.scrollTop = Math.max(
        0,
        Math.min(
          newScrollTop,
          containerRef.current.scrollHeight - containerRef.current.clientHeight,
        ),
      );
    }
  };

  if (userLoading) return <div>در حال بارگذاری کاربر...</div>;

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
      {/* ======================= فیلترها (بالا در موبایل، راست در دسکتاپ) ======================= */}
      <div className="w-full md:w-1/3">
        <RecentViewsFilter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTime={activeTime}
          setActiveTime={setActiveTime}
        />
      </div>

      {/* ======================= کارت‌ها (پایین در موبایل، چپ در دسکتاپ) ======================= */}
      <div
        ref={containerRef}
        className="w-full md:w-2/3 h-[36vh] md:h-[70vh] overflow-hidden"
        style={{ touchAction: "none" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {isLoading && <div>در حال بارگذاری بازدیدها...</div>}
        {!isLoading && filteredAds.length === 0 && (
          <div className="text-[2vh] text-[#143A62D9] mt-4">
            هنوز بازدیدی برای این دسته‌بندی وجود ندارد.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {filteredAds.map((view) => {
            const ad = view.ad;
            if (!ad || typeof ad === "string") return null;

            const isJobAd =
              view.adType === "JobSeekerAd" || view.adType === "EmployerAd";

            return (
              <div key={view._id}>
                {isJobAd ? (
                  <CardContent
                    id={ad._id}
                    title={ad.title || ad.name}
                    description={ad.companyDescription || ""}
                    city={ad.city || ""}
                    rating={ad.rating?.average?.toString() || "0"}
                    imageSrc={ad.images?.[0]?.url || "/images/ResUser.jpg"}
                    initialMarked={false}
                  />
                ) : (
                  <KioskContent
                    id={ad._id}
                    title={ad.title || ad.name}
                    city={ad.city || ""}
                    price={
                      ad.priceIRT
                        ? `${ad.priceIRT.toLocaleString()} تومان`
                        : "0 تومان"
                    }
                    imageSrc={ad.images?.[0]?.url || "/images/ResUser.jpg"}
                    initialMarked={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentViewsSection;
