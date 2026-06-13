"use client";

import React, { useEffect, useState, useRef } from "react";
import { useFormStore } from "@/store/formStore";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";

interface AddAdsModalProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

interface Category {
  _id: string;
  name: string;
}

const fetchMainCategories = async () => {
  const res = await fetch(
    "https://barchasb-server.liara.run/api/ad-categories/main",
  );
  return res.json();
};

const fetchSubCategories = async (id: string) => {
  const res = await fetch(
    `https://barchasb-server.liara.run/api/ad-categories/${id}/subcategories`,
  );
  return res.json();
};

const AddAdsModal: React.FC<AddAdsModalProps> = ({ onClose, parentRef }) => {
  const [parentRect, setParentRect] = useState<DOMRect | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [tempCategory, setTempCategory] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const setField = useFormStore((state) => state.setField);

  /* ================= KEYBOARD SCROLL ================= */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      const scrollAmount = 100; // مقدار حرکت با فلش
      const pageScrollAmount = containerRef.current.clientHeight; // مقدار PageUp / PageDown

      switch (e.key) {
        case "ArrowDown":
          containerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          containerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          containerRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          containerRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ====================== OBSERVE PARENT ====================== */
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
  }, [parentRef.current]);

  const { data: mainData } = useQuery({
    queryKey: ["main-categories"],
    queryFn: fetchMainCategories,
    enabled: !selectedCategoryId,
  });

  const { data: subData } = useQuery({
    queryKey: ["sub-categories", selectedCategoryId],
    queryFn: () => fetchSubCategories(selectedCategoryId!),
    enabled: !!selectedCategoryId,
  });

  if (!parentRect) return null;

  const categories: Category[] = selectedCategoryId
    ? subData?.category?.subCategories || []
    : mainData?.categories || [];

  const handleClose = () => {
    if (selectedCategoryName && tempCategory) {
      setField(
        "advertiser",
        "category",
        `${selectedCategoryName} / ${tempCategory}`,
      );
    } else if (selectedCategoryName) {
      setField("advertiser", "category", selectedCategoryName);
    }
    onClose();
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
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
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: parentRect.top + window.scrollY + parentRect.height / 2,
          left: parentRect.left + window.scrollX + parentRect.width / 2,
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: window.innerWidth < 640 ? parentRect.width * 0.8 : "32%",
          height: window.innerWidth < 640 ? parentRect.height * 0.8 : "75%",
        }}
        className="bg-white rounded-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex justify-center items-center"
          style={{
            backgroundColor: "#E5E7EB",
            fontSize: window.innerWidth < 640 ? "1.7vh" : "2vh",
          }}
        >
          <button onClick={handleClose} className="absolute left-3 w-6 h-6">
            <img src="/images/close-icon.svg" alt="close" />
          </button>
          <span className="font-bold" style={{ color: "#143A62" }}>
            انتخاب دسته آگهی‌ها
          </span>
        </div>

        {/* Body */}
        <div
          className="flex-1 p-4"
          style={{ overflow: "hidden", cursor: "grab" }}
          ref={containerRef}
          onMouseDown={(e) => {
            setDragOffset(e.clientY);
            const handleDrag = (e: MouseEvent) => {
              if (containerRef.current) {
                const delta = dragOffset - e.clientY;
                containerRef.current.scrollTop = Math.max(
                  0,
                  containerRef.current.scrollTop + delta,
                );
                setDragOffset(e.clientY);
              }
            };
            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleDrag);
              document.removeEventListener("mouseup", handleMouseUp);
            };
            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", handleMouseUp);
          }}
          onTouchStart={(e) => setDragOffset(e.touches[0].clientY)}
          onTouchMove={(e) => {
            if (containerRef.current) {
              const delta = dragOffset - e.touches[0].clientY;
              containerRef.current.scrollTop = Math.max(
                0,
                containerRef.current.scrollTop + delta,
              );
              setDragOffset(e.touches[0].clientY);
            }
          }}
          onWheel={(e) => {
            if (containerRef.current)
              containerRef.current.scrollTop += e.deltaY;
          }}
        >
          {selectedCategoryId && (
            <div
              onClick={() => {
                setSelectedCategoryId(null);
                setSelectedCategoryName(null);
                setTempCategory(null);
              }}
              className="mb-4 text-right cursor-pointer rounded-[10px] px-4 py-2 w-[80%] sm:w-[60%] whitespace-nowrap"
              style={{
                backgroundColor: "#E5E7EB",
                color: "#143A62",
                fontSize: window.innerWidth < 640 ? "1.5vh" : "1.8vh",
              }}
            >
              بازگشت به انتخاب دسته ←
            </div>
          )}

          <div className="flex flex-col gap-3">
            {categories.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  if (!selectedCategoryId) {
                    setSelectedCategoryName(item.name);
                    setSelectedCategoryId(item._id);
                  } else {
                    setTempCategory(item.name);
                    setField(
                      "advertiser",
                      "category",
                      `${selectedCategoryName} / ${item.name}`,
                    );
                    onClose();
                  }
                }}
                className="text-right rounded-[10px] px-4 py-3 transition-all duration-200 cursor-pointer relative overflow-hidden"
                style={{
                  backgroundColor: "#E5E7EB",
                  color: "#143A62",
                  fontSize: window.innerWidth < 640 ? "1.7vh" : "2vh",
                  left: 0,
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  const div = e.currentTarget;
                  const movePercent = 10;
                  div.style.transformOrigin = "left";
                  div.style.transform = `translateX(-${movePercent}%)`;
                  div.style.width = `calc(100% - ${movePercent}%)`;
                  div.style.backgroundColor = "#D1D5DB";
                }}
                onMouseLeave={(e) => {
                  const div = e.currentTarget;
                  div.style.transformOrigin = "left";
                  div.style.transform = "translateX(0)";
                  div.style.width = "100%";
                  div.style.backgroundColor = "#E5E7EB";
                }}
              >
                <span style={{ display: "block" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default AddAdsModal;
