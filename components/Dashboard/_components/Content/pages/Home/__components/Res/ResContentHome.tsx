"use client";

import React, { useEffect, lazy, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useUser } from "@/context/UserContext";

// بالای صفحه موبایل
import ResTopBar from "./ResTopBar";
import ResProfile from "./ResProfile";
import ResNavigation from "./ResNavigation";

// محتواهای موبایل
import Home from "../Res/___components/Home";
import ResAds from "../Res/___components/ResAds";
import ResSubscription from "./___components/ResSubscription";
import ResCreateAd from "./___components/ResCreateAd";
import Billing from "./___components/ResBiling";
import Projects from "./___components/Management";
import MyAdsPage from "../../../MyAds";
import Support from "./___components/ResSupport";
import Plugins from "../../../Plugins";

// فرم‌های اختصاصی
import KarfarmaForm from "@/app/dashboard/createform/digitalprojectform/page";
import KarjooForm from "@/app/dashboard/createform/karjooform/page";
import AdsForm from "@/app/dashboard/createform/adsform/page";
import DigitalProjectForm from "@/app/dashboard/createform/digitalprojectform/page";
import ChatMessagesContent from "../../../Chat/[adType]/[adId]/[receiverId]/ChatMessagesContent";

// ⭐ کامپوننت‌های ساپورت
import SupportQuestions from "../../../Support/SupportQuestions";
import SupportAdminOptions from "../../../Support/Desk/SupportAdminOptions";
import SupportTicket from "../../../Support/SupportTicket";
import ChatWrapper from "../../../Chat/ChatWrapper";
import ResNotifications from "./___components/ResNotifications";

// کامپوننت جزئیات آگهی (برای هر دو نوع آگهی و پروژه دیجیتال استفاده می‌شود)
const AdDetailsComponent = lazy(
  () => import("../../../Ads/[id]/AdDetailsComponent"),
);

interface ResContentHomeProps {
  activeTab?: string;
}

