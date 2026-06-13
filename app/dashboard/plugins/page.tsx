"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function ProjectsPage() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="plugins" />
      <ResDashboard initialTab="plugins" />
    </div>
  );
}
 