"use client";

import Image from "next/image";
import { useEffect, useRef, useState, ReactNode } from "react";
import { useField } from "formik";

// ۱. تعریف اینترفیس برای گزینه‌ها
interface Option {
  value: string | number;
  tag: ReactNode;
}

// ۲. تعریف اینترفیس برای پراپ‌های کامپوننت
interface ProfDropdownProps {
  label: string;
  name: string;
  options: Option[];
}

export default function ProfDropdown({
  label,
  name,
  options = [],
}: ProfDropdownProps) {
  // ۳. تایپ‌دهی به useRef (مشخص کردن نوع المنت)
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    // ۴. تایپ‌دهی به رویداد کلیک
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const selectedOption = options.find((e) => e.value === field.value);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-1.5 items-center w-fit"
    >
      <div className="text-[18px] font-bold text-white/90 ">{label} :</div>

      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex gap-25 justify-between items-center w-[220px] py-2.5 pr-3 pl-2 border-2 ${
            isOpen ? "rounded-t-[20px]" : "rounded-[20px]"
          } bg-[white] border-[#ffba52] focus:border-[#ef9a1b] transition-all duration-400 focus:outline-none cursor-pointer`}
        >
          <div
            className={`text-right text-[16px] text-black/75 ${field.value ? "text-slate-900" : "text-slate-400"}`}
          >
            {selectedOption ? selectedOption.tag : "انتخاب کنید"}
          </div>

          <div>
            <Image
              src={"/images/arrowDown.webp"}
              alt="arrowDown"
              height={17}
              width={17}
              className={`opacity-70 ${isOpen ? "rotate-180" : ""} transition duration-400`}
            />
          </div>
        </button>

        <div
          className={`absolute w-full z-20 bg-white rounded-b-[15px] transition-all duration-300 ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {options.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                helpers.setValue(item.value);
                setIsOpen(false);
              }}
              className="w-full first:border-b last:border-t border-black/20 py-0.5 hover:bg-black/5"
            >
              {item.tag}
            </button>
          ))}
        </div>
      </div>

      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">
          {meta.error as ReactNode}
        </div>
      )}
    </div>
  );
}
