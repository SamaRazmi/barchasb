"use client";
import React, { useState } from "react";
import TopBar from "@/components/common/TopBar";
import SupportQuestions from "../SupportQuestions";
import SupportAdminOptions from "../Desk/SupportAdminOptions";

interface SupportContentProps {
  setView?: (view: "menu" | "questions" | "adminOptions") => void;
}

const SupportContent: React.FC<SupportContentProps> = ({ setView }) => {
  const [activeMobileView, setActiveMobileView] = useState<
    "questions" | "adminOptions" | null
  >(null);

  // اگر موبایل کارت فعال شد، فقط کامپوننت مربوطه نمایش داده شود
  if (activeMobileView) {
    return (
      <div className="relative flex flex-col h-full w-[95%] z-30">
        {/* دکمه بازگشت */}
        <button
          onClick={() => {
            console.log("clicked");
            setActiveMobileView(null);
          }}
          className="absolute top-5 left-3 bg-gray-200 rounded w-max z-30"
        >
          <img src="/images/back_arrow.svg" alt="Back" width={25} height={25} />
        </button>

        {activeMobileView === "questions" && <SupportQuestions />}
        {activeMobileView === "adminOptions" && <SupportAdminOptions />}
      </div>
    );
  }

  // حالت موبایل یا دسکتاپ اصلی
  return (
    <>
      {/* TopBar فقط از sm به بالا */}
      <div className="hidden mt-[0.8vh] sm:block">
        <TopBar />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-center h-[90%] mt-4">
        <img
          src="/images/bg_support_dashboard.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          loading="lazy"
        />

        <div className="relative z-10 flex flex-col py-[4vh] sm:flex-row justify-center items-center gap-6 sm:gap-[50px] md:gap-[80px] lg:gap-[110px]">
          {/* موبایل: سوالات متداول */}
          <div
            onClick={() => setActiveMobileView("questions")}
            className="sm:hidden flex flex-col justify-center items-center bg-white rounded-[20px] shadow-lg hover:shadow-xl transition w-[90%] h-[20vh]"
          >
            <img
              src="/images/support_question_dashboard.svg"
              alt=""
              className="w-[60px] h-[60px]"
            />
            <span className="mt-[25px] text-[#143A62E5] font-semibold text-[16px] text-center">
              سوالات متداول
            </span>
          </div>

          {/* موبایل: ارسال پیام به پشتیبانی (تغییر متن و مسیر) */}
          <div
            onClick={() => setActiveMobileView("adminOptions")}
            className="sm:hidden flex flex-col justify-center items-center bg-white rounded-[20px] shadow-lg hover:shadow-xl transition w-[90%] h-[20vh]"
          >
            <img
              src="/images/support_admin_dashboard.svg"
              alt=""
              className="w-[60px] h-[60px]"
            />
            <span className="mt-[25px] text-[#143A62E5] font-semibold text-[16px] text-center">
              ارسال پیام به پشتیبانی
            </span>
          </div>

          {/* دسکتاپ: سوالات متداول */}
          <div
            onClick={() => setView && setView("questions")}
            className="hidden sm:flex flex-col justify-center items-center bg-white rounded-[20px] cursor-pointer shadow-lg hover:shadow-xl transition w-[200px] h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px]"
          >
            <img
              src="/images/support_question_dashboard.svg"
              alt=""
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px]"
            />
            <span className="mt-[25px] text-[#143A62E5] font-semibold text-[16px] md:text-[18px] lg:text-[20px] text-center">
              سوالات متداول
            </span>
          </div>

          {/* دسکتاپ: ارسال پیام به پشتیبانی (تغییر متن و مسیر) */}
          <div
            onClick={() => setView && setView("adminOptions")}
            className="hidden sm:flex flex-col justify-center items-center bg-white rounded-[20px] cursor-pointer shadow-lg hover:shadow-xl transition w-[200px] h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px]"
          >
            <img
              src="/images/support_admin_dashboard.svg"
              alt=""
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px]"
            />
            <span className="mt-[25px] text-[#143A62E5] font-semibold text-[16px] md:text-[18px] lg:text-[20px] text-center">
              ارسال پیام به پشتیبانی
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportContent;
