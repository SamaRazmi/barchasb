"use client";

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/common/TopBar";
import UserDashboardPanel from "./__components/UserDashboardPanel";

import ProfileSection from "./__components/left-sections/ProfileSection";
import MyAdsSection from "./__components/left-sections/MyAdsSection";
import AchievementsSection from "./__components/left-sections/AchievementsSection";
import RecentViewsSection from "./__components/left-sections/RecentViewsSection";

type PanelItem = "profile" | "myAds" | "achievements" | "recentViews";

const MyAds: NextPage = () => {
  const searchParams = useSearchParams();
  const tabFromQuery = searchParams.get("activeTab") as PanelItem | null;

  const [activeItem, setActiveItem] = useState<PanelItem>(
    tabFromQuery ? tabFromQuery : "profile",
  );

  useEffect(() => {
    if (tabFromQuery) {
      setActiveItem(tabFromQuery);
    }
  }, [tabFromQuery]);

  const renderLeftContent = () => {
    switch (activeItem) {
      case "profile":
        return <ProfileSection />;
      case "myAds":
        return (
          <MyAdsSection
            initialActiveType={tabFromQuery === "myAds" ? "seeker" : undefined}
          />
        );
      case "achievements":
        return <AchievementsSection />;
      case "recentViews":
        return <RecentViewsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[95vh] md:h-[88vh] overflow-y-hidden">
      {/* Desktop / md+ */}
      <div className="hidden md:flex md:flex-col md:h-full sm:p-[1vh]">
        {/* TopBar در بالای صفحه */}
        <TopBar />

        {/* محتوا */}
        <div className="flex-1 flex md:flex-row-reverse gap-4 p-2 h-full">
          {/* محتوای سمت راست */}
          <div className="w-full md:w-3/4 bg-[#F5F5F5] rounded-[16px] p-2">
            {renderLeftContent()}
          </div>

          {/* پنل سمت چپ */}
          <div className="w-full md:w-1/4 bg-[#F5F5F5] rounded-[16px] p-4">
            <UserDashboardPanel
              activeItem={activeItem}
              onSelect={setActiveItem}
            />
          </div>
        </div>
      </div>

      {/* Mobile / زیر md - TopBar حذف شد */}
      <div className="flex md:hidden flex-col flex-1 p-2 gap-2">
        {/* محتوا */}
        <div className="flex flex-col gap-4">
          <UserDashboardPanel
            activeItem={activeItem}
            onSelect={setActiveItem}
          />
          {renderLeftContent()}
        </div>
      </div>
    </div>
  );
};

export default MyAds;