const ResContentHome: React.FC<ResContentHomeProps> = ({
  activeTab: _activeTab,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  // ======================= شناسایی مسیر چت با جزئیات =======================
  const isChatRoute = pathname?.startsWith("/dashboard/chat/");
  let chatParams: { adType: string; adId: string; receiverId: string } | null =
    null;
  if (isChatRoute && pathname) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 5 && parts[1] === "chat") {
      chatParams = {
        adType: parts[2],
        adId: parts[3],
        receiverId: parts[4],
      };
    }
  }

  const getDrawerOptionFromPath = (path: string | null): string | null => {
    if (!path) return null;
    if (path.includes("/createform")) return "آگهی‌ها";
    if (path.includes("/subscription")) return "اشتراک";
    return null;
  };

  const drawerOption = getDrawerOptionFromPath(pathname);

  const handleDrawerClick = (option: string | null) => {
    if (option === "آگهی‌ها") {
      router.push("/dashboard/ads");
    } else if (option === "اشتراک") {
      router.push("/dashboard/subscription");
    } else if (option === "پشتیبانی") {
      router.push("/dashboard/support");
    } else if (option === "افزونه‌ها") {
      router.push("/dashboard/plugins");
    } else {
      router.push("/dashboard");
    }
  };

  const handleCreateAdOption = (
    type: "karfarma" | "karjoo" | "ads" | "digital",
  ) => {
    let path = "/dashboard/createform";
    switch (type) {
      case "karfarma":
        path += "/karfarmaform";
        break;
      case "karjoo":
        path += "/karjooform";
        break;
      case "ads":
        path += "/adsform";
        break;
      case "digital":
        path += "/digitalprojectform";
        break;
    }
    router.push(path);
  };

  // ⭐ تابع تشخیص تب با پشتیبانی از جزئیات پروژه دیجیتال
  const getTabFromPath = (path: string | null): string => {
    if (!path) return "home";

    // تشخیص جزئیات پروژه دیجیتال (مسیرهایی با شناسه بعد از /projects/)
    const projectDetailsPattern = /^\/dashboard\/projects\/[^\/?#]+$/;
    if (projectDetailsPattern.test(path)) {
      return "project-details";
    }

    if (path === "/dashboard") return "home";

    // مسیر لیست چت‌ها
    if (path === "/dashboard/chat") return "chat-list";
    if (path === "/dashboard/messages") return "messages";

    // مسیر چت با جزئیات
    if (path.startsWith("/dashboard/chat/")) return "chat";

    // مسیرهای ساپورت
    if (path === "/dashboard/support/questions") return "supportQuestions";
    if (path === "/dashboard/support/admin-options")
      return "supportAdminOptions";
    if (path === "/dashboard/support/ticket") return "supportTicket";

    // تشخیص جزئیات آگهی عادی
    const adDetailsPattern = /^\/dashboard\/ads\/[^\/]+$/;
    if (adDetailsPattern.test(path)) return "ad-details";

    const myAdsDetailsPattern = /^\/my-ads-details\/[^\/]+\/[^\/]+$/;
    if (myAdsDetailsPattern.test(path)) return "my-ads-details";

    if (path.includes("/ads") && !path.includes("/createform")) return "ads";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/myads")) return "myads";
    if (path.includes("/billing")) return "billing";
    if (path.includes("/support")) return "support";
    if (path.includes("/plugins")) return "plugins";
    if (path.includes("/karfarmaform")) return "karfarma";
    if (path.includes("/karjooform")) return "karjoo";
    if (path.includes("/adsform")) return "ads";
    if (path.includes("/digitalprojectform")) return "digital";
    if (path.includes("/createform")) return "createform";
    if (path.includes("/subscription")) return "subscription";
    return "home";
  };

  const tab = getTabFromPath(pathname);

  const extractMyAdsDetails = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[0] === "my-ads-details") {
      return { adType: parts[1], adId: parts[2] };
    }
    return { adType: null, adId: null };
  };

  const getSelectedFormFromPath = (path: string | null) => {
    if (!path) return undefined;
    if (path.includes("/karfarmaform")) return "karfarma";
    if (path.includes("/karjooform")) return "karjoo";
    if (path.includes("/adsform")) return "ads";
    if (path.includes("/digitalprojectform")) return "digital";
    return undefined;
  };

  const selectedForm = getSelectedFormFromPath(pathname);

  // ======================= رندر محتوای اصلی =======================
  const renderMainContent = () => {
    // اولویت با مسیر چت با جزئیات
    if (isChatRoute && chatParams && user?._id) {
      return (
        <ChatMessagesContent
          currentUserId={user._id}
          receiverId={chatParams.receiverId}
          adId={chatParams.adId}
          adType={chatParams.adType}
        />
      );
    }

    if (drawerOption === "اشتراک") return <ResSubscription />;
    if (drawerOption === "آگهی‌ها") {
      return (
        <ResCreateAd
          selectedForm={selectedForm}
          onSelectOption={handleCreateAdOption}
        />
      );
    }

    switch (tab) {
      case "home":
        return <Home />;
      case "chat-list":
        return <ChatWrapper />;
      case "messages":
        return <ResNotifications />;
      case "ads":
        return <ResAds />;
      case "ad-details":
        return (
          <Suspense
            fallback={
              <div className="p-4 text-center">
                در حال بارگذاری جزئیات آگهی...
              </div>
            }
          >
            <AdDetailsComponent />
          </Suspense>
        );

      // ⭐⭐⭐ جزئیات پروژه دیجیتال (جدید) ⭐⭐⭐
      case "project-details": {
        // استخراج adId از مسیر: /dashboard/projects/{adId}
        const match = pathname?.match(/\/dashboard\/projects\/([^\/?#]+)/);
        const adId = match ? match[1] : null;
        if (!adId) {
          return (
            <div className="p-4 text-center text-red-500">
              شناسه پروژه یافت نشد
            </div>
          );
        }
        return (
          <Suspense
            fallback={
              <div className="p-4 text-center">
                در حال بارگذاری جزئیات پروژه دیجیتال...
              </div>
            }
          >
            {/* استفاده از AdDetailsComponent با ارسال adId */}
            <AdDetailsComponent adId={adId} />
          </Suspense>
        );
      }

      case "my-ads-details": {
        const { adId, adType } = extractMyAdsDetails(pathname || "");
        if (!adId) {
          return (
            <div className="p-4 text-center text-red-500">آگهی یافت نشد</div>
          );
        }
        return (
          <Suspense
            fallback={
              <div className="p-4 text-center">
                در حال بارگذاری جزئیات آگهی...
              </div>
            }
          >
            <AdDetailsComponent adId={adId} />
          </Suspense>
        );
      }
      case "projects":
        return <Projects />;
      case "myads":
        return <MyAdsPage />;
      case "billing":
        return <Billing />;
      case "support":
        return <Support />;
      case "supportQuestions":
        return <SupportQuestions />;
      case "supportAdminOptions":
        return <SupportAdminOptions />;
      case "supportTicket":
        return <SupportTicket />;
      case "plugins":
        return <Plugins />;
      case "karfarma":
        return <KarfarmaForm />;
      case "karjoo":
        return <KarjooForm />;
      case "ads":
        return <AdsForm />;
      case "digital":
        return <DigitalProjectForm />;
      default:
        return <Home />;
    }
  };

  const shouldShowOrangeButton = () => {
    if (!isLoggedIn) return false;
    if (!pathname) return false;
    if (isChatRoute) return false;
    if (pathname.includes("/createform")) return false;

    const parts = pathname.split("/").filter((p) => p !== "");
    if (parts[0] === "dashboard") {
      if (parts.length === 1) return true;
      if (parts.length === 2) return true;
    }
    return false;
  };

  // ======================= نمایش =======================
  return (
    <div className="flex flex-col h-full md:hidden mx-1">
      {isLoggedIn && !isChatRoute && (
        <>
          <ResTopBar setDrawerOption={handleDrawerClick} />
          <ResProfile />
          <ResNavigation />
        </>
      )}

      <div
        className={`flex-1 flex flex-col overflow-auto overscroll-contain mt-2 bg-white rounded-lg m-2 ${
          isChatRoute ? "p-0 m-0 rounded-none" : "p-2"
        }`}
      >
        {renderMainContent()}

        {shouldShowOrangeButton() && (
          <button
            onClick={() => router.push("/dashboard/createform")}
            className="fixed bottom-8 right-4 w-14 h-14 bg-[#143A62] rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-all focus:outline-none z-[9999] group"
            aria-label="ایجاد آگهی جدید"
          >
            <span className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-orange-600 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              ثبت آگهی
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ResContentHome;
