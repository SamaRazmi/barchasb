"use client";

import dynamic from "next/dynamic";
import { useCards } from "@/context/CardsContext";

const MainSlider = dynamic(
  () => import("./_components/MainSlider").then((mod) => mod.default),
  { ssr: false }, // فقط در سمت کلاینت لود شود
);

const SlidersGroup = () => {
  const { jobSeekers, employers, ads } = useCards();
  return (
    <div className="w-full h-full sm:h-[60vh] px-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-1 md:gap-16 md:mr-[4%] md:ml-[2%] h-full">
        <div className="w-full sm:w-11/12 lg:w-10/12 mx-auto mt-[30px] sm:mt-0">
          <MainSlider
            title="کارفرمایان"
            cards={employers}
            cardType="EmployerAd"
          />
        </div>
        <div className="w-full sm:w-11/12 lg:w-10/12 mx-auto mt-[30px] sm:mt-0">
          <MainSlider
            title="کارجویان"
            cards={jobSeekers}
            cardType="JobSeekerAd"
          />
        </div>
        <div className="w-full sm:w-11/12 lg:w-10/12 mx-auto mt-[30px] sm:mt-0">
          <MainSlider title="آگهی‌ها" cards={ads} cardType="SellerAd" />
        </div>
      </div>
    </div>
  );
};

export default SlidersGroup;
