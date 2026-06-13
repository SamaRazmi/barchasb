"use client";

import React, { useState } from "react";
import TopBar from "@/components/common/TopBar";
import FormEmployee1 from "./___components/FormEmployee1";
import { PersonProvider } from "@/context/PersonContext";

interface FormEmployeeProps {
  onClose?: () => void; // برای هر جا که بخواهیم از بیرون Close بدهیم
}

const FormEmployee: React.FC<FormEmployeeProps> = ({ onClose }) => {
  const [activeMobileView, setActiveMobileView] = useState<
    "questions" | "ticket" | null
  >(null);

  // تابع Close داخلی
  const handleClose = () => {
    if (onClose) onClose(); // اگر prop خارجی تعریف شده بود اجرا شود
    setActiveMobileView(null); // در حالت موبایل هم فرم بسته شود
  };

  // حالت موبایل: وقتی فرم نمایش داده شده، امکان Close داریم
  if (activeMobileView) {
    return (
      <div className="relative flex flex-col h-full w-full bg-white z-10">
        <button
          onClick={handleClose}
          className="absolute top-5 left-3 bg-gray-200 rounded w-max z-50"
        >
          <img src="/images/back_arrow.svg" alt="Back" width={25} height={25} />
        </button>

        <PersonProvider>
          <FormEmployee1 onClose={handleClose} />
        </PersonProvider>
      </div>
    );
  }

  // حالت دسکتاپ
  return (
    <div className="relative h-full w-full">
      <PersonProvider>
        {/* TopBar فقط دسکتاپ */}
        <div className="hidden sm:block z-20 relative">
          <TopBar />
        </div>

        {/* فرم با prop onClose */}
        <FormEmployee1 onClose={handleClose} />
      </PersonProvider>
    </div>
  );
};

export default FormEmployee;
