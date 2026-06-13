"use client";
import React from "react";
import { useFilters } from "@/context/FiltersContext";
import SearchSkills from "./SearchSkills";
import SectionTypes from "@/components/common/SectionTypes";
import EmployerCategorySelect from "./EmployerCategorySelect";
import CityChoice from "./CityChoice";

export default function Karfarma() {
  const { filters, setFilters } = useFilters();
  const karfarmaFilters = filters.karfarma;

  // تابع کمکی برای تبدیل خروجی SectionTypes (آرایه یا رشته) به رشته
  const getSelectedValue = (val: unknown): string | null => {
    if (Array.isArray(val) && val.length > 0) {
      // آخرین مقدار انتخاب شده (تک انتخابی)
      return val[val.length - 1] as string;
    }
    if (typeof val === "string") return val;
    return null;
  };

  return (
    <div className="w-full bg-[#F5F5F5] h-[95%] md:flex md:flex-col rounded-[10px] gap-2 px-2 py-1">
      <CityChoice
        selectedCities={karfarmaFilters.selectedCities || []}
        onChange={(cities: string[]) =>
          setFilters((prev) => ({
            ...prev,
            karfarma: { ...prev.karfarma, selectedCities: cities },
          }))
        }
      />

      <SearchSkills />

      {/* ========== مدت زمان (تک انتخابی) ========== */}
      <SectionTypes
        title="مدت زمان"
        options={["امروز", "این هفته", "این ماه", "سال اخیر"]}
        selectedOption={karfarmaFilters.selectedTime}
        onSelect={(val) => {
          const selectedTime = getSelectedValue(val);
          setFilters((prev) => ({
            ...prev,
            karfarma: { ...prev.karfarma, selectedTime },
          }));
        }}
      />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      {/* ========== نوع کار (تک انتخابی) ========== */}
      <SectionTypes
        title="نوع کار"
        options={["تمام وقت", "پاره وقت", "دورکاری", "کارآموزی"]}
        variant="square"
        selectedOption={karfarmaFilters.selectedTypeWork}
        onSelect={(val) => {
          const selectedTypeWork = getSelectedValue(val);
          setFilters((prev) => ({
            ...prev,
            karfarma: { ...prev.karfarma, selectedTypeWork },
          }));
        }}
      />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      <EmployerCategorySelect
        initialSelectedIds={karfarmaFilters.selectedCategory || []}
        onChange={(selectedIds, selectedNames) => {
          setFilters((prev) => ({
            ...prev,
            karfarma: { ...prev.karfarma, selectedCategory: selectedIds },
          }));
        }}
      />
    </div>
  );
}
