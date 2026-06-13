"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import FloatingInput from "@/components/common/FloatingInput";
import FloatingSelect from "@/components/common/FloatingSelect";
import { useFormStore } from "@/store/formStore";

interface OtherFeaturesModalProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onSave?: () => void;
  initialDataFromApi?: EmployerData;
}

interface EmployerData {
  companyName?: string;
  companyType?: string;
  benefits?: string;
  insurance?: string;
  education?: string;
  [key: string]: any;
}

const insuranceOptions = [
  { label: "سازمان تامین اجتماعی", value: "social" },
  { label: "بیمه تکمیلی", value: "supplementary" },
  { label: "بیمه عمر", value: "life" },
  { label: "بیمه مسئولیت", value: "liability" },
  { label: "سایر", value: "other" },
];
const companyTypes = [
  { label: "سهامی خاص", value: "private_joint" },
  { label: "سهامی عام", value: "public_joint" },
  { label: "مسئولیت محدود", value: "limited_liability" },
  { label: "دانش بنیان", value: "knowledge_based" },
  { label: "هیئت امنایی", value: "board_trustees" },
  { label: "مشارکتی", value: "partnership" },
  { label: "دولتی", value: "government" },
  { label: "سایر", value: "other" },
];

const benefitsOptions = [
  { label: "پاداش", value: "bonus" },
  { label: "ناهار", value: "lunch" },
  { label: "ساعت کاری منعطف", value: "flexible_hours" },
  { label: "کمک هزینه آموزشی", value: "education_allowance" },
  { label: "امکان پیشرفت شغلی", value: "career_growth" },
  { label: "اتاق بازی", value: "game_room" },
  { label: "قهوه رایگان", value: "free_coffee" },
];

const educationOptions = [
  { label: "کاردانی", value: "associate" },
  { label: "کارشناسی", value: "bachelor" },
  { label: "کارشناسی ارشد", value: "master" },
  { label: "فرقی نمیکند", value: "any" },
  { label: "سایر", value: "other" },
];

const OtherFeaturesModal: React.FC<OtherFeaturesModalProps> = ({
  onClose,
  parentRef,
  onSave,
  initialDataFromApi,
}) => {
  const [parentRect, setParentRect] = useState<DOMRect | null>(null);

  const { getFormData, setField } = useFormStore();
  const employerData = getFormData("employer") as EmployerData;

  const [companyName, setCompanyName] = useState(
    initialDataFromApi?.companyName ?? employerData?.companyName ?? "",
  );
  const [companyType, setCompanyType] = useState(
    initialDataFromApi?.companyType ?? employerData?.companyType ?? "",
  );
  const [benefits, setBenefits] = useState(
    initialDataFromApi?.benefits ?? employerData?.benefits ?? "",
  );
  const [insurance, setInsurance] = useState(
    initialDataFromApi?.insurance ?? employerData?.insurance ?? "",
  );
  const [education, setEducation] = useState(
    initialDataFromApi?.education ?? employerData?.education ?? "",
  );

  const listRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);

  // Drag & scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientY);
    const handleMouseMove = (ev: MouseEvent) => {
      if (listRef.current && dragStart !== null) {
        listRef.current.scrollTop += dragStart - ev.clientY;
        setDragStart(ev.clientY);
      }
    };
    const handleMouseUp = () => {
      setDragStart(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleTouchStart = (e: React.TouchEvent) =>
    setDragStart(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (listRef.current && dragStart !== null) {
      listRef.current.scrollTop += dragStart - e.touches[0].clientY;
      setDragStart(e.touches[0].clientY);
    }
  };

  const handleClose = () => {
    setField("employer", "companyName", companyName);
    setField("employer", "companyType", companyType);
    setField("employer", "benefits", benefits);
    setField("employer", "insurance", insurance);
    setField("employer", "education", education);

    if (onSave) onSave(); // اینجا

    onClose();
  };

  useEffect(() => {
    if (!parentRef.current) return;
    const updateRect = () =>
      setParentRect(parentRef.current!.getBoundingClientRect());
    updateRect();
    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(parentRef.current);
    window.addEventListener("scroll", updateRect);
    window.addEventListener("resize", updateRect);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [parentRef]);

  if (!parentRect) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: parentRect.top + window.scrollY,
          left: parentRect.left + window.scrollX,
          width: parentRect.width,
          height: parentRect.height,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.1)",
          zIndex: 1000,
          borderRadius: "20px",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "absolute",
          top: parentRect.top + window.scrollY + parentRect.height / 2,
          left: parentRect.left + window.scrollX + parentRect.width / 2,
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "35%",
          maxWidth: "500px",
          height: "75%",
          backgroundColor: "white",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex justify-center items-center relative"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <button onClick={handleClose} className="absolute left-3 w-6 h-6">
            <img src="/images/close-icon.svg" alt="close" />
          </button>
          <span className="font-bold text-lg" style={{ color: "#143A62" }}>
            سایر ویژگی‌ها و امکانات
          </span>
        </div>

        {/* Content */}
        <div
          ref={listRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{
            overflow: "hidden",
            padding: "16px",
            flex: 1,
            cursor: "grab",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // مرکز افقی
            gap: "16px",
          }}
        >
          <FloatingInput
            placeholder="نام شرکت"
            value={companyName}
            onChange={setCompanyName}
            width="95%" // استفاده از ویژگی داخلی کامپوننت
          />
          <FloatingSelect
            placeholder="نوع شرکت"
            options={companyTypes}
            value={companyType}
            onChange={(val) => setCompanyType(String(val))}
            width="95%"
          />
          <FloatingSelect
            placeholder="مزایا"
            options={benefitsOptions}
            value={benefits}
            onChange={(val) => setBenefits(String(val))}
            width="95%"
          />
          <FloatingSelect
            placeholder="بیمه"
            options={insuranceOptions}
            value={insurance}
            onChange={(val) => setInsurance(String(val))}
            width="95%"
          />
          <FloatingSelect
            placeholder="تحصیلات"
            options={educationOptions}
            value={education}
            onChange={(val) => setEducation(String(val))}
            width="95%"
          />
        </div>
      </div>
    </>,
    document.body,
  );
};

export default OtherFeaturesModal;
