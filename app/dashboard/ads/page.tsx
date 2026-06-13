"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/context/FiltersContext";
import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function AdsPage() {
  const searchParams = useSearchParams();
  const { setActiveTab, updateFiltersFromQuery } = useFilters();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const q = searchParams.get("q") || "";
    const state = searchParams.get("state") || "";
    const type = searchParams.get("type") || "";
    const activeTabParam = searchParams.get("activeTab"); // ← خواندن activeTab از URL

    let activeTab: "karjo" | "karfarma" | "agahi" = "agahi"; // پیش‌فرض آگهی

    // اولویت 1: activeTab در URL
    if (activeTabParam === "karjo") {
      activeTab = "karjo";
    } else if (activeTabParam === "karfarma") {
      activeTab = "karfarma";
    } else if (activeTabParam === "agahi") {
      activeTab = "agahi";
    }
    // اولویت 2: پارامتر type (برای سازگاری با لینک‌های قدیمی)
    else if (type === "job_seeker") {
      activeTab = "karjo";
    } else if (type === "employer") {
      activeTab = "karfarma";
    } else if (type === "seller" || type === "digital") {
      activeTab = "agahi";
    }
    // در غیر این صورت همان agahi می‌ماند

    setActiveTab(activeTab);
    updateFiltersFromQuery(activeTab, { q, state });
  }, [searchParams, setActiveTab, updateFiltersFromQuery]);

  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="ads" />
      <ResDashboard initialTab="ads" />
    </div>
  );
}
