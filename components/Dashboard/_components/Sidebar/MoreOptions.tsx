"use client";

import React from "react";
import Image from "next/image";

interface MoreOptionsProps {
  onSharePlan?: () => void;
  onMyProjects?: () => void;
  onBookmarks?: () => void;
  onBack?: () => void;
}

const MoreOptions: React.FC<MoreOptionsProps> = ({
  onSharePlan,
  onMyProjects,
  onBookmarks,
  onBack,
}) => {
  return (
    <div className="w-full h-full bg-[#FFFFFF33] rounded-[16px] flex flex-col items-center justify-start py-0 px-4 relative">
      {/* لیست گزینه‌ها */}
      <div className="w-full flex flex-col items-center justify-start py-2 px-1">
        <div className="w-full flex flex-col space-y-2">
          {/* اشتراک و پلن */}
          <div
            onClick={onSharePlan}
            className="w-full h-[5vh] bg-[#FFFFFF33] rounded-[10px] px-1 py-2 flex items-center cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Image
                src="/images/share-plan.svg"
                alt="اشتراک و پلن"
                width={20}
                height={20}
                className="w-[2.5vh] h-[2.5vh] object-contain"
              />
              <span className="text-white text-[2vh] font-medium pr-[2vh]">
                اشتراک و پلن
              </span>
            </div>
          </div>

          {/* پروژه های من */}
          <div
            onClick={onMyProjects}
            className="w-full h-[5vh] bg-[#FFFFFF33] rounded-[10px] px-1 py-2 flex items-center cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Image
                src="/images/my-projects.svg"
                alt="پروژه های من"
                width={20}
                height={20}
                className="w-[2.5vh] h-[2.5vh] object-contain"
              />
              <span className="text-white text-[2vh] font-medium pr-[2vh]">
                پروژه های من
              </span>
            </div>
          </div>

          {/* نشان شده‌ها */}
          <div
            onClick={onBookmarks}
            className="w-full h-[5vh] bg-[#FFFFFF33] rounded-[10px] px-1 py-2 flex items-center cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Image
                src="/images/bookmarks.svg"
                alt="نشان شده ها"
                width={20}
                height={20}
                className="w-[2.5vh] h-[2.5vh] object-contain"
              />
              <span className="text-white text-[2vh] font-medium pr-[2vh]">
                نشان شده ها
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه بازگشت: حالا مستقیماً داخل کادر اصلی و پایین سمت چپ */}
      <div
        onClick={onBack}
        className="absolute bottom-2 left-3 w-[5vh] h-[5vh] rounded-full bg-[#FFFFFFCC] flex items-center justify-center cursor-pointer"
      >
        <Image
          src="/images/backarrow-moreoptions.svg"
          alt="بازگشت"
          width={20}
          height={20}
          className="w-[3vh] h-[3vh] object-contain"
        />
      </div>
    </div>
  );
};

export default MoreOptions;
