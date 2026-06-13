"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const ContentProjectsHome = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const handleProjectsClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard/myads?activeTab=myAds");
    } else {
      router.push("/register");
    }
  };

  const handleCreateProjectClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard/createform");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* نسخه دسکتاپ */}
      <div className="hidden sm:block w-full h-full">
        {/* متن‌ها */}
        <div className="absolute top-4 right-4 text-[3vh] font-bold text-[#143A62]">
          برای کارجویان
        </div>
        <div className="absolute top-4 left-4 text-[3vh] font-bold text-[#143A62]">
          برای کارفرمایان
        </div>
        <div className="absolute right-4 mt-[14vh] text-right text-[3vh] font-bold text-black">
          <div>دیگه نگران بیکاری نباش</div>
          <div>از ایده تا اجرا، همراه با بهترین متخصص‌ها</div>
        </div>
        <div className="absolute left-4 mt-[14vh] text-left text-[3vh] font-bold text-black">
          <div>دیگه نگران پروژه هات نباش</div>
          <div>از ایده تا اجرا، همراه با بهترین متخصص‌ها</div>
        </div>

        {/* دکمه‌ها در وسط */}
        <div className="absolute inset-0 flex justify-center items-center gap-[70px]">
             <div className="flex flex-col  justify-center items-center">
           <button
            onClick={handleProjectsClick}
            className="px-4 py-4 text-white mb-[5vh] font-bold text-[20px] rounded-[16px] w-[230px] max-w-[230px] bg-[#143A62] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
          >
            پروژه‌ها
          </button>
          <button
            onClick={handleCreateProjectClick}
            className="px-4 py-4 text-white font-bold text-[20px] rounded-[16px] w-[230px] max-w-[230px] bg-[#00B6FF] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
          >
            ایجاد پروژه
          </button>
         </div>
            <div className="flex flex-col justify-center items-center">
           <button
            onClick={handleProjectsClick}
            className="px-4 py-4 text-white mb-[5vh] font-bold text-[20px] rounded-[16px] w-[230px] max-w-[230px] bg-[#143A62] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
          >
            پروژه‌ها
          </button>
          <button
            onClick={handleCreateProjectClick}
            className="px-4 py-4 text-white font-bold text-[20px] rounded-[16px] w-[230px] max-w-[230px] bg-[#00B6FF] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
          >
            ایجاد پروژه
          </button>
         </div>
        </div>
      </div>

      {/* نسخه موبایل */}
      <div className="sm:hidden w-full h-full relative">
        {/* دکمه ایجاد پروژه بالای تصویر، سمت راست */}
        <button
          onClick={handleCreateProjectClick}
          className="absolute top-4 right-4 px-1 py-2 text-white font-bold text-[2.2vh] rounded-[16px] w-[180px] max-w-[200px] bg-[#00B6FF] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
        >
          ایجاد پروژه
        </button>

        {/* دکمه پروژه‌ها نزدیک وسط تصویر، سمت چپ */}
        <button
          onClick={handleProjectsClick}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 px-1 py-2 mt-[5%] text-white font-bold text-[2.2vh] rounded-[16px] w-[180px] max-w-[200px] mt-[2%] bg-[#143A62] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.3)]"
        >
          پروژه‌ها
        </button>
      </div>
    </div>
  );
};

export default ContentProjectsHome;
