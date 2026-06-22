"use client";
import React, { useEffect } from "react";
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

  useEffect(() => {
    // قفل کردن اسکرول بدنه در موبایل
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      };
    }
  }, []);

  return (
    <div
      className="w-screen bg-[#143A62] md:hidden overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <ResContentHome activeTab={selectedTab} />
    </div>
  );
};

export default ResDashboard;
