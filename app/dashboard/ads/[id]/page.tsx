"use client";

import React from "react";
import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";
import AdDetailsComponent from "@/components/Dashboard/_components/Content/pages/Ads/[id]/AdDetailsComponent";

const AdDetailsPage: React.FC = () => {
  return (
    <div className="flex w-full h-[100vh]">
      {/* داشبورد دسکتاپ */}
      <DeskDashboard initialTab="adsdetails" />
      {/* داشبورد ریسپانسیو */}
      <ResDashboard initialTab="adsdetails" />
    </div>
  );
};

export default AdDetailsPage;
