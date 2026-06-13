"use client";
import React, { useState, useEffect } from "react";
import Karfarma from "./Karfarma";
import Karjoo from "./Karjoo";
import Kiosk from "./Kiosk";
import { useFilters } from "@/context/FiltersContext";

type OptionKey = "karjo" | "karfarma" | "agahi";

const options: { key: OptionKey; label: string }[] = [
  { key: "karjo", label: "کارجو" },
  { key: "karfarma", label: "کارفرما" },
  { key: "agahi", label: "آگهی" },
];

export default function SwitchSkills() {
  const { activeTab, setActiveTab } = useFilters();
  const [showFilters, setShowFilters] = useState(false);

  // 🔍 هر بار activeTab واقعاً تغییر کند
  useEffect(() => {
    console.log("📌 SwitchSkills render → activeTab:", activeTab);
  }, [activeTab]);

  function handleSelect(k: OptionKey) {
    console.log("👉 click tab:", k);
    setActiveTab(k);
    setShowFilters(false);
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-gray-200 w-[104%] pr-1 py-1 rounded-t-[10px]">
        <div className="w-[99%] bg-[#E6E7E8] shadow-[0px_0px_4px_0px_#0000001A] rounded-[10px] flex items-center justify-between">
          {options.map((opt) => {
            const isSelected = opt.key === activeTab;
            return (
              <div
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className="flex-1 cursor-pointer px-1"
              >
                {isSelected ? (
                  <div className="w-full rounded-[10px] py-2 px-5 flex items-center justify-center bg-[#143A62]">
                    <span className="[1.2vh] md:text-[2vh] text-white">
                      {opt.label}
                    </span>
                  </div>
                ) : (
                  <div className="w-full rounded-[10px] flex items-center justify-center">
                    <span className="[1.2vh] md:text-[2vh] text-[#143A62]">
                      {opt.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden w-[90%] flex items-center justify-between gap-1 mt-3">
        <div className="flex bg-white rounded-xl shadow-md w-[80%] gap-1">
          {options.map((opt) => {
            const isSelected = opt.key === activeTab;
            return (
              <div
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className="flex-1 cursor-pointer"
              >
                {isSelected ? (
                  <div className="rounded-xl bg-[#143A62] flex items-center justify-center py-[6px]">
                    <span className="text-[14px] text-white">{opt.label}</span>
                  </div>
                ) : (
                  <div className="rounded-xl flex items-center justify-center py-[6px]">
                    <span className="text-[14px] text-[#143A62]">
                      {opt.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white w-[20%] h-[45px] shadow-md border border-gray-300 rounded-xl flex items-center justify-center cursor-pointer"
        >
          <img
            src="/images/filter_res.svg"
            alt="filter"
            className="w-[22px] h-[22px] object-contain"
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="hidden sm:block w-full mt-3">
        {activeTab === "karjo" && <Karjoo />}
        {activeTab === "karfarma" && <Karfarma />}
        {activeTab === "agahi" && <Kiosk />}
      </div>

      {showFilters && (
        <div className="sm:hidden w-full mt-4">
          {activeTab === "karjo" && <Karjoo />}
          {activeTab === "karfarma" && <Karfarma />}
          {activeTab === "agahi" && <Kiosk />}
        </div>
      )}
    </div>
  );
}
