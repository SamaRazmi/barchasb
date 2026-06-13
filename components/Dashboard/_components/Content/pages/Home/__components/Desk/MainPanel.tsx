"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Image from "next/image";
import CircleProgress from "./CircleProgress";
import StatsCard from "./StatsCard";
import BarChart from "./BarChart";

export default function MainPanel() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  // آگهی کارفرمایان → نمایش آگهی‌های کارفرمایان برای کارجویان
  const handleEmployersAds = () => {
    if (isLoggedIn) {
      router.push("/dashboard/ads?activeTab=karfarma");
    } else {
      router.push("/register");
    }
  };

  // آگهی کارجویان → نمایش آگهی‌های کارجویان برای کارفرمایان
  const handleJobSeekersAds = () => {
    if (isLoggedIn) {
      router.push("/dashboard/ads?activeTab=karjo");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F5] rounded-[16px] p-4 h-full flex flex-col">
      {/* دو دکمه بالا سمت راست */}
      <div className="flex items-start w-full">
        {/* دکمه آگهی کارفرمایان */}
        <div
          onClick={handleEmployersAds}
          className="flex items-center gap-2 pl-8 pr-6 h-[7vh] bg-[#143A62] rounded-[16px] cursor-pointer shadow-md"
        >
          <Image
            src="/images/employers.svg"
            alt="Employers"
            width={20}
            height={20}
          />
          <span className="text-white sm:text-[2vh] lg:text-[2.5vh] font-normal whitespace-nowrap text-ellipsis">
            آگهی کارفرمایان
          </span>
        </div>

        {/* دکمه آگهی کارجویان */}
        <div
          onClick={handleJobSeekersAds}
          className="flex items-center gap-2 h-[7vh] bg-[#143A62] rounded-[16px] pl-10 pr-6 cursor-pointer shadow-md mx-6"
        >
          <Image src="/images/employers.svg" alt="Ads" width={20} height={20} />
          <span className="text-white sm:text-[2vh] lg:text-[2.5vh] font-normal whitespace-nowrap text-ellipsis">
            آگهی کارجویان
          </span>
        </div>

        {/* CircleProgress درست تراز */}
        <div className="mr-auto flex flex-col justify-start h-[5vh]">
          <div className="my-[0.3vh] mr-auto">
            <CircleProgress dayPercent={30} notificationPercent={90} />
          </div>
        </div>
      </div>

      {/* کارت سه‌قسمتی درست زیر دکمه‌ها بدون فاصله اضافی */}
      <div className="mt-1">
        <StatsCard />
      </div>

      {/* کارت 1 */}
      <div className="flex-1 rounded-[16px] overflow-auto mt-2">
        <BarChart />
      </div>
    </div>
  );
}
