"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function ProjectsPage() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="projects" />
      <ResDashboard initialTab="projects" />
    </div>
  );
}
 