"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function supportAdminOptionsPage() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="adminOptions" />
      <ResDashboard initialTab="adminOptions" />
    </div>
  );
}
