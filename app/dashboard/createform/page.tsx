"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function CreateForm() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="createpostform" />
      <ResDashboard initialTab="createpostform" />
    </div>
  );
}
