"use client";
import React from "react";
import { useFilters } from "@/context/FiltersContext";

const SearchSkills = () => {
  const { activeTab, filters, setFilters } = useFilters();

  const searchText =
    activeTab === "karjo"
      ? filters.karjo.searchText
      : activeTab === "karfarma"
        ? filters.karfarma.searchText
        : filters.kiosk.searchText;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => {
      if (activeTab === "karjo")
        return { ...prev, karjo: { ...prev.karjo, searchText: value } };
      if (activeTab === "karfarma")
        return { ...prev, karfarma: { ...prev.karfarma, searchText: value } };
      return { ...prev, kiosk: { ...prev.kiosk, searchText: value } };
    });
  };

  return (
    <div className="w-[99%] max-h-[6vh] min-h-[5vh] bg-white rounded-[10px] flex items-center mx-auto relative">
      <input
        type="text"
        placeholder="جستجوی کلمه..."
        value={searchText}
        onChange={handleChange}
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

export default SearchSkills;
