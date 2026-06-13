import React, { useState, useEffect, useCallback, useRef } from "react";
import { getUserViewStats } from "@/api/apiAdView";
import { useFilters } from "@/context/FiltersContext";

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

const getPersianMonth = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("fa-IR", { month: "long" });
  return formatter.format(date);
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

const BarChart: React.FC = () => {
  const { activeTab } = useFilters();
  const [data, setData] = useState<{ label: string; views: number }[]>([]);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  const getAdTypeFromTab = useCallback(() => {
    if (activeTab === "karjo") return "JobSeekerAd";
    if (activeTab === "karfarma") return "EmployerAd";
    if (activeTab === "agahi") return "SellerAd";
    return "all";
  }, [activeTab]);

  const reorderWeeklyData = (
    input: { label: string; views: number }[],
  ): { label: string; views: number }[] => {
    if (input.length !== 7) return input;
    const today = new Date();
    const todayName = getPersianWeekday(today);
    const indexToday = input.findIndex((item) => item.label === todayName);
    if (indexToday === -1) return input;
    const fromTodayToEnd = input.slice(indexToday);
    const fromStartToYesterday = input.slice(0, indexToday);
    return [...fromTodayToEnd, ...fromStartToYesterday.reverse()];
  };

  const aggregateMonthlyData = (
    dailyData: { label: string; views: number }[],
  ): { label: string; views: number }[] => {
    if (!dailyData.length) return [];
    const monthlyMap = new Map<string, number>();
    for (const item of dailyData) {
      const month = getPersianMonth(item.label);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + item.views);
    }
    const monthsInOrder: string[] = [];
    for (const item of dailyData) {
      const month = getPersianMonth(item.label);
      if (!monthsInOrder.includes(month)) monthsInOrder.push(month);
    }
    const last5Months = monthsInOrder.slice(-5).reverse();
    return last5Months.map((month) => ({
      label: month,
      views: monthlyMap.get(month) || 0,
    }));
  };

  const fetchStats = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const adType = getAdTypeFromTab();
      const result = await getUserViewStats(period, adType);
      if (!mounted.current) return;
      if (!Array.isArray(result)) throw new Error("نوع داده نامعتبر");
      let processedData = result;
      if (period === "weekly") processedData = reorderWeeklyData(result);
      else processedData = aggregateMonthlyData(result);
      setData(processedData);
    } catch (err: any) {
      if (!mounted.current || err.name === "AbortError") return;
      console.error("خطا در دریافت آمار:", err);
      setError(
        err.message?.includes("Unauthorized")
          ? "لطفاً دوباره وارد شوید"
          : "خطا در دریافت آمار",
      );
      setData([]);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [period, getAdTypeFromTab]);

  useEffect(() => {
    mounted.current = true;
    fetchStats();
    return () => {
      mounted.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchStats]);

  const hasNoAds = !loading && !error && data.length === 0;
  const maxViews = data.length
    ? Math.max(...data.map((item) => item.views))
    : 1;

  // ======== تغییر برای تشخیص اعداد کوچک (0,1,2) ========
  const useSmallScale = maxViews < 100;
  const MIN_MAX_VIEWS = 100000;
  const effectiveMax = Math.max(maxViews, MIN_MAX_VIEWS);
  // ===================================================

  return (
    <div className="w-full h-[95%] bg-white rounded-[20px] flex flex-col px-6 pt-4 pb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[#143A62] font-semibold text-xl text-right">
          آمار و گزارش‌ها
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1 rounded-md text-sm transition ${period === "weekly" ? "bg-[#143A62] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            هفتگی
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 rounded-md text-sm transition ${period === "monthly" ? "bg-[#143A62] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            ماهانه
          </button>
        </div>
      </div>
      <div className="text-[12px] text-gray-400 mb-4 text-right">
        {period === "weekly"
          ? "بازدید روزانه در ۷ روز گذشته"
          : "جمع بازدید ماهانه (۵ ماه اخیر)"}
      </div>
      <div
        className="w-full h-[2px] mb-6"
        style={{
          borderBottom: "2px solid",
          borderImageSource:
            "linear-gradient(90deg, rgba(20, 58, 98, 0.05) 0%, rgba(20, 58, 98, 0.25) 50%, rgba(20, 58, 98, 0.5) 100%)",
          borderImageSlice: 1,
        }}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 text-center">
          {error}
        </div>
      ) : hasNoAds ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
          <div className="text-5xl mb-2">📭</div>
          <p className="text-lg">آگهی موجود نیست</p>
          <p className="text-sm mt-1">هیچ آگهی توسط شما ثبت نشده است</p>
        </div>
      ) : (
        <div className="flex-1 flex items-end justify-between gap-2 pt-4">
          {data.map((item, idx) => {
            let barHeight: number;
            if (useSmallScale) {
              // مقیاس کوچک: 0→2px , maxViews→52px
              barHeight = 2 + (item.views / maxViews) * 50;
              barHeight = Math.min(barHeight, 60);
            } else {
              const heightPercent = (item.views / effectiveMax) * 100;
              barHeight = Math.max(heightPercent * 1.5, 2);
            }
            barHeight = Math.max(barHeight, 2);

            let tooltipText = "";
            if (period === "weekly") {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const date = new Date(today);
              date.setDate(today.getDate() - idx);
              tooltipText = getTooltipLabel(date, item.views);
            } else {
              tooltipText = `${item.label}: ${item.views} بازدید`;
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center w-full min-w-0 group relative"
                onMouseEnter={(e) =>
                  setTooltip({
                    label: tooltipText,
                    x: e.clientX,
                    y: e.clientY - 40,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              >
                <div
                  className="bg-[#143A62] rounded-t-md w-full max-w-[40px] transition-all duration-300"
                  style={{ height: `${barHeight}px`, minHeight: "2px" }}
                />
                <div className="text-[10px] text-gray-500 mt-2 truncate text-center w-full">
                  {item.label}
                </div>
              </div>
            );
          })}
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
  );
};

export default BarChart;
