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

    let activeTab: "karjo" | "karfarma" | "agahi" = "agahi";
    if (type === "job_seeker") activeTab = "karjo";
    else if (type === "employer") activeTab = "karfarma";
    else if (type === "seller" || type === "digital") activeTab = "agahi";

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
