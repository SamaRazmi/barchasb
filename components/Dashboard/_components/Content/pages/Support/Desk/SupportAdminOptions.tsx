"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopBar from "@/components/common/TopBar";

const SupportAdminOptions: React.FC = () => {
  const router = useRouter();

  const handleChat = () => {
    alert("بزودی چت با ادمین فعال می‌شود");
  };
  const handlePhone = () => {
    alert("شماره تماس پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸");
  };

  return (
    <>
      {/* TopBar فقط در دسکتاپ */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* همان ساختار SupportContent */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch  mr-[5%] sm:items-center h-[90%] mt-[2vh]">
        {/* تصویر پس‌زمینه */}
        <img
          src="/images/bg_support_dashboard.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          loading="lazy"
        />
        {/* کادرهای سه‌گانه با همان فواصل */}
        <div className="relative z-10 flex flex-col py-[4vh] sm:flex-row justify-center items-center gap-[1vh] sm:gap-[8vh] md:gap-[10vh] lg:gap-[10vh] px-[2vh] w-full ">
          {/* تیکت */}
          <div
            onClick={() => router.push("/dashboard/support/ticket")}
            className="flex flex-col justify-center items-center bg-white rounded-[20px] cursor-pointer shadow-lg hover:shadow-xl transition w-[70%] sm:w-[180px] md:w-[220px] lg:w-[260px] h-[15vh] sm:h-[180px] md:h-[220px] lg:h-[260px]"
          >
            <img
              src="/images/ticket_admin.svg"
              alt="تیکت"
              className="w-[8vh] h-[8vh] md:w-[12vh] md:h-[12vh]"
            />
            <span className="mt-[2vh] sm:mt-[4vh] text-[#143A62E5] font-semibold text-[2vh] md:text-[2.8vh]">
              تیکت
            </span>
          </div>

          {/* چت با ادمین */}
          <div
            onClick={handleChat}
            className="flex flex-col justify-center items-center bg-white rounded-[20px] cursor-point-er shadow-lg hover:shadow-xl transition w-[70%] sm:w-[180px] md:w-[220px] lg:w-[260px] h-[15vh] sm:h-[180px] md:h-[220px] lg:h-[260px]"
          >
            <img
              src="/images/chat_admin.svg"
              alt="چت"
              className="w-[8vh] h-[8vh] md:w-[12vh] md:h-[12vh]"
            />
            <span className="mt-[2vh] sm:mt-[4vh] text-[#143A62E5] font-semibold text-[2vh] md:text-[2.8vh]">
              چت با ادمین
            </span>
          </div>

          {/* تماس تلفنی */}
          <div
            onClick={handlePhone}
            className="flex flex-col justify-center items-center bg-white rounded-[20px] cursor-pointer shadow-lg hover:shadow-xl transition w-[70%] sm:w-[180px] md:w-[220px] lg:w-[260px] h-[15vh] sm:h-[180px] md:h-[220px] lg:h-[260px]"
          >
            <img
              src="/images/tel_admin.svg"
              alt="تماس"
              className="w-[8vh] h-[8vh] md:w-[12vh] md:h-[12vh]"
            />
            <span className="mt-[2vh] sm:mt-[4vh] text-[#143A62E5] font-semibold text-[2vh] md:text-[2.8vh]">
              تماس تلفنی
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportAdminOptions;
