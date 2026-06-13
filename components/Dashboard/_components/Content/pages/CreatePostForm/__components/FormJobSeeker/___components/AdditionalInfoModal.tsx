"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FloatingSelect from "@/components/common/FloatingSelect";
import FloatingInput from "@/components/common/FloatingInput";
import { useFormStore } from "@/store/formStore";

interface AdditionalInfoModalProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onSave: (value: string) => void; // ✅ اجباری شد
}

const AdditionalInfoModal: React.FC<AdditionalInfoModalProps> = ({
  onClose,
  parentRef,
  onSave,
}) => {
  const { getFormData, setField } = useFormStore();
  const jobSeekerData = getFormData("jobSeeker") as Record<string, any>;

  const [state, setState] = useState({
    maritalStatus: jobSeekerData?.maritalStatus || "",
    gender: jobSeekerData?.gender || "",
    militaryStatus: jobSeekerData?.militaryStatus || "",
    instagram: jobSeekerData?.instagram || "",
    linkedin: jobSeekerData?.linkedin || "",
    github: jobSeekerData?.github || "",
  });

  const [parentRect, setParentRect] = useState<DOMRect | null>(null);

  const maritalOptions = [
    { label: "مجرد", value: "single" },
    { label: "متاهل", value: "married" },
  ];

  const genderOptions = [
    { label: "زن", value: "female" },
    { label: "مرد", value: "male" },
  ];

  const militaryOptions = [
    { label: "معاف", value: "exempt" },
    { label: "پایان خدمت", value: "completed" },
    { label: "نگذرانده", value: "not_done" },
  ];

  const handleClose = () => {
    console.log("Current state:", state); // 🔹 اضافه شد
    console.log("onSave function exists?", !!onSave); // 🔹 اضافه شد

    // ذخیره بقیه فیلدها در zustand
    Object.entries(state).forEach(([key, value]) => {
      if (value) setField("jobSeeker", key, value);
    });

    // ارسال مقدار combined برای فرم اصلی (مثلاً otherDetails)
    if (onSave) {
      const otherDetails = `${state.maritalStatus}, ${state.gender}, ${state.militaryStatus}`;
      console.log("Calling onSave with:", otherDetails); // 🔹 اضافه شد
      onSave(otherDetails);
    }

    onClose();
  };

  useEffect(() => {
    if (!parentRef.current) return;

    const updateRect = () => {
      if (!parentRef.current) return;
      setParentRect(parentRef.current.getBoundingClientRect());
    };

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
    // فقط parentRef.current به عنوان وابستگی
  }, [parentRef.current]);

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
          pointerEvents: "auto",
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
          pointerEvents: "auto",
          width: "30%",
          height: "72%",
        }}
        className="bg-white rounded-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gray-200 px-4 py-2 flex justify-center items-center w-full">
          <button
            onClick={handleClose}
            className="absolute left-2 w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <img src="/images/close-icon.svg" alt="close" className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold">سایر مشخصات</span>
        </div>

        {/* FloatingSelects */}
        <div className="flex flex-col items-center mt-6 gap-4">
          <FloatingSelect
            placeholder="وضعیت تاهل"
            options={maritalOptions}
            width="95%"
            height="6vh"
            value={state.maritalStatus}
            onChange={(value) =>
              setState((prev) => ({ ...prev, maritalStatus: value }))
            }
          />
          <FloatingSelect
            placeholder="جنسیت"
            options={genderOptions}
            width="95%"
            height="6vh"
            value={state.gender}
            onChange={(value) =>
              setState((prev) => ({ ...prev, gender: value }))
            }
          />
          <FloatingSelect
            placeholder="وضعیت نظام وظیفه"
            options={militaryOptions}
            width="95%"
            height="6vh"
            value={state.militaryStatus}
            onChange={(value) =>
              setState((prev) => ({ ...prev, militaryStatus: value }))
            }
          />
        </div>

        {/* FloatingInputs */}
        <div className="flex flex-col items-center mt-6 gap-4">
          <FloatingInput
            placeholder="اینستاگرام"
            width="95%"
            height="6vh"
            value={state.instagram}
            activeLabelBg="white"
            onChange={(value) =>
              setState((prev) => ({ ...prev, instagram: value }))
            }
            inputType="urlFriendly"
          />
          <FloatingInput
            placeholder="لینکدین"
            width="95%"
            height="6vh"
            value={state.linkedin}
            activeLabelBg="white"
            onChange={(value) =>
              setState((prev) => ({ ...prev, linkedin: value }))
            }
            inputType="urlFriendly"
          />
          <FloatingInput
            placeholder="گیت‌هاب"
            width="95%"
            height="6vh"
            value={state.github}
            activeLabelBg="white"
            onChange={(value) =>
              setState((prev) => ({ ...prev, github: value }))
            }
            inputType="urlFriendly"
          />
        </div>
      </div>
    </>,
    document.body
  );
};

export default AdditionalInfoModal;
