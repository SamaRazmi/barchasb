"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

// Top Bars & Profile
import ResTopBar from "./__components/Res/ResTopBar";
import ResProfile from "./__components/Res/ResProfile";
import TopBar from "@/components/common/TopBar";
import HomeContent from "./__components/Desk/HomeContent";
import ResNavigation from "./__components/Res/ResNavigation";
import ResContentHome from "./__components/Res/ResContentHome";
import ResMoreOptions from "./__components/ResMoreOptions/index";

// Lazy load heavy components
const ResSubscription = lazy(
  () => import("./__components/Res/___components/ResSubscription"),
);
const ResSave = lazy(() => import("./__components/Res/___components/ResSave"));
const ResCreateAd = lazy(
  () => import("./__components/Res/___components/ResCreateAd"),
);

const Home: React.FC = () => {
  const pathname = usePathname(); // دریافت مسیر جاری
  const [drawerOption, setDrawerOption] = useState<string | null>(null);
  const [showRadialMenu, setShowRadialMenu] = useState<boolean>(false);

  // نقشه مسیر به برچسب تب
  const pathToTab: Record<string, string> = {
    "/dashboard": "میزکار",
    "/dashboard/ads": "آگهی ها",
    "/dashboard/projects": "دیجیتال آگهی",
    "/dashboard/myads": "آگهی های من",
    "/dashboard/billing": "اشتراک و مالی",
    "/dashboard/plugins": "افزونه ها",
  };

  // محاسبه تب فعال از مسیر فعلی
  const activeTab = useMemo(() => {
    const normalizedPath = pathname?.toLowerCase().replace(/\/$/, "") || "";
    return pathToTab[normalizedPath] || "میزکار";
  }, [pathname]);

  // Ref برای ذخیره timeout جهت پاکسازی
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // تابع بستن منو با پاکسازی timeout قبلی
  const closeRadialMenu = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShowRadialMenu(false);
  }, []);

  // وقتی گزینه radial کلیک شد (با تأخیر در بسته شدن منو)
  const handleRadialOptionClick = useCallback((option: string) => {
    setDrawerOption(option);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setShowRadialMenu(false);
      closeTimeoutRef.current = null;
    }, 500);
  }, []);

  // وقتی کاربر از close استفاده می‌کند (بدون تأخیر)
  const handleManualClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setShowRadialMenu(false);
  }, []);

  // تابع استاندارد برای بستن drawer بعد از کلیک روی گزینه‌های داخل خود کامپوننت (مثل آگهی‌ها)
  const handleDrawerClick = useCallback((option: string) => {
    setDrawerOption(option);
    setShowRadialMenu(false);
  }, []);

  // handleTabChange حذف شد

  const renderContent = useMemo(() => {
    if (drawerOption === "اشتراک") {
      return (
        <Suspense
          fallback={
            <div className="p-4 text-center">در حال بارگذاری اشتراک...</div>
          }
        >
          <ResSubscription />
        </Suspense>
      );
    }
    if (drawerOption === "آگهی‌ها") {
      return (
        <Suspense
          fallback={
            <div className="p-4 text-center">
              📢 در حال دریافت آگهی‌ها، لطفاً صبر کنید...
            </div>
          }
        >
          <ResCreateAd onSelectOption={handleDrawerClick} />
        </Suspense>
      );
    }
    if (drawerOption === "ذخیره‌ها") {
      return (
        <Suspense
          fallback={
            <div className="p-4 text-center">در حال بارگذاری ذخیره‌ها...</div>
          }
        >
          <ResSave />
        </Suspense>
      );
    }
    return <ResContentHome activeTab={activeTab} />;
  }, [drawerOption, activeTab, handleDrawerClick]);

  return (
    <>
      {/* دسکتاپ */}
      <div className="flex flex-col h-full">
        <div className="hidden md:flex md:flex-col md:h-full sm:p-[1%]">
          <div className="mt-0">
            <TopBar />
          </div>
          <div className="flex flex-1 gap-4 overflow-auto mt-1 sm:mt-[1%]">
            <HomeContent />
          </div>
        </div>
      </div>

      {/* موبایل */}
      <div className="flex flex-col md:hidden flex-1 h-[94vh]">
        <div className="flex flex-col mx-4">
          <ResTopBar setDrawerOption={setDrawerOption} />
          <ResProfile />
          <ResNavigation /> {/* بدون prop setActiveTab */}
        </div>

        <div className="flex-1 flex flex-col">
          {drawerOption ? (
            renderContent
          ) : (
            <ResContentHome activeTab={activeTab} />
          )}
        </div>

        {/* Radial Menu با تأخیر در بسته شدن */}
        {showRadialMenu && (
          <ResMoreOptions
            onClose={handleManualClose}
            onOptionClick={handleRadialOptionClick}
          />
        )}
      </div>
    </>
  );
};

export default React.memo(Home);
