"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const ContentProjectsHome = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const handleProjectsForKarjo = () => {
    if (isLoggedIn) router.push("/dashboard/ads?activeTab=karfarma");
    else router.push("/register");
  };

  const handleCreateProjectForKarfarma = () => {
    if (isLoggedIn) router.push("/dashboard/createform/karfarmaform");
    else router.push("/register");
  };

  const handleListAds = () => {
    if (isLoggedIn) router.push("/dashboard/ads?activeTab=Ads");
    else router.push("/register");
  };

  const handleSubmitOffer = () => {
    if (isLoggedIn) router.push("/dashboard/createform/digitalprojectform");
    else router.push("/register");
  };

  return (
    <div className="relative w-full h-full">
      {/* ==================== دسکتاپ ==================== */}
      <div
        className="hidden sm:block w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg_projects.svg')" }}
      >
        {/* ---------- عناوین (موقعیت‌های جدید) ---------- */}
        <div className="absolute top-[2.4vh] right-2 text-[#143A62] text-[2.6vh]">
          برای کارجویان
        </div>
        <div className="absolute top-[2.4vh] left-[calc(50%-20vh)] text-[#143A62] text-[2.6vh]">
          برای کارفرمایان
        </div>
        <div className="absolute top-[calc(50%+3vh)] right-2 text-[#143A62] text-[2.6vh]">
          آگهی ها
        </div>
        <div className="absolute top-[calc(50%+3vh)] left-[calc(50%-26vh)] text-[#143A62] text-[2.6vh]">
          آگهی های مناقصه ای{" "}
        </div>

        {/* ---------- متن و دکمه‌ها ---------- */}
        {/* راست بالا */}
        <div className="absolute top-[10vh] right-[2vh] flex flex-col items-end text-right w-[20%]">
          <div className="text-black text-[2.2vh] font-bold leading-loose space-y-4 tracking-widest [word-spacing:0.3vh] [font-stretch:expanded]">
            <div className="">دیگه نگران بیکاری نباش</div>
            <div className="mr-[12vh]">از ایده تا اجرا</div>
            <div className="mr-[14vh]">همراه با بهترین متخصص‌ها</div>
          </div>
        </div>
        <button
          onClick={handleProjectsForKarjo}
          className="mt-[33vh] mr-[0.9vh] px-6 py-3 text-white font-bold text-[2vh] rounded-[16px] w-[180px] bg-[#143A62] shadow-md"
        >
          پروژه‌ها
        </button>

        {/* چپ بالا - راست‌چین شد */}
        <div className="absolute top-[6vh] left-8 flex flex-col items-end text-right max-w-[360px]">
          <div className="text-black text-[2.2vh] font-bold leading-loose ml-15 space-y-6 tracking-widest [word-spacing:0.3vh] [font-stretch:expanded]">
            <div className="mr-[-20vh]">دیگه نگران بیکاری نباش</div>
            <div className="mr-[-8vh]">از ایده تا اجرا</div>
            <div className="mr-[-5vh]">همراه با بهترین متخصص‌ها</div>
          </div>
          <button
            onClick={handleCreateProjectForKarfarma}
            className="mt-[5vh] ml-[0.6vh]  px-6 py-3 text-white font-bold text-[2vh] rounded-[16px] w-[180px] bg-[#00B6FF] shadow-md"
          >
            ایجاد پروژه
          </button>
        </div>

        {/* راست پایین - متن آگهی‌ها */}
        <div className="absolute bottom-[11vh] right-[5vh] flex flex-col items-end text-right max-w-[260px]">
          <div className="text-black text-[2.2vh] font-bold leading-loose space-y-6 tracking-widest [word-spacing:0.3vh] [font-stretch:expanded]">
            <div>چیزی برای فروش داری ؟</div>
            <div className="mr-[2vh]">دنبال چیزی برای خریدن هستی ؟</div>
            <div className="mr-[12vh]">جفتشو تو برچسب داری</div>
          </div>
        </div>
        {/* دکمه لیست آگهی ها به صورت جداگانه و چسبیده به لبه راست */}
        <button
          onClick={handleListAds}
          className="absolute mr-[0.9vh]  bottom-[1.8vh] right-[1.5vh] px-6 py-3 text-white font-bold text-[2vh] rounded-[16px] w-[180px]  bg-[#00B6FF]  shadow-md"
        >
          لیست آگهی ها
        </button>

        {/* چپ پایین - متن آگهی‌های دیجیتال + راست‌چین */}
        <div className="absolute bottom-2 left-8 flex flex-col items-end text-right max-w-[50vh]">
          <div className="text-black text-[2.2vh] font-bold leading-loose space-y-6 ml-10 w-full text-right tracking-widest [word-spacing:0.3vh] [font-stretch:expanded]">
            <div>بهترین کار ها</div>
            <div className="mr-[5vh]">بهترین پیشنهاد ها</div>
            <div className="mr-[15vh]">فقط برای بهترینا</div>
          </div>
          <button
            onClick={handleSubmitOffer}
            className="mt-[5vh] ml-[0.6vh]  px-6 py-3 text-white font-bold text-[2vh] rounded-[16px] w-[180px] bg-[#143A62] shadow-md"
          >
            ثبت پیشنهاد
          </button>
        </div>
      </div>

      {/* ==================== موبایل (بدون تغییر) ==================== */}
      <div
        className="sm:hidden w-full h-full bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: "url('/images/bg_projectsres.svg')" }}
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
          <div className="flex flex-col items-center justify-start text-right">
            <div className="text-[#143A62] text-[2.5vh] font-bold">
              برای کارجویان
            </div>
            <button
              onClick={handleProjectsForKarjo}
              className="mt-2 px-4 py-2 text-white font-bold text-[2vh] rounded-[16px] w-[140px] bg-[#143A62] shadow-md"
            >
              پروژه‌ها
            </button>
          </div>
          <div className="flex flex-col items-center justify-start text-left">
            <div className="text-[#143A62] text-[2.5vh] font-bold">
              برای کارفرمایان
            </div>
            <button
              onClick={handleCreateProjectForKarfarma}
              className="mt-2 px-4 py-2 text-white font-bold text-[2vh] rounded-[16px] w-[140px] bg-[#00B6FF] shadow-md"
            >
              ایجاد پروژه
            </button>
          </div>
          <div className="flex flex-col items-center justify-start text-right">
            <div className="text-[#143A62] text-[2.5vh] font-bold">آگهی ها</div>
            <button
              onClick={handleListAds}
              className="mt-2 px-4 py-2 text-white font-bold text-[2vh] rounded-[16px] w-[140px]  bg-[#00B6FF] shadow-md"
            >
              لیست آگهی ها
            </button>
          </div>
          <div className="flex flex-col items-center justify-start text-left">
            <div className="text-[#143A62] text-[2.5vh] font-bold">
              آگهی های مناقصه ای{" "}
            </div>
            <button
              onClick={handleSubmitOffer}
              className="mt-2 px-4 py-2 text-white font-bold text-[2vh] rounded-[16px] w-[140px] bg-[#143A62] shadow-md"
            >
              ثبت پیشنهاد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentProjectsHome;
