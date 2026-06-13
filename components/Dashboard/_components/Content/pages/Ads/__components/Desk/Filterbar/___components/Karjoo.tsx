"use client";
import React from "react";
import { useFilters } from "@/context/FiltersContext";
import SectionTypes from "@/components/common/SectionTypes";
import CityChoice from "./CityChoice";
import JobSeekerCategorySelect from "./JobSeekerCategorySelect";
import SearchSkills from "./SearchSkills";
import AgeRange from "./AgeRange";

export default function Karjoo() {
  const { filters, setFilters } = useFilters();
  const karjoFilters = filters.karjo;

  return (
    <div className="w-full bg-[#F5F5F5] h-[95%] rounded-[10px] gap-[2vh] px-2 py-1">
      <CityChoice
        selectedCities={karjoFilters.selectedCities}
        onChange={(cities: string[]) =>
          setFilters((prev) => ({
            ...prev,
            karjo: { ...prev.karjo, selectedCities: cities },
          }))
        }
      />

      <SearchSkills />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      <SectionTypes
        title="نمونه کار"
        options={["بله", "خیر"]}
        variant="circle"
        selectedOption={karjoFilters.selectedPortfolio}
        onSelect={(val) =>
          setFilters((prev) => ({
            ...prev,
            karjo: {
              ...prev.karjo,
              selectedPortfolio: typeof val === "string" ? val : null,
            },
          }))
        }
      />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      <SectionTypes
        title="جنسیت"
        options={["زن", "مرد"]}
        variant="circle"
        selectedOption={karjoFilters.selectedGender}
        onSelect={(val) =>
          setFilters((prev) => ({
            ...prev,
            karjo: {
              ...prev.karjo,
              selectedGender: typeof val === "string" ? val : null,
            },
          }))
        }
      />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      <AgeRange
        title="محدوده سنی"
        minValue={karjoFilters.minAge}
        maxValue={karjoFilters.maxAge}
        onChange={(min, max) => {
          setFilters((prev) => ({
            ...prev,
            karjo: {
              ...prev.karjo,
              minAge: min,
              maxAge: max,
            },
          }));
        }}
      />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      <JobSeekerCategorySelect
        initialSelectedIds={karjoFilters.selectedCategory || []}
        onChange={(selectedValues) =>
          setFilters((prev) => ({
            ...prev,
            karjo: { ...prev.karjo, selectedCategory: selectedValues },
          }))
        }
      />
    </div>
  );
}
