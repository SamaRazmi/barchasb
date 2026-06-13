"use client";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import CardContent from "../../../Ads/__components/Desk/Content/___components/CardContent";
import KioskContent from "../../../Ads/__components/Desk/Content/___components/KioskContent";

type TabKey = "karjo" | "karfarma" | "agahi";

const tabs: { key: TabKey; label: string }[] = [
  { key: "karjo", label: "کارجو" },
  { key: "karfarma", label: "کارفرما" },
  { key: "agahi", label: "آگهی" },
];

interface MarkedAd {
  markId: string;
  adType: string;
  ad: any;
}

const BadgesSection = () => {
  const { user, loading } = useUser();
  const [markedAds, setMarkedAds] = useState<MarkedAd[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("karjo");
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const fetchMarkedAds = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://barchasb-server.liara.run/api/marks/${user._id}/all`,
          { credentials: "include" },
        );
        const data = await res.json();
        setMarkedAds(data.marks);
      } catch (err) {
        console.error("خطا در گرفتن نشان شده‌ها:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarkedAds();
  }, [user]);

  const filteredAds = markedAds.filter((mark) => {
    if (activeTab === "karjo") return mark.adType === "JobSeekerAd";
    if (activeTab === "karfarma") return mark.adType === "EmployerAd";
    if (activeTab === "agahi") return mark.adType === "SellerAd";
    return false;
  });

  const getAdPrice = (mark: MarkedAd) => {
    const ad = mark.ad;
    if (!ad) return "0 تومان";
    if (mark.adType === "SellerAd")
      return ad.priceIRT ? `${ad.priceIRT.toLocaleString()} تومان` : "0 تومان";
    if (ad.price) {
      if (typeof ad.price === "string") return ad.price;
      if (ad.price.min && ad.price.max)
        return `${ad.price.min}-${ad.price.max} تومان`;
      if (ad.price.min) return `${ad.price.min} تومان`;
      if (ad.price.max) return `${ad.price.max} تومان`;
    }
    if (ad.amount) return `${ad.amount} تومان`;
    return "0 تومان";
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) containerRef.current.scrollTop += e.deltaY;
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (containerRef.current) {
        const delta = dragOffset - moveEvent.clientY;
        containerRef.current.scrollTop += delta;
        setDragOffset(moveEvent.clientY);
      }
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleTouchStart = (e: React.TouchEvent) =>
    setDragOffset(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      containerRef.current.scrollTop += delta;
      setDragOffset(e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const scrollAmount = 100;
      const pageAmount = containerRef.current.clientHeight;
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
          containerRef.current.scrollTop += pageAmount;
          e.preventDefault();
          break;
        case "PageUp":
          containerRef.current.scrollTop -= pageAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) return <div>در حال بارگذاری کاربر...</div>;

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      {/* ======================= SWITCH DESKTOP ======================= */}
      <div className="hidden sm:block w-[35%]">
        <div className="w-[99%] bg-[#E6E7E8] shadow-[0px_0px_4px_0px_#0000001A] rounded-[10px] flex items-center justify-between">
          {tabs.map((tab) => {
            const isSelected = tab.key === activeTab;
            return (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 cursor-pointer px-1"
              >
                {isSelected ? (
                  <div className="w-full rounded-[10px] py-2 px-5 flex items-center justify-center bg-[#143A62]">
                    <span className="text-[2.2vh] text-white">{tab.label}</span>
                  </div>
                ) : (
                  <div className="w-full rounded-[10px] flex items-center justify-center">
                    <span className="text-[2.2vh] text-[#143A62]">
                      {tab.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================= SWITCH MOBILE ======================= */}
      <div className="sm:hidden w-[90%] flex items-center justify-between gap-1 mt-3">
        <div className="flex bg-white rounded-xl shadow-md w-[100%] px-2 py-2 gap-1">
          {tabs.map((tab) => {
            const isSelected = tab.key === activeTab;
            return (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 cursor-pointer"
              >
                {isSelected ? (
                  <div className="rounded-xl bg-[#143A62] flex items-center justify-center py-[6px]">
                    <span className="text-[14px] text-white">{tab.label}</span>
                  </div>
                ) : (
                  <div className="rounded-xl flex items-center justify-center py-[6px]">
                    <span className="text-[14px] text-[#143A62]">
                      {tab.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================= CONTENT ======================= */}
      {isLoading && <div className="mt-4">در حال بارگذاری نشان‌ها...</div>}
      {!isLoading && filteredAds.length === 0 && (
        <div className="text-[2vh] text-[#143A62D9] mt-4">
          هیچ موردی برای این دسته‌بندی وجود ندارد.
        </div>
      )}

      <div
        ref={containerRef}
        className="h-[34vh] md:h-[70vh] overflow-hidden w-full sm:px-4 sm:mt-2"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredAds.map((mark) => (
            <div key={mark.markId}>
              {mark.adType === "JobSeekerAd" || mark.adType === "EmployerAd" ? (
                <CardContent
                  id={mark.ad._id}
                  title={mark.ad.title || mark.ad.name}
                  description={
                    mark.ad.companyDescription ||
                    mark.ad.careerHistory
                      ?.map((c: any) => `${c.title}- ${c.description}`)
                      .join("\n") ||
                    ""
                  }
                  city={mark.ad.city || ""}
                  rating={mark.ad.rating?.average?.toString() || "0"}
                  imageSrc={mark.ad.images?.[0]?.url || "/images/ResUser.jpg"}
                  initialMarked={true}
                />
              ) : (
                <KioskContent
                  id={mark.ad._id}
                  title={mark.ad.title || mark.ad.name}
                  city={mark.ad.city || ""}
                  price={getAdPrice(mark)}
                  imageSrc={mark.ad.images?.[0]?.url || "/images/ResUser.jpg"}
                  initialMarked={true}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesSection;
