"use client";
import React, { useState, useEffect } from "react";

interface AgeRangeProps {
  title: string;
  minValue?: number | string;
  maxValue?: number | string;
  onChange?: (min: string, max: string) => void;
}

export default function AgeRange({
  title,
  minValue = "",
  maxValue = "",
  onChange,
}: AgeRangeProps) {
  const [minAge, setMinAge] = useState<string>(
    minValue !== undefined ? String(minValue) : "",
  );
  const [maxAge, setMaxAge] = useState<string>(
    maxValue !== undefined ? String(maxValue) : "",
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMinAge(minValue !== undefined ? String(minValue) : "");
  }, [minValue]);

  useEffect(() => {
    setMaxAge(maxValue !== undefined ? String(maxValue) : "");
  }, [maxValue]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    setMinAge(numeric);
    onChange && onChange(numeric, maxAge);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    setMaxAge(numeric);
    onChange && onChange(minAge, numeric);
  };

  return (
    <div className="w-[99%] mx-auto bg-[#F5F5F5] rounded-2xl px-2 py-2 mt-[0.2vh] transition-all duration-300 overflow-hidden">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-[2.2vh] font-semibold text-[#143A62]">{title}</h2>
        <div
          className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
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
      {open && (
        <div className="mt-[1vh] flex items-center relative gap-0">
          <div className="flex-1 bg-[#FFFFFFF2] rounded-[20px] px-[1.8vh] py-[0.8vh] flex items-center">
            <input
              type="text"
              inputMode="numeric"
              placeholder="سن از"
              value={minAge}
              onChange={handleMinChange}
              className="w-full bg-transparent text-[2vh] font-semibold text-[#000000] text-opacity-30 placeholder-[2vh] placeholder-[#000000] placeholder-opacity-30 outline-none"
            />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-[18px] bg-[#FFFFFFF2]" />
            <span className="absolute -top-4 text-[10px] font-medium text-[#000000] text-opacity-30">
              سال
            </span>
          </div>
          <div className="flex-1 bg-[#FFFFFFF2] rounded-[20px] px-[1.8vh] py-[0.8vh] flex items-center">
            <input
              type="text"
              inputMode="numeric"
              placeholder="سن تا"
              value={maxAge}
              onChange={handleMaxChange}
              className="w-full bg-transparent text-[2vh] font-semibold text-[#000000] text-opacity-30 placeholder-[2vh] placeholder-[#000000] placeholder-opacity-30 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
