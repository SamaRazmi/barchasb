"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useField } from "formik";

// تعریف ساختار گزینه‌های dropdown
interface Option {
  value: string | number;
  tag: React.ReactNode; // چون در کامپوننت از آن به عنوان محتوا استفاده شده
}

interface ProfDropdownProps {
  lable: string;
  name: string;
  options?: Option[];
}

export default function ProfDropdown({
  lable,
  name,
  options = [],
}: ProfDropdownProps) {
  // مشخص کردن نوع برای useRef (باید المان HTML مربوطه را مشخص کنیم)
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    // تایپ رویداد برای event (MouseEvent برای mousedown)
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
    <div ref={ref} className="relative flex flex-col gap-1.5 w-full">
      <label className="text-[20px] font-bold text-[#2D3E48]">{lable} :</label>

      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex justify-between items-center w-full px-5 py-3 border-2 ${
            isOpen ? "rounded-t-[20px]" : "rounded-[20px]"
          } 
        ${meta.touched && meta.error ? "border-red-500" : "border-[#FEBD59]/80"}
 focus:border-[#ef9a1b] transition-all duration-400 focus:outline-none cursor-pointer`}
        >
          <div
            className={`text-right ${field.value ? "text-slate-900" : "text-slate-400"}`}
          >
            {selectedOption ? (
              selectedOption.tag
            ) : (
              <div className="text-[18px] text-black/75">انتخاب کنید</div>
            )}
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
          className={`absolute w-full z-20 bg-white border border-t-0 border-black/20 rounded-b-[15px] transition-all duration-300 ${
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
              className="w-full border border-b-0 border-l-0 border-r-0 border-black/20 py-0.5 hover:bg-black/3"
            >
              {item.tag}
            </button>
          ))}
        </div>
      </div>

      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error as string}</div>
      )}
    </div>
  );
}
