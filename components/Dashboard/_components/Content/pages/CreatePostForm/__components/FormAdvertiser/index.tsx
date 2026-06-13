"use client";

import React, { useState } from "react";
import TopBar from "@/components/common/TopBar";
import FormAdvertiser1 from "./___components/FormAdvertiser1";
import { PersonProvider } from "@/context/PersonContext";

interface FormAdvertiserProps {
  onClose?: () => void; // اضافه شده
}

const FormAdvertiser: React.FC<FormAdvertiserProps> = ({ onClose }) => {
  const [activeMobileView, setActiveMobileView] = useState<
    "questions" | "ticket" | null
  >(null);

  // تابع داخلی برای Close
  const handleClose = () => {
    if (onClose) onClose(); // اگر prop خارجی پاس داده شده بود اجرا شود
    setActiveMobileView(null); // حالت موبایل بسته شود
  };

  // حالت موبایل
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
          <FormAdvertiser1 onClose={handleClose} />
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
        <FormAdvertiser1 onClose={handleClose} />
      </PersonProvider>
    </div>
  );
};

export default FormAdvertiser;
