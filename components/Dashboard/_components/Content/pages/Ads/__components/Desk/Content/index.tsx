"use client";
import React, { useState, useRef, useEffect } from "react";
import { useFilters } from "@/context/FiltersContext";
import CardContent from "./___components/CardContent";
import KioskContent from "./___components/KioskContent";
import { fetchJobSeekerAds } from "@/api/apiJobSeeker";
import { getSellerAds } from "@/api/apiSeller";
import { fetchEmployerAds } from "@/api/apiEmployer";
import { trackAdView } from "@/api/apiAdView";

interface Card {
  id: number;
  title: string;
  description?: string;
  city: string;
  rating?: string;
  price?: string;
  imageSrc?: string;
  typeWork?: string;
  category?: string;
  portfolio?: string;
  time?: string;
  adType?: string;
  adId?: string;
}

const mapTimeFilter = (
  selectedTime: string | null | undefined,
): string | undefined => {
  if (!selectedTime) return undefined;
  const map: Record<string, string> = {
    امروz: "today",
    "این هفته": "thisWeek",
    "این ماه": "thisMonth",
    امسال: "thisYear",
  };
  return map[selectedTime];
};

const Content: React.FC = () => {
  const { activeTab, filters } = useFilters();

  const [jobseekerCards, setJobseekerCards] = useState<Card[]>([]);
  const [employerAdsCards, setEmployerAdsCards] = useState<Card[]>([]);
  const [adsCards, setAdsCards] = useState<Card[]>([]);

  const [loadingJobseeker, setLoadingJobseeker] = useState(false);
  const [loadingEmployer, setLoadingEmployer] = useState(false);
  const [loadingAds, setLoadingAds] = useState(false);

  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // ========== کارجو ==========
  useEffect(() => {
    if (activeTab !== "karjo") return;

    const fetchJobSeeker = async () => {
      setLoadingJobseeker(true);
      setJobseekerCards([]);

      try {
        const karjoFilters = filters.karjo;

        const mapGender = (gender: string | null) => {
          if (gender === "مرد") return "male";
          if (gender === "زن") return "female";
          return undefined;
        };

        const portfolioToWorkExp = (portfolio: string | null) => {
          if (portfolio === "بله") return true;
          if (portfolio === "خیر") return false;
          return undefined;
        };

        const hasWorkExp =
          karjoFilters.hasWorkExperience ??
          portfolioToWorkExp(karjoFilters.selectedPortfolio);

        const res = await fetchJobSeekerAds({
          searchText: karjoFilters.searchText,
          selectedTime: karjoFilters.selectedTime,
          selectedCities: karjoFilters.selectedCities,
          selectedStates: karjoFilters.selectedStates,
          hasWorkExperience: hasWorkExp,
          gender: mapGender(karjoFilters.selectedGender),
          minAge: karjoFilters.minAge
            ? parseInt(karjoFilters.minAge, 10)
            : undefined,
          maxAge: karjoFilters.maxAge
            ? parseInt(karjoFilters.maxAge, 10)
            : undefined,
          jobCategory: karjoFilters.selectedCategory,
        });

        setJobseekerCards(
          res
            .filter((item: any) => item.adStatus === "approved")
            .map((item: any, index: number) => ({
              id: item._id || index,
              title: String(
                item.name || item.fullName || item.title || "بدون عنوان",
              ),
              description:
                item.careerHistory
                  ?.map((c: any) => `${c.title}- ${c.description}`)
                  .join("\n") || "",
              city: String(item.city || ""),
              rating:
                item.rating && typeof item.rating === "object"
                  ? `${item.rating.average}/5`
                  : "",
              time: item.createdAt ? "امروز" : "",
              portfolio: item.workSampleFile ? "بله" : "خیر",
              imageSrc:
                item.images?.find((img: any) => img.isMain)?.url ||
                item.images?.[0]?.url ||
                "/images/user_man.png",
              adType: "JobSeekerAd",
              adId: item._id,
            })),
        );
      } catch (error) {
        console.error("❌ Error fetching jobseeker ads:", error);
        setJobseekerCards([]);
      } finally {
        setLoadingJobseeker(false);
      }
    };

    fetchJobSeeker();
  }, [activeTab, filters.karjo]);

  // ========== کارفرما ==========
  useEffect(() => {
    if (activeTab !== "karfarma") return;

    const fetchEmployer = async () => {
      setLoadingEmployer(true);
      setEmployerAdsCards([]);

      try {
        const karfarmaFilters = filters.karfarma;
        const res = await fetchEmployerAds({
          searchText: karfarmaFilters.searchText,
          selectedCategory: karfarmaFilters.selectedCategory,
          selectedTypeWork: karfarmaFilters.selectedTypeWork
            ? [karfarmaFilters.selectedTypeWork]
            : undefined,
          selectedCities: karfarmaFilters.selectedCities,
          selectedTime: karfarmaFilters.selectedTime,
        });
        setEmployerAdsCards(
          res.map((item: any, index: number) => ({
            id: item._id || index,
            title: String(item.title || ""),
            description: String(item.companyDescription || ""),
            city: String(item.city || "شیراز"),
            rating:
              item.rating && typeof item.rating === "object"
                ? `${item.rating.average}/5`
                : "",
            time: item.createdAt ? "امروز" : "",
            typeWork: String(item.cooperationType || ""),
            category: String(item.category || ""),
            imageSrc:
              item.images?.find((img: any) => img.isMain)?.url ||
              item.images?.[0]?.url ||
              "/images/user_man.png",
            adType: "EmployerAd",
            adId: item._id,
          })),
        );
      } catch (error) {
        console.error("❌ Error fetching employer ads:", error);
        setEmployerAdsCards([]);
      } finally {
        setLoadingEmployer(false);
      }
    };

    fetchEmployer();
  }, [activeTab, filters.karfarma]);

  // ========== آگهی‌ها (کالا) ==========
  useEffect(() => {
    if (activeTab !== "agahi") return;

    const fetchSellerWithFilters = async () => {
      setLoadingAds(true);
      setAdsCards([]);

      try {
        const kioskFilters = filters.kiosk;
        const {
          selectedPrice,
          selectedTime,
          selectedCategory,
          selectedCities,
          searchText,
        } = kioskFilters;

        const params: any = {};

        if (selectedCategory.length > 0) {
          params.category = selectedCategory[0];
        }
        if (selectedPrice.min) {
          params.minPrice = parseInt(selectedPrice.min.replace(/,/g, ""), 10);
        }
        if (selectedPrice.max) {
          params.maxPrice = parseInt(selectedPrice.max.replace(/,/g, ""), 10);
        }
        const timeFilter = mapTimeFilter(selectedTime);
        if (timeFilter) params.timeFilter = timeFilter;
        if (selectedCities.length > 0) params.city = selectedCities.join(",");
        if (searchText) params.q = searchText;

        const res = await getSellerAds(params);

        setAdsCards(
          res.map((item: any, index: number) => ({
            id: item._id || index,
            title: String(item.title || ""),
            city: String(item.city || ""),
            price:
              typeof item.priceIRT === "number"
                ? item.priceIRT.toLocaleString()
                : "",
            time: item.createdAt ? "امروز" : "",
            category: String(item.category || ""),
            imageSrc:
              item.images?.find((img: any) => img.isMain)?.url ||
              item.images?.[0]?.url ||
              "/images/kioskimg_card.svg",
            adType: "SellerAd",
            adId: item._id,
          })),
        );
      } catch (error) {
        console.error("❌ Error fetching seller ads:", error);
        setAdsCards([]);
      } finally {
        setLoadingAds(false);
      }
    };

    fetchSellerWithFilters();
  }, [activeTab, filters.kiosk]);

  // باقی کدهای اسکرول و mouse/touch
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDrag = (e: MouseEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.clientY;
      containerRef.current.scrollTop = Math.max(
        0,
        containerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    setDragOffset(e.touches[0].clientY);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      containerRef.current.scrollTop = Math.max(
        0,
        containerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) containerRef.current.scrollTop += e.deltaY;
  };

  let isLoading = false;
  let currentCards: Card[] = [];
  let emptyMessage = "";

  if (activeTab === "karjo") {
    isLoading = loadingJobseeker;
    currentCards = jobseekerCards;
    emptyMessage = "🤝 هیچ کارجویی یافت نشد";
  } else if (activeTab === "karfarma") {
    isLoading = loadingEmployer;
    currentCards = employerAdsCards;
    emptyMessage = "🏢 هیچ کارفرمایی یافت نشد";
  } else {
    isLoading = loadingAds;
    currentCards = adsCards;
    emptyMessage = "📦 هیچ آگهی‌ای یافت نشد";
  }

  return (
    <div
      className="relative flex w-full bg-[#F5F5F5] h-[90%] p-4 pt-4 pb-0 md:flex md:flex-col rounded-[10px] overflow-y-hidden"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div ref={containerRef} className="overflow-hidden w-full h-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : currentCards.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full w-full text-center text-gray-500">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-lg font-medium">{emptyMessage}</p>
            <p className="text-sm mt-2">
              سعی کنید فیلترهای دیگری را امتحان کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-[1vh] md:gap-[4.8vh]">
            {currentCards.map((card) =>
              activeTab === "agahi" ? (
                <KioskContent
                  key={card.id}
                  id={String(card.id)}
                  title={card.title}
                  city={card.city}
                  price={card.price || ""}
                  imageSrc={card.imageSrc || ""}
                  adType={card.adType}
                  adId={card.adId}
                  onViewTrack={trackAdView}
                />
              ) : (
                <CardContent
                  key={card.id}
                  id={String(card.id)}
                  title={card.title}
                  description={card.description || ""}
                  city={card.city}
                  rating={card.rating || ""}
                  imageSrc={card.imageSrc || "/images/user_man.png"}
                  adType={card.adType}
                  adId={card.adId}
                  onViewTrack={trackAdView}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
