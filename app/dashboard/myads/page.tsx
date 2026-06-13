"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function MyAdsPage() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="myads" />
      <ResDashboard initialTab="myads" />
    </div>
  );
}
