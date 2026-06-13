"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Sidebar from "./_components/Sidebar";
import Content from "./_components/Content";
import { TabKeys } from "@/types/types";

interface DeskDashboardProps {
  initialTab?: TabKeys;
}

const DeskDashboard: React.FC<DeskDashboardProps> = ({
  initialTab = "home",
}) => {
  const role = useSelector((state: RootState) => state.role.value);
  const pathname = usePathname();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const routeToTab: Record<string, TabKeys> = {
    "/dashboard": "home",
    "/dashboard/ads": "ads",
    "/dashboard/messages": "messages",
    "/dashboard/projects": "projects",
    "/dashboard/myads": "myads",
    "/dashboard/billing": "billing",
    "/dashboard/support": "support",
    "/dashboard/plugins": "plugins",
    "/dashboard/chat": "chat",
  };

  const selectedTab = routeToTab[pathname] ?? initialTab;

  return (
    <div className="hidden md:flex w-full h-full bg-[#143A62]">
      {isLoggedIn && (
        <div className="w-1/5 h-full">
          <Sidebar selectedTab={selectedTab} />
        </div>
      )}
      <div className={`h-full ${isLoggedIn ? "w-4/5" : "w-[95%] mx-auto"}`}>
        <Content selectedTab={selectedTab} />
      </div>
    </div>
  );
};

export default DeskDashboard;
