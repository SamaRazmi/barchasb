"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // ✔️ اصلاح برای موبایل + دسکتاپ
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = (scrollTop / docHeight) * 100;

      if (progressRef.current) {
        requestAnimationFrame(() => {
          progressRef.current!.style.width = `${scrolled}%`;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[10000]">
      <div className="h-1 md:h-1 w-full bg-gray-300">
        <div
          ref={progressRef}
          className="h-1 md:h-1 bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: "0%" }}
        ></div>
      </div>
    </div>
  );
}
