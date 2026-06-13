// components/Dashboard/_components/Content/pages/Projects/index.tsx
import React, { useState, useEffect } from "react";
import TopBar from "@/components/common/TopBar";
import ProjectsFilter from "./Desk/ProjectsFilter";
import Content from "./Desk/Content";
import { fetchDigitalAds } from "@/api/apiDigitalFilter"; // تابع API جدید
import { DigitalAd } from "@/types/digitalTypes";
import { trackAdView } from "@/api/apiAdView";

const Projects: React.FC = () => {
  // state جدید مطابق با ProjectsFilterProps
  const [filters, setFilters] = useState({
    searchText: "",
    minBudget: "",
    maxBudget: "",
    timeFilter: "",
    cities: [] as string[],
    category: "",
  });

  const [ads, setAds] = useState<DigitalAd[]>([]);
  const [filteredAds, setFilteredAds] = useState<DigitalAd[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // بارگذاری آگهی‌ها با فیلترها
  useEffect(() => {
    const loadAds = async () => {
      // تبدیل فیلترها به فرمت API
      const apiFilters = {
        q: filters.searchText || undefined,
        minBudget: filters.minBudget
          ? parseInt(filters.minBudget.replace(/,/g, ""))
          : undefined,
        maxBudget: filters.maxBudget
          ? parseInt(filters.maxBudget.replace(/,/g, ""))
          : undefined,
        timeFilter: filters.timeFilter || undefined,
        city: filters.cities.length ? filters.cities.join(",") : undefined,
        category: filters.category || undefined,
      };

      const data = await fetchDigitalAds(apiFilters);
      // اضافه کردن adType
      const adsWithType = data.map((ad: DigitalAd) => ({
        ...ad,
        adType: "DigitalAd",
      }));
      setAds(adsWithType);
      setFilteredAds(adsWithType);
    };

    loadAds();
  }, [filters]); // هر بار فیلترها تغییر کنند، درخواست جدید می‌زنیم

  return (
    <div className="flex flex-col h-[88vh] md:h-[88vh] overflow-y-hidden">
      {/* نمای دسکتاپ (md به بالا) */}
      <div className="hidden md:flex md:flex-col md:h-full sm:p-[1vh]">
        <TopBar />
        <div className="flex-1 bg-[#F5F5F5] rounded-[16px] p-4 h-full flex flex-row relative mt-[1%]">
          <div className="w-1/4 h-full pl-4">
            <ProjectsFilter filters={filters} setFilters={setFilters} />
          </div>

          <div
            className="w-[3px] h-full"
            style={{
              borderLeft: "3px solid",
              borderImageSource:
                "linear-gradient(180deg, rgba(20, 58, 98, 0) 0%, #143A62 50%, rgba(20, 58, 98, 0) 100%)",
              borderImageSlice: 1,
            }}
          />

          <div className="w-3/4 h-full lg:pr-4">
            <Content ads={filteredAds} onTrackView={trackAdView} />
          </div>
        </div>
      </div>

      {/* نمای موبایل */}
      <div className="flex md:hidden flex-col h-full bg-[#F5F5F5] p-2">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="mb-2 bg-[#143A62] text-white py-2 rounded-xl font-medium shadow-md active:scale-95 transition-transform"
        >
          🔍 فیلترها
        </button>

        <div className="flex-1 min-h-0">
          <Content ads={filteredAds} onTrackView={trackAdView} />
        </div>
      </div>

      {/* مودال فیلترها برای موبایل */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:hidden"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="bg-white w-full rounded-t-2xl max-h-[85vh] overflow-y-auto p-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#143A62]">فیلترها</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 text-2xl"
              >
                ✕
              </button>
            </div>
            <ProjectsFilter filters={filters} setFilters={setFilters} />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-4 bg-[#143A62] text-white py-2 rounded-xl font-medium"
            >
              اعمال فیلترها
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Projects;
