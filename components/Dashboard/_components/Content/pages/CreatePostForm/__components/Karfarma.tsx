"use client";

import React, { useState } from "react";
import TopBar from "@/components/common/TopBar";
import FloatingInput from "@/components/common/FloatingInput";

const FormEmployee: React.FC = () => {
  const [activeMobileView, setActiveMobileView] = useState<
    "questions" | "ticket" | null
  >(null);

  // حالت موبایل
  if (activeMobileView) {
    return (
      <div className="relative flex flex-col h-full w-full bg-white z-10">
        <button
          onClick={() => setActiveMobileView(null)}
          className="absolute top-5 left-3 bg-gray-200 rounded w-max z-50"
        >
          <img src="/images/back_arrow.svg" alt="Back" width={25} height={25} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* TopBar فقط دسکتاپ */}
      <div className="hidden sm:block z-20 relative">
        <TopBar />
      </div>

      {/* محتوای اصلی */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] mt-4 px-3">
        {/* بک‌گراند رنگی */}
        <div
          className="absolute inset-0 w-full h-full rounded-[20px]"
          style={{ backgroundColor: "rgba(247, 247, 247, 0.98)", zIndex: 0 }}
        />

        {/* بک‌گراند تصویر */}
        <img
          src="/images/bg_support_formik_desk.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          style={{ zIndex: 1 }}
          loading="lazy"
        />

        {/* ستون‌ها */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-center items-start gap-6 sm:gap-[50px] md:gap-[80px] lg:gap-[110px] w-[66%]">
          {/* ستون اول */}
          <div className="flex flex-col gap-6 sm:w-1/2">
            <FloatingInput placeholder="عنوان پست" variant="input" />
            <FloatingInput placeholder="توضیح کوتاه" variant="input" />
            <FloatingInput placeholder="نظرات" variant="textarea" />
          </div>

          {/* ستون دوم */}
          <div className="flex flex-col gap-6 sm:w-1/2">
            <FloatingInput placeholder="توضیح اضافی" variant="textarea" />
            <FloatingInput placeholder="لینک مرتبط" variant="input" />
            <FloatingInput placeholder="یادداشت" variant="textarea" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEmployee;
