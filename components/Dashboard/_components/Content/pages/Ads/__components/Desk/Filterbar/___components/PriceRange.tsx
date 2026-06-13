"use client";
import React, { useState, useEffect } from "react";

interface PriceRangeProps {
  title: string;
  minValue?: string;
  maxValue?: string;
  onChange?: (min: string, max: string) => void;
}

export default function PriceRange({
  title,
  minValue = "",
  maxValue = "",
  onChange,
}: PriceRangeProps) {
  const [minPrice, setMinPrice] = useState(minValue);
  const [maxPrice, setMaxPrice] = useState(maxValue);
  const [open, setOpen] = useState(false);

  useEffect(() => setMinPrice(minValue), [minValue]);
  useEffect(() => setMaxPrice(maxValue), [maxValue]);

  // تابع فرمت کردن عدد سه‌رقمی
  const formatNumber = (value: string) => {
    // فقط اعداد را نگه می‌دارد
    const numericValue = value.replace(/\D/g, "");
    // جدا کردن سه‌رقمی
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setMinPrice(formatted);
    onChange && onChange(formatted, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setMaxPrice(formatted);
    onChange && onChange(minPrice, formatted);
  };

  return (
    <div className="w-[99%] mx-auto bg-[#F5F5F5] rounded-2xl px-2 py-2 mt-[0.2vh] transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-[2.2vh] font-semibold text-[#143A62]">{title}</h2>
        <div
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            width="7"
            height="3"
            viewBox="0 0 7 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 0.5L3.5 2.5L6.5 0.5"
              stroke="#143A62"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      {open && (
        <div className="mt-[1vh] flex items-center relative gap-0">
          {/* Min Price */}
          <div className="flex-1 bg-[#FFFFFFF2] rounded-[20px] px-[1.8vh] py-[0.8vh] flex items-center">
            <input
              type="text"
              placeholder="بودجه از"
              value={minPrice}
              onChange={handleMinChange}
              className="w-full bg-transparent text-[2vh] font-semibold text-[#000000] text-opacity-30 placeholder-[2vh] placeholder-[#000000] placeholder-opacity-30 outline-none"
            />
          </div>

          {/* Connector */}
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-[18px] bg-[#FFFFFFF2]" />
            <span className="absolute -top-4 text-[10px] font-medium text-[#000000] text-opacity-30">
              تومان
            </span>
          </div>

          {/* Max Price */}
          <div className="flex-1 bg-[#FFFFFFF2] rounded-[20px] px-[1.8vh] py-[0.8vh] flex items-center">
            <input
              type="text"
              placeholder="بودجه تا"
              value={maxPrice}
              onChange={handleMaxChange}
              className="w-full bg-transparent text-[2vh] font-semibold text-[#000000] text-opacity-30 placeholder-[2vh] placeholder-[#000000] placeholder-opacity-30 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
