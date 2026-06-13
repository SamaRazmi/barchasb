"use client";
import { motion } from "framer-motion";
import Image from "next/image";

type PanelItem = "profile" | "myAds" | "achievements" | "recentViews";

interface Props {
  activeItem: PanelItem;
  onSelect: (item: PanelItem) => void;
}

const items = [
  { id: "profile", label: "پروفایل", icon: "/images/profile-icon-res.svg" },
  { id: "myAds", label: "آگهی‌های من", icon: "/images/myads-icon-res.svg" },
  {
    id: "achievements",
    label: "نشان‌ها",
    icon: "/images/achievements-icon-res.svg",
  },
  {
    id: "recentViews",
    label: "بازدیدهای اخیر",
    icon: "/images/recentviews-icon-res.svg",
  },
] as const;

const UserDashboardPanel = ({ activeItem, onSelect }: Props) => {
  return (
    <>
      {/* دسکتاپ: پنل سمت چپ معمولی */}
      <div className="hidden md:flex w-full h-full flex-col gap-3">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex flex-row items-center gap-2 rounded-[12px] px-4 py-3 transition-all
                ${isActive ? "bg-white shadow-[0px_1px_8px_0px_#0000001A]" : "bg-transparent"}`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={0}
                height={0}
                style={{ width: "4vh", height: "4vh" }}
              />
              <span
                className="text-right"
                style={{ fontSize: "2.2vh", color: "#143A62D9" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* موبایل: Bottom Fixed Bar */}
      <div className="md:hidden fixed bottom-2  left-3 right-3 bg-[#FFFFFF] rounded-[16px] shadow-lg flex justify-between items-center p-2 z-[999] h-[10vh]">
        {items.map((item) => {
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex-1 relative flex items-center justify-center h-full"
            >
              {/* آیکن اصلی */}
              <Image
                src={item.icon}
                alt={item.label}
                width={0}
                height={0}
                style={{
                  width: isActive ? "4vh" : "3vh",
                  height: isActive ? "4vh" : "3vh",
                  objectFit: "contain",
                  transition: "all 0.2s ease-in-out",
                }}
              />

              {/* عنوان بالای آیکن وقتی فعال است */}
              {isActive && (
                <span
                  className="absolute -top-2 text-sm text-[#143A62] whitespace-nowrap"
                  style={{ fontSize: "1.4vh" }}
                >
                  {item.label}
                </span>
              )}

              {/* آیکن indicator متحرک با Framer Motion */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator" // مهم: یک id یکتا برای همه indicatorها
                  className="absolute bottom-1 w-[2vh] h-[2vh]"
                >
                  <Image
                    src="/images/vector-myads.svg"
                    alt="active indicator"
                    width={0}
                    height={0}
                    style={{ width: "100%", height: "100%" }}
                  />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default UserDashboardPanel;
