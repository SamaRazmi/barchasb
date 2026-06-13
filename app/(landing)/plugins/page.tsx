"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

type Tool = {
  id: number;
  title: string;
  dark: boolean;
  link: string;
};

const tools: Tool[] = [
  {
    id: 1,
    title: " رزومه ساز ",
    dark: true,
    link: "/dashboard/plugins/resume",
  },
  { id: 2, title: " آزمون ها ", dark: false, link: "/dashboard/plugins/tests" },
  {
    id: 3,
    title: " تبدیل ها ",
    dark: true,
    link: "/dashboard/plugins/converter",
  },
];
const ToolCard = ({ tool, onClick }: { tool: Tool; onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-end gap-5 transition-all duration-300 cursor-pointer
    shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105 
    px-4 py-2 md:px-5 md:py-3
    rounded-[20px] border-[1.5px] 
    min-w-[140px] md:min-w-[160px]
    ${
      tool.dark
        ? "bg-[#143A62] border-[#143A62] text-white"
        : "bg-white border-[#143A62] text-[#143A62]"
    }`}
  >
    <span className="text-[12px] md:text-base font-bold whitespace-nowrap">
      {tool.title}
    </span>
    <div
      className={`w-8 h-8 md:w-9 md:h-9 rounded-full shrink-0 transition-transform duration-300 ${
        tool.dark ? "bg-white" : "bg-[#143A62]"
      }`}
    ></div>
  </div>
);

export default function ToolsSection() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const handleToolClick = (link: string) => {
    if (isLoggedIn) {
      router.push(link);
    } else {
      router.push("/register");
    }
  };
  return (
    <section className="w-full bg-[#f8f9fa] py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto relative">
        {/* عنوان  */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#143A62] mb-2">
            ابزارهای کاربردی
          </h2>
          <p className="text-[#666] text-sm md:text-base">
            از ابزارهای تخصصی ما برای پیشرفت در مسیر شغلی خود استفاده کنید
          </p>
        </div>
        <div className="block md:hidden relative overflow-hidden">
          {/* هاله سمت چپ برای محو کردن کارت‌های خروجی */}
          <div
            className="absolute left-[-2px] top-0 bottom-0 w-14 z-20 pointer-events-none 
                  bg-gradient-to-r from-white via-white/80 to-transparent"
          ></div>

          <Swiper
            spaceBetween={12}
            slidesPerView={2.3}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            dir="rtl"
          >
            {tools.map((tool) => (
              <SwiperSlide key={tool.id} className="py-2">
                <ToolCard
                  tool={tool}
                  onClick={() => handleToolClick(tool.link)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* دسکتاپ → ساده */}
        <div className="hidden md:flex justify-center gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => handleToolClick(tool.link)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// const tools = [
//   { id: 1, title: " رزومه ساز ", dark: true },
//   { id: 2, title: " آزمون ها ", dark: false },
//   { id: 3, title: " تبدیل ها ", dark: true },
// ];
