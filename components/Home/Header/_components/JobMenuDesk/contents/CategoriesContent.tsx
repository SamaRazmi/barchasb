"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMainCategories,
  fetchSubCategories,
  Category,
} from "@/api/apiCategories";

const CategoriesContent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["main-categories"],
    queryFn: fetchMainCategories,
  });

  // state برای نگهداری parentId باز (در هر لحظه فقط یک دسته می‌تواند باز باشد)
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  // کش کردن زیردسته‌های fetch شده برای هر دسته (اختیاری)
  const [subCategoriesCache, setSubCategoriesCache] = useState<
    Record<string, Category[]>
  >({});
  // وضعیت بارگذاری زیردسته
  const [loadingSub, setLoadingSub] = useState<string | null>(null);

  // آرایش دسته‌های اصلی در ۴ ستون
  const [columns, setColumns] = useState<Category[][]>([[], [], [], []]);

  useEffect(() => {
    if (data?.categories) {
      const cols: Category[][] = [[], [], [], []];
      data.categories.forEach((cat, index) => {
        cols[index % 4].push(cat);
      });
      setColumns(cols);
    }
  }, [data]);

  const handleMainClick = async (cat: Category) => {
    // اگر همان دسته قبلاً باز بوده، آن را ببند
    if (openCategoryId === cat._id) {
      setOpenCategoryId(null);
      return;
    }

    // اگر قبلاً زیردسته‌های این دسته را fetch کرده‌ایم، فقط بازش می‌کنیم
    if (subCategoriesCache[cat._id]) {
      setOpenCategoryId(cat._id);
      return;
    }

    // در غیر این صورت fetch می‌کنیم
    setLoadingSub(cat._id);
    try {
      const result = await fetchSubCategories(cat._id);
      setSubCategoriesCache((prev) => ({
        ...prev,
        [cat._id]: result.categories,
      }));
      setOpenCategoryId(cat._id);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingSub(null);
    }
  };

  if (isLoading)
    return <div className="text-white">در حال بارگذاری دسته‌ها...</div>;
  if (isError) return <div className="text-red-400">خطا در دریافت دسته‌ها</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-[1.5vh]">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-[2.2vh]">
          {col.map((cat) => (
            <div key={cat._id}>
              {/* عنوان دسته اصلی */}
              <div
                onClick={() => handleMainClick(cat)}
                className="text-[#00B6FF] font-bold mb-[1vh] cursor-pointer"
                style={{ opacity: 0.8 }}
              >
                {cat.name}
              </div>
              {/* خط زیر عنوان */}
              <div className="w-full h-[1px] bg-[#D9D9D9] mb-[1vh]"></div>
              {/* زیردسته‌ها – فقط در صورت باز بودن و وجود داده نشان داده شوند */}
              {openCategoryId === cat._id && (
                <div className="flex flex-col gap-[0.6vh] mt-1">
                  {loadingSub === cat._id ? (
                    <span className="text-white text-sm">
                      در حال بارگذاری...
                    </span>
                  ) : (
                    subCategoriesCache[cat._id]?.map((sub) => (
                      <span
                        key={sub._id}
                        onClick={() => console.log("Clicked skill:", sub.name)}
                        className="text-white font-semibold text-[1.8vh] cursor-pointer hover:text-[#00B6FF] hover:text-[2vh] transition-colors"
                      >
                        {sub.name}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategoriesContent;
