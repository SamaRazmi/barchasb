"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import TopBar from "@/components/common/TopBar";
import Filterbar from "./__components/Desk/Filterbar";
import Content from "./__components/Desk/Content";
import { SkillsProvider } from "@/context/SkillsContext";
import { useFilters } from "@/context/FiltersContext";

const Ads: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveTab } = useFilters();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // 1. پردازش تب از پارامترهای URL
    let urlTab = searchParams.get("activeTab");
    if (urlTab === "karjoo") urlTab = "karjo";

    if (urlTab && ["karjo", "karfarma", "agahi"].includes(urlTab)) {
      setActiveTab(urlTab as "karjo" | "karfarma" | "agahi");
    } else {
      setActiveTab("karfarma");
    }

    // 2. مدیریت ریدایرکت (فقط در صورت نیاز و حفظ کوئری)
    const isPublicAdsPage = pathname === "/ads-all";
    const isCorrectDashboardPage = pathname === "/dashboard/ads";

    if (!isPublicAdsPage && !isCorrectDashboardPage) {
      const params = searchParams.toString();
      const newUrl = `/dashboard/ads${params ? `?${params}` : ""}`;
      router.replace(newUrl);
    }
  }, [searchParams, setActiveTab, router, pathname]);

  return (
    <SkillsProvider>
      <div className="flex flex-col h-[88vh] overflow-y-hidden">
        <div className="hidden md:flex md:flex-col md:h-full sm:p-[1vh]">
          <div className="mt-0">
            <TopBar />
          </div>
          <div className="flex flex-row gap-4 mt-1 sm:mt-[1%] h-full">
            <div className="w-1/4 h-[85vh]">
              <Filterbar />
            </div>
            <div className="w-3/4 h-[85vh]">
              <Content />
              {/* سایه ثابت پایین برای نشان دادن ادامه محتوا */}
              <div
                className="w-full h-[3vh] sticky bottom-0 left-0 pointer-events-none rounded-md "
                style={{
                  background:
                    "linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.6) 100%)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:hidden flex-1 h-[95vh]">
        <div className="flex flex-col"></div>
      </div>
    </SkillsProvider>
  );
};

export default Ads;
