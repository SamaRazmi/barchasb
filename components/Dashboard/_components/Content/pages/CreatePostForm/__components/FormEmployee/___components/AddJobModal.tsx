"use client";
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useFormStore } from "@/store/formStore";

interface AddJobModalProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
  onSelectCategories?: (
    selected: Array<{ name: string; subCategories: string[] }>,
  ) => void;
}

interface Category {
  _id: string;
  name: string;
  parentId?: string;
}

const API_BASE = "https://barchasb-server.liara.run/api";

const fetchMainCategories = async () => {
  const res = await fetch(`${API_BASE}/job-categories/main`);
  return res.json();
};

const fetchSubCategories = async (parentId: string) => {
  const res = await fetch(
    `${API_BASE}/job-categories/sub?parentId=${parentId}`,
  );
  return res.json();
};

const searchSubCategories = async (keyword: string) => {
  const res = await fetch(
    `${API_BASE}/job-categories/search-sub?keyword=${keyword}`,
  );
  return res.json();
};

const fetchCategoryById = async (id: string) => {
  const res = await fetch(`${API_BASE}/job-categories/${id}`);
  return res.json();
};

const AddJobModal: React.FC<AddJobModalProps> = ({
  onClose,
  parentRef,
  onSelectCategories,
}) => {
  const [parentRect, setParentRect] = useState<DOMRect | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [selectedMainName, setSelectedMainName] = useState<string>("");
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [dragStart, setDragStart] = useState<number | null>(null);

  // لیست دسته‌های اصلی انتخاب‌شده (نهایی)
  const [selectedCategoriesList, setSelectedCategoriesList] = useState<
    { name: string; subCategories: string[] }[]
  >([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const setField = useFormStore((state) => state.setField);
  const getFormData = useFormStore((state) => state.getFormData);

  // تشخیص صفحه‌نمایش موبایل (عرض کمتر از 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // اسکرول با صفحه کلید
  useEffect(() => {
    const handleKeyScroll = (e: KeyboardEvent) => {
      if (!listRef.current) return;
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName === "INPUT") return;
      const scrollAmount = 50;
      const pageScrollAmount = listRef.current.clientHeight;
      switch (e.key) {
        case "ArrowDown":
          listRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          listRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          listRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          listRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyScroll);
    return () => document.removeEventListener("keydown", handleKeyScroll);
  }, []);

  // خواندن داده‌های قبلی از store (برای ویرایش)
  const employerData = getFormData("employer") as any;
  useEffect(() => {
    if (employerData?.categories && Array.isArray(employerData.categories)) {
      setSelectedCategoriesList(employerData.categories);
    }
  }, [employerData]);

  // کوئری دسته‌های اصلی
  const { data: mainData } = useQuery({
    queryKey: ["main-categories"],
    queryFn: fetchMainCategories,
  });
  const mainCategories = mainData?.categories || [];

  // کوئری زیردسته‌ها
  const { data: subData } = useQuery({
    queryKey: ["sub-categories", selectedMainId],
    queryFn: () => fetchSubCategories(selectedMainId!),
    enabled: !!selectedMainId && !searchTerm,
  });
  const subCategories = subData?.categories || [];

  // کوئری جستجو
  const { data: searchData } = useQuery({
    queryKey: ["search-sub", searchTerm],
    queryFn: () => searchSubCategories(searchTerm),
    enabled: !!searchTerm,
  });
  const searchResults = searchData?.categories || [];

  let displayItems: Category[] = [];
  if (searchTerm) {
    displayItems = searchResults;
  } else if (selectedMainId) {
    displayItems = subCategories;
  } else {
    displayItems = mainCategories;
  }

  // محاسبه موقعیت مودال
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

  const toggleSubCategory = (name: string) => {
    setSelectedSubs((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handleSelectMain = (id: string, name: string) => {
    setSelectedMainId(id);
    setSelectedMainName(name);
    setSelectedSubs([]);
    setSearchTerm("");
  };

  const handleBackToMain = () => {
    setSelectedMainId(null);
    setSelectedMainName("");
    setSelectedSubs([]);
    setSearchTerm("");
  };

  const handleSelectSubFromSearch = async (subItem: Category) => {
    if (!subItem.parentId) return;
    try {
      const parentData = await fetchCategoryById(subItem.parentId);
      const parentName = parentData.category?.name || "";
      if (parentName) {
        setSelectedMainId(subItem.parentId);
        setSelectedMainName(parentName);
        setSelectedSubs((prev) =>
          prev.includes(subItem.name) ? prev : [...prev, subItem.name],
        );
        setSearchTerm("");
      }
    } catch (err) {
      console.error("خطا در دریافت دسته اصلی:", err);
    }
  };

  // افزودن دسته فعلی به لیست نهایی
  const addCurrentCategory = () => {
    if (!selectedMainName) return;
    // بررسی عدم تکراری بودن دسته اصلی
    if (selectedCategoriesList.some((cat) => cat.name === selectedMainName)) {
      alert("این دسته اصلی قبلاً اضافه شده است.");
      return;
    }
    const newCategory = {
      name: selectedMainName,
      subCategories: [...selectedSubs],
    };
    setSelectedCategoriesList((prev) => [...prev, newCategory]);
    // ریست انتخاب فعلی برای افزودن دسته بعدی
    setSelectedMainId(null);
    setSelectedMainName("");
    setSelectedSubs([]);
    setSearchTerm("");
  };

  const removeCategory = (index: number) => {
    setSelectedCategoriesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    // ذخیره در store و ارسال به والد
    setField("employer", "categories", selectedCategoriesList);
    onSelectCategories?.(selectedCategoriesList);
    onClose();
  };

  // درگ و اسکرول (بدون تغییر)
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
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (listRef.current) listRef.current.scrollTop += e.deltaY;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalRef, selectedCategoriesList]);

  if (!parentRect) return null;

  return createPortal(
    <>
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
      <div
        ref={modalRef}
        style={{
          position: "absolute",
          top: parentRect.top + window.scrollY + parentRect.height / 2,
          left: parentRect.left + window.scrollX + parentRect.width / 2,
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          // در حالت موبایل عرض و ارتفاع را ۸۵٪ والد قرار بده
          ...(isMobile && {
            width: `${parentRect.width * 0.9}px`,
            height: `${parentRect.height * 0.9}px`,
          }),
        }}
        className="bg-white rounded-xl flex flex-col overflow-hidden w-[75%] sm:w-[55%] md:w-[35%] h-[50%] sm:h-[65%] md:h-[75%]"
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex justify-center items-center relative"
          style={{ backgroundColor: "#E5E7EB" }}
        >
          <button onClick={handleClose} className="absolute left-3 w-6 h-6">
            <img src="/images/close-icon.svg" alt="close" />
          </button>
          <span
            className="font-bold"
            style={{ color: "#143A62", fontSize: "2vh" }}
          >
            انتخاب دسته شغلی
          </span>
        </div>

        {/* لیست دسته‌های انتخاب شده (نهایی) */}
        {selectedCategoriesList.length > 0 && (
          <div className="px-4 pt-2 border-b border-gray-200">
            <div className="text-sm text-gray-600 mb-1">
              دسته‌های انتخاب شده:
            </div>
            {selectedCategoriesList.map((cat, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-100 rounded px-2 py-1 mb-1"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => removeCategory(idx)}
                  className="text-red-500 text-xs"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}

        {/* انتخاب دسته اصلی جدید */}
        <div className="px-4 pt-2 text-sm text-gray-600">
          {!selectedMainName
            ? "انتخاب دسته اصلی جدید:"
            : `در حال انتخاب زیردسته‌های: ${selectedMainName}`}
        </div>

        {/* نمایش دسته اصلی انتخاب شده */}
        {selectedMainName && !searchTerm && (
          <div className="px-4 pt-2 text-center text-sm text-gray-600">
            دسته اصلی فعلی: <strong>{selectedMainName}</strong>
          </div>
        )}

        {/* جستجو */}
        <div className="px-4 py-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="جستجو در زیردسته‌ها ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value) setSelectedMainId(null);
            }}
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>

        {/* دکمه بازگشت */}
        {!searchTerm && selectedMainId && (
          <div className="px-4 pt-2">
            <button
              onClick={handleBackToMain}
              className="mb-[1vh] text-right cursor-pointer rounded-[10px] px-4 py-2 w-[80%] sm:w-[60%] whitespace-nowrap"
              style={{
                backgroundColor: "#E5E7EB",
                color: "#143A62",
                fontSize: "1.8vh",
              }}
            >
              ← بازگشت به دسته‌های اصلی
            </button>
          </div>
        )}

        {/* لیست دسته‌ها / زیردسته‌ها */}
        <div
          ref={listRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onWheel={handleWheel}
          className="flex-1 p-4 flex flex-col gap-3"
          style={{
            cursor: dragStart !== null ? "grabbing" : "grab",
            overflow: "hidden",
          }}
        >
          {displayItems.length === 0 && !searchTerm && !selectedMainId && (
            <div className="text-center text-gray-500 mt-4">
              هیچ دسته اصلی یافت نشد
            </div>
          )}
          {displayItems.length === 0 && searchTerm && (
            <div className="text-center text-gray-500 mt-4">
              نتیجه‌ای یافت نشد
            </div>
          )}
          {displayItems.map((item) => {
            const isMainCategoryMode = !searchTerm && !selectedMainId;
            if (isMainCategoryMode) {
              return (
                <div
                  key={item._id}
                  onClick={() => handleSelectMain(item._id, item.name)}
                  className="flex items-center justify-between text-right rounded-[10px] px-4 py-4 cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: "#E5E7EB",
                    color: "#143A62",
                    fontSize: "2vh",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#D1D5DB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#E5E7EB")
                  }
                >
                  <span className="flex-1">{item.name}</span>
                  <span className="text-gray-500 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </span>
                </div>
              );
            } else {
              return (
                <label
                  key={item._id}
                  className="flex items-center justify-between text-right rounded-[10px] px-4 py-3"
                  style={{
                    backgroundColor: "#E5E7EB",
                    color: "#143A62",
                    fontSize: "2vh",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubs.includes(item.name)}
                    onChange={() => {
                      if (searchTerm && !selectedMainId) {
                        handleSelectSubFromSearch(item);
                      } else {
                        toggleSubCategory(item.name);
                      }
                    }}
                    className="ml-2"
                  />
                  <span className="flex-1">{item.name}</span>
                </label>
              );
            }
          })}
        </div>

        {/* دکمه افزودن دسته فعلی به لیست */}
        {selectedMainName && (
          <div className="px-4 py-2 border-t border-gray-200">
            <button
              onClick={addCurrentCategory}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              افزودن این دسته به لیست
            </button>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
};

export default AddJobModal;
