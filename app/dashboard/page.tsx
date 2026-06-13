"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function DashboardPage() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="home" />
      <ResDashboard initialTab="home" />
    </div>
  );
}
