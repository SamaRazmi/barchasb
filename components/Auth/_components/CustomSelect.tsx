"use client";

import React from "react";
import Image from "next/image";

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  options: Option[];
  placeholder: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string;
  smWidth?: string;
  mdWidth?: string;
  className?: string;
  name?: string;
  error?: string;
  touched?: boolean;
  icon?: string; // برای آیکن سمت چپ (اختیاری)
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  value,
  onChange,
  width,
  smWidth,
  mdWidth,
  className = "",
  name,
  error,
  touched,
  icon,
}) => {
  const hasError = touched && error;

  const widthClasses = `
    ${width ? `w-[${width}]` : "w-[90%]"}
    ${smWidth ? `sm:w-[${smWidth}]` : ""}
    ${mdWidth ? `md:w-[${mdWidth}]` : ""}
  `;

  return (
    <div
      className={`
        ${widthClasses}
        h-[56px]
        flex items-center
        border ${hasError ? "border-red-500" : "border-gray-300"}
        rounded-[15px] sm:rounded-[20px]
        px-4
        bg-white
        box-border
        overflow-hidden
        sm:h-[58px]
        relative
        ${className}
      `}
    >
      {/* آیکن سمت چپ در صورت وجود */}
      {icon && (
        <div className="flex-none">
          <Image
            src={icon}
            alt="icon"
            width={22}
            height={22}
            className={`sm:w-[24px] sm:h-[24px] ${
              hasError ? "opacity-55" : ""
            }`}
          />
        </div>
      )}

      {/* select */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
    flex-1 h-full text-right font-medium
    bg-white pr-3 pl-0 border-none outline-none appearance-none
    text-black
  `}
        style={{ color: value ? "black" : "#9ca3af" }} 
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, idx) => (
          <option
            key={idx}
            value={opt.value}
            style={{ color: "black", borderColor: "" }}
          >
            {opt.label}
          </option>
        ))}
      </select>

      {/* فلش سمت راست */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-gray-500"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* نمایش خطا در پایین */}
      {hasError && (
        <span className="absolute left-0 bottom-[-20px] text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  );
};

export default CustomSelect;
