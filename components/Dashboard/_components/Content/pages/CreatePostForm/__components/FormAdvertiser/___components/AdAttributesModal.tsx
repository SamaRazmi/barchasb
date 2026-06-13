"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import FloatingInput from "@/components/common/FloatingInput";
import { useFormStore } from "@/store/formStore";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "date";
}

interface ApiResponse {
  categoryName: string;
  fields: Field[];
}

interface AdAttributesModalProps {
  categoryName: string;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

const fetchCategoryAttributes = async (
  categoryName: string
): Promise<ApiResponse> => {
  const res = await fetch(
    `https://barchasb-server.liara.run/api/ad-category-attributes/${encodeURIComponent(
      categoryName
    )}`
  );

  if (!res.ok) {
    throw new Error("خطا در دریافت مشخصات دسته");
  }

  return res.json();
};

const AdAttributesModal: React.FC<AdAttributesModalProps> = ({
  categoryName,
  parentRef,
  onClose,
}) => {
  const { getFormData, setField } = useFormStore();
  const [values, setValues] = useState<Record<string, any>>({});
  const [parentRect, setParentRect] = useState<DOMRect | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ad-category-attributes", categoryName],
    queryFn: () => fetchCategoryAttributes(categoryName),
    enabled: Boolean(categoryName),
  });

  /* === Load existing attributes or reset if categoryName changed === */
  useEffect(() => {
    const advertiserData = getFormData("advertiser") as Record<string, any>;
    if (advertiserData?.attributesCategory !== categoryName) {
      // category جدید: پاک کردن مقادیر قبلی
      setValues({});
    } else if (advertiserData?.attributes) {
      try {
        const savedAttributes = JSON.parse(advertiserData.attributes);
        setValues(savedAttributes);
      } catch {
        setValues({});
      }
    }
  }, [categoryName, getFormData]);

  /* === calculate parent position === */
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
  }, [parentRef]);

  const handleChange = (fieldName: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleClose = () => {
    // Save attributes automatically in Form Store
    setField("advertiser", "attributes", JSON.stringify(values));
    setField("advertiser", "attributesCategory", categoryName); // ذخیره category فعلی برای تشخیص تغییر بعدی
    onClose();
  };

  if (isLoading || isError || !data || !parentRect) return null;

  return createPortal(
    <>
      {/* Overlay محدود به parent */}
      <div
        style={{
          position: "absolute",
          top: parentRect.top + window.scrollY,
          left: parentRect.left + window.scrollX,
          width: parentRect.width,
          height: parentRect.height,
          backgroundColor: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          borderRadius: "16px",
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "absolute",
          top: parentRect.top + window.scrollY + parentRect.height / 2,
          left: parentRect.left + window.scrollX + parentRect.width / 2,
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "30%",
          maxHeight: "80vh",
        }}
        className="bg-white rounded-xl overflow-y-auto"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-3 bg-gray-200 rounded-t-xl">
          <span className="font-bold text-lg" style={{ color: "#143A62" }}>
            مشخصات {data.categoryName}
          </span>

          <button onClick={handleClose} className="absolute left-4">
            <img src="/images/close-icon.svg" alt="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-[1.6vh] p-4">
          {data.fields.map((field) => (
            <FloatingInput
              key={field.name}
              placeholder={field.label}
              value={values[field.name] ?? ""}
              onChange={(val) => handleChange(field.name, val)}
              width="100%"
              height="6vh"
              activeLabelBg="white"
            />
          ))}
        </div>
      </div>
    </>,
    document.body
  );
};

export default AdAttributesModal;
