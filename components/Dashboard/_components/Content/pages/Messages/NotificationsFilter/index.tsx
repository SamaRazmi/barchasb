"use client";
import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationsContext";
import Notifications from "./Notifications";
import Settings from "./Settings";

type OptionKey = "notifications" | "settings";

const options: { key: OptionKey; label: string }[] = [
  { key: "settings", label: "تنظیمات" },
  { key: "notifications", label: "اعلان‌ها" },
];

export default function NotificationsFilter() {
  const { activeTab, setActiveTab } = useNotifications();
  const [showFilters, setShowFilters] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const handleSelect = (k: OptionKey) => {
    setActiveTab(k);
    setShowFilters(false);
  };

  // حرکت با موس
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTab !== "notifications") return;
    setDragStart(e.clientY);
    const handleMouseMove = (ev: MouseEvent) => {
      if (containerRef.current && dragStart !== null) {
        containerRef.current.scrollTop += dragStart - ev.clientY;
        setDragStart(ev.clientY);
      }
    };
    const handleMouseUp = () => {
      setDragStart(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // حرکت با تاچ
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTab !== "notifications") return;
    setDragStart(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (activeTab !== "notifications") return;
    if (containerRef.current && dragStart !== null) {
      containerRef.current.scrollTop += dragStart - e.touches[0].clientY;
      setDragStart(e.touches[0].clientY);
    }
  };

  // ========== اضافه شدن اسکرول با چرخ ماوس ==========
  const handleWheel = (e: React.WheelEvent) => {
    if (activeTab !== "notifications") return;
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY;
    }
  };

  // ========== اضافه شدن اسکرول با صفحه کلید ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "notifications") return;
      if (!containerRef.current) return;

      const scrollAmount = 100;
      const pageScrollAmount = containerRef.current.clientHeight;

      switch (e.key) {
        case "ArrowDown":
          containerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          containerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          containerRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          containerRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ================= DESKTOP ================= */}
      <div className="hidden sm:block w-[90%] lg:w-[40%] mt-[5vh]">
        <div className="w-[99%] flex items-center justify-between bg-white shadow-[0px_0px_4px_0px_#0000001A] rounded-[10px]">
          {options.map((opt) => {
            const isSelected = opt.key === activeTab;
            return (
              <div
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className="flex-1 cursor-pointer"
              >
                {isSelected ? (
                  <div className="w-full rounded-[10px] py-2 flex items-center justify-center bg-[#143A62]">
                    <span className="text-[1.6vh] lg:text-[2.2vh] text-white">
                      {opt.label}
                    </span>
                  </div>
                ) : (
                  <div className="w-full rounded-[10px] flex items-center justify-center bg-white">
                    <span className="text-[1.6vh] lg:text-[2.2vh] text-[#143A62]">
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
      <div className="sm:hidden w-[90%] flex items-center justify-between gap-1 mt-3">
        <div className="flex w-[80%] gap-1 rounded-xl shadow-md bg-white px-2 py-2">
          {options.map((opt) => {
            const isSelected = opt.key === activeTab;
            return (
              <div
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                className="flex-1 cursor-pointer"
              >
                {isSelected ? (
                  <div className="rounded-xl py-[6px] flex items-center justify-center bg-[#143A62]">
                    <span className="text-[14px] text-white">{opt.label}</span>
                  </div>
                ) : (
                  <div className="rounded-xl py-[6px] flex items-center justify-center bg-white">
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
          className="w-[20%] h-[45px] flex items-center justify-center cursor-pointer rounded-xl shadow-md border border-gray-300 bg-white"
        >
          <img
            src="/images/filter_res.svg"
            alt="filter"
            className="w-[22px] h-[22px] object-contain"
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div
        ref={containerRef}
        className="h-[55vh] w-full overflow-y-auto rounded-[10px] p-4"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        style={{
          scrollbarWidth: "none", // Firefox
        }}
      >
        {activeTab === "notifications" && <Notifications />}
        {activeTab === "settings" && <Settings />}
      </div>

      {/* ================= MOBILE FILTER ================= */}
      {showFilters && (
        <div className="sm:hidden w-full mt-4">
          {activeTab === "notifications" && (
            <div
              className="h-[70vh] w-full overflow-y-auto rounded-[10px] bg-[#F5F5F5] p-4"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onWheel={handleWheel}
              style={{ scrollbarWidth: "none" }}
            >
              <Notifications />
            </div>
          )}
          {activeTab === "settings" && <Settings />}
        </div>
      )}
    </div>
  );
}
