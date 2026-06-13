"use client";

import React from "react";
import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";
import AdDetailsComponent from "@/components/Dashboard/_components/Content/pages/Ads/[id]/AdDetailsComponent";

const ProjectDetailsPage: React.FC = () => {
  return (
    <div className="flex w-full h-[100vh]">
      {/* داشبورد دسکتاپ */}
      <DeskDashboard initialTab="projectdetails" />
      {/* داشبورد ریسپانسیو */}
      <ResDashboard initialTab="projectdetails" />
    </div>
  );
};

export default ProjectDetailsPage;
