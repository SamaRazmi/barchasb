"use client";

import React, { useState, useEffect } from "react";
import { getAdViewSummaryStats } from "@/api/apiAdView";

interface VisitStats {
  today: number;
  total: number;
  weekly: number[];
  monthly: number[];
}

interface VisitStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  adType: string;
}

const getPersianWeekday = (date: Date): string => {
  const weekdays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];
  const day = date.getDay();
  const map: Record<number, number> = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 0,
  };
  return weekdays[map[day]];
};

const getTooltipLabel = (date: Date, views: number): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() === today.getTime()) return `امروز: ${views} بازدید`;
  if (target.getTime() === yesterday.getTime()) return `دیروز: ${views} بازدید`;
  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
  }).format(date);
  return `${getPersianWeekday(date)} ${persianDate}: ${views} بازدید`;
};

const VisitStatsModal: React.FC<VisitStatsModalProps> = ({
  isOpen,
  onClose,
  adId,
  adType,
}) => {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getAdViewSummaryStats(adId, adType)
      .then((data: VisitStats) => setStats(data))
      .catch((err: any) => {
        console.error(err);
        setError("خطا در دریافت آمار");
      })
      .finally(() => setLoading(false));
  }, [isOpen, adId, adType]);

  if (!isOpen) return null;

  let chartData: number[] = [];
  let labels: string[] = [];
  let tooltipDates: Date[] = [];

  if (stats) {
    if (selectedPeriod === "weekly") {
      chartData = [...stats.weekly];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        tooltipDates.push(date);
        labels.push(getPersianWeekday(date));
      }
      chartData.reverse();
      labels.reverse();
      tooltipDates.reverse();
    } else {
      chartData = [...stats.monthly];
      labels = ["هفته اول", "هفته دوم", "هفته سوم", "هفته چهارم"];
      tooltipDates = [];
      chartData.reverse();
      labels.reverse();
    }
  }

  const hasData = stats && chartData.length > 0;
  const maxValue = hasData ? Math.max(...chartData, 1) : 1;

  // ======== تغییر برای تشخیص اعداد کوچک ========
  const useSmallScale = maxValue < 100;
  const MIN_MAX_VIEWS = 100000;
  const effectiveMax = Math.max(maxValue, MIN_MAX_VIEWS);
  // ===========================================

  const renderBars = () => {
    if (!hasData) return null;
    return chartData.map((value, idx) => {
      let barHeight: number;
      if (useSmallScale) {
        // مقیاس کوچک: 0→2px , maxValue→52px
        barHeight = 2 + (value / maxValue) * 50;
        barHeight = Math.min(barHeight, 60);
      } else {
        const heightPercent = (value / effectiveMax) * 100;
        barHeight = Math.max(heightPercent * 1.5, 2);
      }
      barHeight = Math.max(barHeight, 2);

      const tooltipText =
        selectedPeriod === "weekly"
          ? getTooltipLabel(tooltipDates[idx], value)
          : `${labels[idx]}: ${value} بازدید`;

      return (
        <div
          key={idx}
          className="flex flex-col justify-end items-center h-[200px] relative group"
          onMouseEnter={(e) =>
            setTooltip({ label: tooltipText, x: e.clientX, y: e.clientY - 40 })
          }
          onMouseLeave={() => setTooltip(null)}
        >
          <div
            className="rounded-sm shadow bg-[#143A62] transition-all duration-200"
            style={{ height: `${barHeight}px`, width: "30px" }}
          />
          <div className="text-[10px] text-gray-500 mt-2 truncate text-center w-full">
            {labels[idx]}
          </div>
        </div>
      );
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed md:absolute inset-0 flex justify-center items-center backdrop-blur-[10px] z-50 rounded-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl relative flex flex-col overflow-y-auto w-[90%] h-auto max-h-[90vh] md:w-[55%] md:h-[80%] md:max-h-none p-4 md:p-6"
      >
        <div className="absolute top-2 left-2 md:top-4 md:left-4">
          <div
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer text-xl md:text-2xl font-bold"
          >
            ×
          </div>
        </div>
        <h2 className="text-[#143A62] text-[2.5vh] font-bold text-right mb-4">
          آمار بازدید
        </h2>

        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[30vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!loading && error && (
          <div className="flex-1 flex items-center justify-center text-red-500 text-center min-h-[30vh]">
            {error}
          </div>
        )}
        {!loading && !error && stats && (
          <>
            <div className="text-[#143A62] text-[2vh] text-right mb-2">
              تعداد بازدید امروز: {stats.today}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <div className="text-[#143A62] text-[2vh]">
                تعداد بازدید کلی: {stats.total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPeriod("weekly")}
                  className={`px-3 py-1 rounded text-sm ${selectedPeriod === "weekly" ? "bg-blue-900 text-white" : "bg-gray-200"}`}
                >
                  هفتگی
                </button>
                <button
                  onClick={() => setSelectedPeriod("monthly")}
                  className={`px-3 py-1 rounded text-sm ${selectedPeriod === "monthly" ? "bg-blue-900 text-white" : "bg-gray-200"}`}
                >
                  ماهیانه
                </button>
              </div>
            </div>
            {chartData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center min-h-[30vh]">
                <div className="text-5xl mb-2">📊</div>
                <p className="text-lg">آماری برای این دوره وجود ندارد</p>
              </div>
            ) : (
              <div className="flex gap-3 justify-between items-end bg-gray-100 p-4 rounded shadow-md h-[40vh] md:h-[50vh]">
                {renderBars()}
              </div>
            )}
          </>
        )}
        {!loading && !error && !stats && (
          <div className="flex-1 flex items-center justify-center text-gray-400 min-h-[30vh]">
            داده‌ای موجود نیست
          </div>
        )}
        {tooltip && (
          <div
            style={{
              position: "fixed",
              top: tooltip.y,
              left: tooltip.x,
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              pointerEvents: "none",
              zIndex: 60,
              whiteSpace: "nowrap",
            }}
          >
            {tooltip.label}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitStatsModal;
