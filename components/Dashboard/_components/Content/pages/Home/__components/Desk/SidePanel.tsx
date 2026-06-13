"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SliderSidebar from "../slide/SliderSidebar";
import { getSellerAds } from "@/api/apiSeller";
import { useFilters } from "@/context/FiltersContext";

function SidePanelContent() {
  const router = useRouter();
  const { setActiveTab } = useFilters();
  const [allAds, setAllAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoDelay = 3000;

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await getSellerAds({});
      const approvedAds = res.filter(
        (item: any) => item.adStatus === "approved",
      );
      console.log("✅ تعداد آگهی‌های تأیید شده:", approvedAds.length);
      setAllAds(approvedAds);
    } catch (error) {
      console.error("❌ خطا در دریافت:", error);
      setAllAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const sortedAds = useMemo(() => {
    return [...allAds].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allAds]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [sortedAds.length]);

  const clearTimer = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const startTimer = () => {
    if (sortedAds.length > 1) {
      clearTimer();
      autoTimerRef.current = setInterval(() => {
        goToNext();
      }, autoDelay);
    }
  };

  const goToNext = () => {
    if (transitioning || sortedAds.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedAds.length);
      setTransitioning(false);
    }, 300);
    startTimer();
  };

  const goToPrev = () => {
    if (transitioning || sortedAds.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + sortedAds.length) % sortedAds.length,
      );
      setTransitioning(false);
    }, 300);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [sortedAds.length]);

  const currentItem = sortedAds[currentIndex];

  const handleCardClick = () => {
    if (currentItem?._id) {
      setActiveTab("agahi");
      router.push(`/dashboard/ads/${currentItem._id}?adType=SellerAd`);
    }
  };
  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPrev();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNext();
  };

  const getMappedProps = (ad: any) => {
    let imageSrc = "/images/kioskimg_card.svg";
    if (ad.images && Array.isArray(ad.images)) {
      const mainImg = ad.images.find((img: any) => img.isMain === true);
      if (mainImg && typeof mainImg === "object" && mainImg.url) {
        imageSrc = mainImg.url;
      } else if (ad.images[0]) {
        imageSrc =
          typeof ad.images[0] === "string"
            ? ad.images[0]
            : ad.images[0]?.url || imageSrc;
      }
    }
    return {
      title: ad.title || "بدون عنوان",
      location: ad.city || "",
      salary: ad.priceIRT ? ad.priceIRT.toLocaleString() + " تومان" : "",
      jobType: ad.category || "",
      img: imageSrc,
      personName: undefined,
      experience: undefined,
      details: undefined,
      contactName: undefined,
      positions: undefined,
      skills: undefined,
      jobTitle: undefined,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-[#F5F5F5] rounded-[16px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#143A62]"></div>
      </div>
    );
  }

  if (sortedAds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#F5F5F5] rounded-[16px] p-4 text-center text-gray-500">
        <span>📭 آگهی‌ای برای نمایش وجود ندارد</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-hidden relative bg-[#F5F5F5] rounded-[16px] p-2 h-full">
      {/* عنوان */}
      <div className="flex justify-center mb-2 sm:mb-4">
        <div className="w-full max-w-[274px] h-[40px] sm:h-[47px] bg-[#D9D9D9] rounded-[16px] flex justify-center items-center">
          <span className="text-[18px] md:text-[20px] font-[400] text-[#143A62]">
            جدیدترین آگهی‌ها
          </span>
        </div>
      </div>

      {/* محوطه اسلایدر */}
      <div className="relative flex-1 rounded-[16px] overflow-hidden p-3 flex justify-center items-center">
        {/* فلش بالا */}
        {sortedAds.length > 1 && (
          <div
            onClick={handlePrevClick}
            className="absolute top-6 left-1/2 -translate-x-1/2 cursor-pointer z-50 select-none"
          >
            <Image
              src="/images/arrow-slider-top-dashboard.svg"
              alt="فلش بالا"
              width={40}
              height={40}
            />
          </div>
        )}

        {/* کارت کلیک‌پذیر */}
        <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
          <div
            key={currentIndex}
            onClick={handleCardClick}
            className={`transition-all duration-300 ease-in-out w-full h-full flex justify-center items-center cursor-pointer
              ${transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }}
          >
            <SliderSidebar
              title={getMappedProps(currentItem).title}
              personName={getMappedProps(currentItem).personName}
              experience={getMappedProps(currentItem).experience}
              details={getMappedProps(currentItem).details}
              contactName={getMappedProps(currentItem).contactName}
              positions={getMappedProps(currentItem).positions}
              skills={getMappedProps(currentItem).skills}
              jobType={getMappedProps(currentItem).jobType}
              salary={getMappedProps(currentItem).salary}
              location={getMappedProps(currentItem).location}
              img={getMappedProps(currentItem).img}
            />
          </div>
        </div>

        {/* فلش پایین */}
        {sortedAds.length > 1 && (
          <div
            onClick={handleNextClick}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-10 select-none"
          >
            <Image
              src="/images/arrow-slider-bottom-dashboard.svg"
              alt="فلش پایین"
              width={40}
              height={40}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SidePanelWithProvider() {
  return <SidePanelContent />;
}
