"use client";
import React from "react";
import { useFilters } from "@/context/FiltersContext";
import SearchSkills from "./SearchSkills";
import SectionTypes from "@/components/common/SectionTypes";
import SkillsAdd from "./SkillsAdd";
import PriceRange from "./PriceRange";
import CityChoice from "./CityChoice";
import CategorySelect from "./CategorySelect";

export default function Kiosk() {
  const { filters, setFilters } = useFilters();
  const kioskFilters = filters.kiosk;

  return (
    <div className="w-full bg-[#F5F5F5] h-[95%] md:flex md:flex-col rounded-[10px] gap-[0.5vh] px-2 py-[0.5vh]">
      <CityChoice
        selectedCities={kioskFilters.selectedCities}
        onChange={(cities) =>
          setFilters((prev) => ({
            ...prev,
            kiosk: { ...prev.kiosk, selectedCities: cities },
          }))
        }
      />
      <SearchSkills />

      <PriceRange
        title="قیمت"
        minValue={kioskFilters.selectedPrice.min}
        maxValue={kioskFilters.selectedPrice.max}
        onChange={(min, max) =>
          setFilters((prev) => ({
            ...prev,
            kiosk: { ...prev.kiosk, selectedPrice: { min, max } },
          }))
        }
      />
      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>

      {/* دایره → تک انتخابی */}
      <SectionTypes
        title="مدت زمان"
        options={["امروز", "این هفته", "این ماه", "سال اخیر"]}
        selectedOption={kioskFilters.selectedTime}
        onSelect={(val) =>
          setFilters((prev) => ({
            ...prev,
            kiosk: {
              ...prev.kiosk,
              selectedTime: typeof val === "string" ? val : null,
            },
          }))
        }
      />
      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>
      <CategorySelect />

      <div className="w-full h-[0.2vh] bg-gradient-to-r from-transparent via-[#143A62]/80 to-transparent"></div>
    </div>
  );
}
