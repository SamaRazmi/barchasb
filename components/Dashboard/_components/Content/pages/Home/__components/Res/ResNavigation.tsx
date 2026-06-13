"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const ResNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "میزکار", href: "/dashboard" },
    { label: "آگهی ها", href: "/dashboard/ads" },
    { label: "دیجیتال آگهی", href: "/dashboard/projects" },
    { label: "آگهی های من", href: "/dashboard/myads" },
    { label: "اشتراک و مالی", href: "/dashboard/billing" },
    { label: "افزونه ها", href: "/dashboard/plugins" },
  ];

  const sharedButtonClasses =
    "backdrop-blur-[41.848px] rounded-[15px] border-2 " +
    "shadow-[0px_39.52px_88.35px_0px_#0000001A,0px_160.42px_160.42px_0px_#00000017,0px_362.69px_218.54px_0px_#0000000D,0px_644px_258.06px_0px_#00000003,0px_1006.69px_281.31px_0px_#00000000]";

  const normalizedPath = pathname?.toLowerCase().replace(/\/$/, "");

  return (
    <div className="flex flex-col px-1 space-y-2">
      {/* موبایل زیر 350px */}
      <div className="hidden max-[350px]:flex flex-col space-y-2 max-[350px]:mt-4">
        {[0, 2, 4].map((row) => (
          <div key={row} className="flex justify-between gap-2">
            {navItems.slice(row, row + 2).map((item) => {
              const isActive = normalizedPath === item.href.toLowerCase();

              return (
                <div
                  key={item.href}
                  className="relative w-[45%] h-[5vh] cursor-pointer rounded-[15px] overflow-hidden"
                  onClick={() => {
                    router.push(item.href);
                    // حذف setActiveTab
                  }}
                >
                  {/* خطوط عمودی چپ و راست */}
                  <div className="absolute left-0 top-0 w-[2px] h-full rounded-[15px] bg-gradient-to-b from-[#143A62] via-white to-[#143A62] opacity-85" />
                  <div className="absolute right-0 top-0 w-[2px] h-full rounded-[15px] bg-gradient-to-b from-[#143A62] via-white to-[#143A62] opacity-85" />

                  <div
                    className={`flex items-center justify-center w-full h-full ${sharedButtonClasses}`}
                    style={{
                      background: isActive
                        ? "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.45) 100%)"
                        : "#D6D6D64D",
                      border: "2px solid transparent",
                      borderImageSlice: 1,
                      borderImageSource:
                        "linear-gradient(180deg, #143A62 0%, #FDF6F6 41.42%, #143A62 100%)",
                    }}
                  >
                    <span className="text-white font-semibold text-[2vh]">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* موبایل بالای 350px */}
      <div className="flex flex-col space-y-1 max-[350px]:hidden mt-3">
        {[0, 1].map((row) => (
          <div key={row} className="flex justify-between gap-4">
            {navItems.slice(row * 3, row * 3 + 3).map((item) => {
              const isActive = normalizedPath === item.href.toLowerCase();

              return (
                <div
                  key={item.href}
                  className="relative w-[118px] h-[7vh] cursor-pointer rounded-[15px] overflow-hidden"
                  onClick={() => {
                    router.push(item.href);
                    // حذف setActiveTab
                  }}
                >
                  <div className="absolute left-0 top-0 w-[2px] h-full rounded-[15px] bg-gradient-to-b from-[#143A62] via-white to-[#143A62] opacity-85" />
                  <div className="absolute right-0 top-0 w-[2px] h-full rounded-[15px] bg-gradient-to-b from-[#143A62] via-white to-[#143A62] opacity-85" />

                  <div
                    className={`flex items-center justify-center w-full h-full ${sharedButtonClasses}`}
                    style={{
                      background: isActive
                        ? "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.45) 100%)"
                        : "#D6D6D64D",
                      border: "2px solid transparent",
                      borderImageSlice: 1,
                      borderImageSource:
                        "linear-gradient(180deg, #143A62 0%, #FDF6F6 41.42%, #143A62 100%)",
                    }}
                  >
                    <span className="text-white font-semibold text-[2.2vh]">
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResNavigation;
