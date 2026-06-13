// components/ProjectsFilter.tsx
"use client";
import React from "react";
import SectionTypes from "@/components/common/SectionTypes";
import PriceRange from "../../../Ads/__components/Desk/Filterbar/___components/PriceRange";
// import CityChoice from "../../../Ads/__components/Desk/Filterbar/___components/CityChoice"; // کامنت شده - غیرفعال

// کامپوننت جستجو
const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="w-[99%] max-h-[6vh] min-h-[5vh] bg-white rounded-[10px] flex items-center mx-auto relative">
      <input
        type="text"
        placeholder="جستجو در عنوان و توضیحات..."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[#143A62] font-medium text-[15px] pr-10 pl-10 rounded-[6px] opacity-50 outline-none bg-transparent"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <img
          src="/images/search_skills_icon.svg"
          alt="search icon"
          className="object-contain w-5 h-5"
        />
      </div>
    </div>
  );
};

interface ProjectsFilterProps {
  filters: {
    searchText: string;
    minBudget: string;
    maxBudget: string;
    timeFilter: string;
    cities: string[]; // این فیلد همچنان در type وجود دارد اما در UI غیرفعال است
    category: string; // این فیلد نیز غیرفعال است
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  filters,
  setFilters,
}) => {
  // بازه بودجه
  const handleBudgetChange = (min: string, max: string) => {
    setFilters((prev: any) => ({ ...prev, minBudget: min, maxBudget: max }));
  };

  // فیلتر زمانی
  const timeOptions = ["امروز", "این هفته", "این ماه", "سال اخیر"];
  const timeMap: Record<string, string> = {
    امروز: "today",
    "این هفته": "thisWeek",
    "این ماه": "thisMonth",
    "سال اخیر": "thisYear",
  };
  const handleTimeSelect = (selected: string | string[]) => {
    const persian = Array.isArray(selected) ? selected[0] : selected;
    const mapped = timeMap[persian] || "";
    setFilters((prev: any) => ({ ...prev, timeFilter: mapped }));
  };

  // ========== کدهای غیرفعال شده (شهر و دسته‌بندی) ==========
  /*
  // دسته‌بندی (square)
  const categoryOptions = ["طراحی سایت", "سئو", "تبلیغات", "تولید محتوا"];
  const handleCategorySelect = (selected: string | string[]) => {
    const categories = Array.isArray(selected) ? selected : [selected];
    setFilters((prev: any) => ({ ...prev, category: categories.join(",") }));
  };

  // مدیریت شهر
  const handleCityChange = (cities: string[]) => {
    setFilters((prev: any) => ({ ...prev, cities }));
  };
  */
  // =======================================================

  return (
    <div className="w-full h-full">
      {/* جستجو */}
      <SearchInput
        value={filters.searchText}
        onChange={(val) =>
          setFilters((prev: any) => ({ ...prev, searchText: val }))
        }
      />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent" />

      {/* بازه بودجه */}
      <PriceRange
        title="بازه بودجه (تومان)"
        minValue={filters.minBudget}
        maxValue={filters.maxBudget}
        onChange={handleBudgetChange}
      />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent" />

      {/* فیلتر زمانی */}
      <SectionTypes
        title="زمان انتشار"
        options={timeOptions}
        variant="circle"
        onSelect={handleTimeSelect}
      />

      {/* ========== بخش‌های غیرفعال شده در UI (شهر و دسته‌بندی) ========== */}
      {/*
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent" />

      <CityChoice
        selectedCities={filters.cities || []}
        onChange={handleCityChange}
      />

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent mt-3" />

      <SectionTypes
        title="دسته‌بندی"
        options={categoryOptions}
        variant="square"
        onSelect={handleCategorySelect}
      />
      */}
      {/* ======================================================== */}
    </div>
  );
};

export default ProjectsFilter;
