"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFilters } from "@/context/FiltersContext";

type Category = {
  _id: string;
  name: string;
};

type ApiResponse = {
  status: string;
  categories: Category[];
};

const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get<ApiResponse>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/ad-categories/main`,
  );
  if (res.data.status === "success" && Array.isArray(res.data.categories)) {
    return res.data.categories;
  }
  return [];
};

export default function CategorySelect() {
  const { filters, setFilters } = useFilters();
  // حالا selectedCategory مستقیماً اسم دسته است (نه id)
  const selectedCategoryName = filters.kiosk.selectedCategory?.[0] || "";

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFilters((prev) => ({
        ...prev,
        kiosk: { ...prev.kiosk, selectedCategory: [] },
      }));
      return;
    }
    const selectedCat = categories.find((cat) => cat._id === selectedId);
    const selectedName = selectedCat?.name || "";
    setFilters((prev) => ({
      ...prev,
      kiosk: {
        ...prev.kiosk,
        selectedCategory: selectedName ? [selectedName] : [],
      },
    }));
  };

  const handleRemove = () => {
    setFilters((prev) => ({
      ...prev,
      kiosk: { ...prev.kiosk, selectedCategory: [] },
    }));
  };

  if (isLoading)
    return <div className="w-[98%] max-w-sm">در حال بارگذاری دسته‌ها...</div>;

  // پیدا کردن id برای انتخاب پیش‌فرض در select (بر اساس name فعلی)
  const selectedId =
    categories.find((cat) => cat.name === selectedCategoryName)?._id || "";

  return (
    <div className="w-[98%] max-w-sm relative">
      <h1 className="mb-[1.4vh] text-[2.1vh] font-semibold text-[#143A62] mr-[2%]">
        دسته‌بندی
      </h1>

      <div className="flex flex-wrap items-center gap-2 border rounded-lg px-[1.4vh] py-[0.4vh] min-h-[5vh]">
        {selectedCategoryName && (
          <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
            {selectedCategoryName}
            <button
              type="button"
              className="mr-1 font-bold"
              onClick={handleRemove}
            >
              ×
            </button>
          </div>
        )}

        <select
          value={selectedId}
          onChange={handleChange}
          className="flex-1 bg-transparent text-sm focus:outline-none py-1"
          style={{ direction: "rtl" }}
        >
          <option value="">+ انتخاب دسته</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
