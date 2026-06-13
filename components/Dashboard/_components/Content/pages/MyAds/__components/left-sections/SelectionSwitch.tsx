"use client";

import { useState } from "react";

interface SelectionSwitchProps {
  active: "employer" | "seeker" | "seller";
  onChange: (type: "employer" | "seeker" | "seller") => void;
}

const SelectionSwitch = ({ active, onChange }: SelectionSwitchProps) => {
  const tabs = [
    { key: "employer", label: "کارفرما" },
    { key: "seeker", label: "کارجو" },
    { key: "seller", label: "آگهی" },
  ];

  const positionMap = {
    employer: "top-[28px] sm:top-[28px] md:top-[28px]",
    seeker: "top-1/2 -translate-y-1/2",
    seller: "bottom-[28px]",
  };

  return (
    <>
      {/* دسکتاپ / md به بالا */}
      <div className="hidden md:flex md:flex-col relative w-[110px] h-[240px] bg-[#143A62] rounded-[40px]">
        {/* highlight خاکستری */}
        <div
          className={`absolute left-0 w-[100px] h-[56px] 
            bg-[#F5F5F5] rounded-r-[30px]
            transition-all duration-300
            ${positionMap[active]}
            flex items-center px-6
          `}
        >
          {active && (
            <span className="text-[#143A62] text-[2.4vh]">
              {active === "employer"
                ? "کارفرما"
                : active === "seeker"
                  ? "کارجو"
                  : "آگهی"}
            </span>
          )}
        </div>

        {/* دکمه‌ها */}
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              onChange(tab.key as "employer" | "seeker" | "seller")
            }
            className={`absolute ${
              tab.key === "employer"
                ? "top-[28px]"
                : tab.key === "seeker"
                  ? "top-1/2 -translate-y-1/2"
                  : "bottom-[28px]"
            } right-0 w-[100px] h-[56px] z-10`}
          >
            <span
              className={`${
                active === tab.key
                  ? "text-transparent"
                  : "text-white text-[2.2vh]"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* موبایل / sm پایین */}
      <div className="md:hidden w-[90%] flex items-center justify-between gap-1 mt-0 mx-auto">
        <div className="flex bg-white rounded-xl shadow-md w-full px-0 gap-1">
          {tabs.map((tab) => {
            const isSelected = tab.key === active;
            return (
              <div
                key={tab.key}
                onClick={() =>
                  onChange(tab.key as "employer" | "seeker" | "seller")
                }
                className="flex-1 cursor-pointer"
              >
                {isSelected ? (
                  <div className="rounded-xl bg-[#143A62] flex items-center justify-center py-[6px]">
                    <span className="text-[14px] text-white">{tab.label}</span>
                  </div>
                ) : (
                  <div className="rounded-xl flex items-center justify-center py-[10px]">
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
    </>
  );
};

export default SelectionSwitch;
