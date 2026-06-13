"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { TabKeys } from "@/types/types";
import ResContentHome from "./_components/Content/pages/Home/__components/Res/ResContentHome";

interface ResDashboardProps {
  initialTab?: TabKeys;
}

const ResDashboard: React.FC<ResDashboardProps> = ({ initialTab = "home" }) => {
  const pathname = usePathname();

  const routeToTab: Record<string, TabKeys> = {
    "/dashboard": "home",
    "/dashboard/ads": "ads",
    "/dashboard/messages": "messages",
    "/dashboard/projects": "projects",
    "/dashboard/myads": "myads",
    "/dashboard/billing": "billing",
    "/dashboard/support": "support",
    "/dashboard/plugins": "plugins",
  };

  // Tab فعال بر اساس URL
  const selectedTab = routeToTab[pathname] ?? initialTab;

  return (
    <div className="w-screen h-[100vh] bg-[#143A62] md:hidden">
      <ResContentHome activeTab={selectedTab} />
    </div>
  );
};

export default ResDashboard;
