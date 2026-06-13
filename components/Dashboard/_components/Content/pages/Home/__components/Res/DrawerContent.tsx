"use client";
import React from "react";
import { usePathname } from "next/navigation";

// کامپوننت‌ها
import Home from "./___components/Home";
import Management from "./___components/Management";
import Notifications from "./___components/ResNotifications";
import ResSupport from "./___components/ResSupport";
import Ads from "./___components/ResAds";
import Biling from "./___components/ResBiling";

const ResContentHome: React.FC = () => {
  const pathname = usePathname();

  // نگاشت URL به کامپوننت
  const routeMap: Record<string, React.ReactNode> = {
    "/dashboard": <Home />,
    "/dashboard/ads": <Ads />,
    "/dashboard/projects": <Management />,
    "/dashboard/myads": <Notifications />,
    "/dashboard/billing": <Biling />,
    "/dashboard/plugins": <ResSupport />,
  };

  return (
    <div
      className="flex flex-col flex-1 p-4 mt-3 rounded-[16px] border border-gray-300"
      style={{ background: "#F3F5F7", minHeight: 0 }}
    >
      <div className="flex-1 overflow-auto h-[95%]">
        {routeMap[pathname] || <Home />}
      </div>
    </div>
  );
};

export default ResContentHome;
