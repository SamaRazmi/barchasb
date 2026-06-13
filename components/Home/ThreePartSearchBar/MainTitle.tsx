"use client";
import { FC, useEffect, useState, useMemo, useCallback } from "react";

const MainTitle: FC = () => {
  const rotatingTexts = useMemo(
    () => ["برترین کارجویان", "کارفرمای مناسب", "آگهی‌های متنوع"],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);

  const calculateMaxWidth = useCallback(() => {
    const fontSize = window.innerWidth < 768 ? "16px" : "30px";

    const widths = rotatingTexts.map((text) => {
      const el = document.createElement("span");
      el.innerText = text;
      el.style.visibility = "hidden";
      el.style.position = "absolute";
      el.style.fontSize = fontSize;
      el.style.fontWeight = "500";
      el.style.fontFamily = "inherit";
      document.body.appendChild(el);
      const width = el.offsetWidth;
      el.remove();
      return width;
    });

    setMaxWidth(Math.max(...widths));
  }, [rotatingTexts]);

  useEffect(() => {
    calculateMaxWidth();
    window.addEventListener("resize", calculateMaxWidth);
    return () => window.removeEventListener("resize", calculateMaxWidth);
  }, [calculateMaxWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [rotatingTexts]);

  if (maxWidth === null) return null;

  return (
    <div className="flex justify-center mt-[6%] mb-[2%]">
      <h1 className="text-center flex items-center gap-2 md:gap-3">
        <span className="font-medium text-[16px] md:text-[20px] text-[#000000]">
          جستجوی
        </span>

        <span
          className="inline-flex justify-center transition-all duration-500 font-medium text-[16px] md:text-[25px] text-[#143A62] whitespace-nowrap"
          style={{
            width: `${maxWidth}px`,
            minWidth: `${maxWidth}px`,
          }}
        >
          {rotatingTexts[currentIndex]}
        </span>

        <span className="font-medium text-[16px] md:text-[20px] text-[#000000]">
          فقط در
        </span>
        <span className="font-semibold text-[36px] md:text-[50px] text-[#143A62] inline-block translate-y-[-6px] md:translate-y-[-12px]">
          برچسب
        </span>
      </h1>
    </div>
  );
};

export default MainTitle;
