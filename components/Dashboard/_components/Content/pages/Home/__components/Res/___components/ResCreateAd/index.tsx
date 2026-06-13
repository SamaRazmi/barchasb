"use client";

import React from "react";

import FormEmployee from "@/components/Dashboard/_components/Content/pages/CreatePostForm/__components/FormEmployee";
import FormJobSeeker from "@/components/Dashboard/_components/Content/pages/CreatePostForm/__components/FormJobSeeker";
import FormAdvertiser from "@/components/Dashboard/_components/Content/pages/CreatePostForm/__components/FormAdvertiser";
import DigitalProjects from "@/components/Dashboard/_components/Content/pages/CreatePostForm/__components/DigitalProjects";

interface ResCreateAdProps {
  selectedForm?: "karfarma" | "karjoo" | "ads" | "digital";
  onSelectOption: (type: "karfarma" | "karjoo" | "ads" | "digital") => void;
}

const ResCreateAd: React.FC<ResCreateAdProps> = ({
  selectedForm,
  onSelectOption,
}) => {
  // اگر فرم مشخص شده باشد، همان فرم را نمایش بده
  const renderForm = () => {
    switch (selectedForm) {
      case "karfarma":
        return <FormEmployee onClose={() => onSelectOption("karfarma")} />;
      case "karjoo":
        return <FormJobSeeker onClose={() => onSelectOption("karjoo")} />;
      case "ads":
        return <FormAdvertiser onClose={() => onSelectOption("ads")} />;
      case "digital":
        return <DigitalProjects onClose={() => onSelectOption("digital")} />;
      default:
        return null;
    }
  };

  if (selectedForm) return renderForm();

  // اگر هنوز فرم انتخاب نشده، صفحه گزینه‌ها را نمایش می‌دهیم
  return (
    <div className="w-full h-[84%] bg-white flex flex-col items-center justify-center py-4 mt-6 mb-2 rounded-xl gap-2">
      <div className="w-[75%] bg-[#C8DAFA] rounded-xl py-4 flex items-center justify-center">
        <span className="font-bold" style={{ fontSize: "3vh" }}>
          ثبت آگهی به عنوان
        </span>
      </div>

      <div
        className="w-[75%] bg-[#DEE9FF] rounded-xl py-4 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"
        onClick={() => onSelectOption("karfarma")}
      >
        <span className="font-semibold" style={{ fontSize: "2.2vh" }}>
          کارفرما
        </span>
      </div>

      <div
        className="w-[75%] bg-[#DEE9FF] rounded-xl py-4 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"
        onClick={() => onSelectOption("karjoo")}
      >
        <span className="font-semibold" style={{ fontSize: "2.2vh" }}>
          کارجو
        </span>
      </div>

      <div
        className="w-[75%] bg-[#DEE9FF] rounded-xl py-4 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"
        onClick={() => onSelectOption("ads")}
      >
        <span className="font-semibold" style={{ fontSize: "2.2vh" }}>
          آگهی گذار
        </span>
      </div>

      <div
        className="w-[75%] bg-[#DEE9FF] rounded-xl py-4 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition"
        onClick={() => onSelectOption("digital")}
      >
        <span className="font-semibold" style={{ fontSize: "2.2vh" }}>
          آگهی دیجیتال
        </span>
      </div>
    </div>
  );
};

export default ResCreateAd;
