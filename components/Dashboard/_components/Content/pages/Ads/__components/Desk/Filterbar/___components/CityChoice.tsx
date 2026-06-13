"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import ProvinceCityModal, {
  SelectedItem,
} from "@/components/common/ProvinceCityModal";

const fetchAllCities = async (): Promise<string[]> => {
  const res = await axios.get(
    "https://barchasb-server.liara.run/api/all-cities",
  );
  return res.data;
};

interface CityChoiceProps {
  selectedCities: string[];
  onChange: (cities: string[]) => void;
}

const CityChoice: React.FC<CityChoiceProps> = ({
  selectedCities,
  onChange,
}) => {
  const { user, loading: userLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultAdded, setDefaultAdded] = useState(false);
  const [isAllIranMode, setIsAllIranMode] = useState(false);

  const { data: allCities = [] } = useQuery<string[]>({
    queryKey: ["allCities"],
    queryFn: fetchAllCities,
  });

  // اضافه کردن شهر پیش‌فرض کاربر در اولین بار (اگر کاربر لاگین باشد و هیچ انتخابی وجود نداشته باشد)
  useEffect(() => {
    if (
      !userLoading &&
      user?.city &&
      !defaultAdded &&
      selectedCities.length === 0 &&
      !isAllIranMode
    ) {
      onChange([user.city]);
      setDefaultAdded(true);
    }
  }, [
    userLoading,
    user?.city,
    defaultAdded,
    onChange,
    selectedCities.length,
    isAllIranMode,
  ]);

  // همگام‌سازی isAllIranMode با props در صورت تغییر خارجی
  useEffect(() => {
    if (selectedCities.length === 0 && !isAllIranMode) {
      // اگر از بیرون آرایه خالی شد، مطمئن شویم حالت کل ایران غیرفعال شود
      setIsAllIranMode(false);
    }
  }, [selectedCities, isAllIranMode]);

  const handleRemoveCity = (city: string) => {
    if (city === "ALL_IRAN") {
      // حذف حالت کل ایران
      setIsAllIranMode(false);
      onChange([]);
    } else {
      const newCities = selectedCities.filter((c) => c !== city);
      onChange(newCities);
      if (newCities.length === 0) setIsAllIranMode(false);
    }
  };

  const handleModalConfirm = (
    selectedItems: SelectedItem[],
    allIranSelected: boolean,
  ) => {
    if (allIranSelected) {
      setIsAllIranMode(true);
      onChange([]); // در حالت کل ایران، آرایه شهرها خالی است، اما تگ مخصوص نمایش داده می‌شود
    } else {
      setIsAllIranMode(false);
      const cityNames = selectedItems
        .filter((item) => item.type === "city")
        .map((item) => item.name);
      onChange(cityNames);
    }
  };

  // نمایش متن مناسب برای تگ‌ها
  const getDisplayText = () => {
    if (isAllIranMode) return "کل ایران";
    if (selectedCities.length === 0) return null;
    if (selectedCities.length === 1) return selectedCities[0];
    return `${selectedCities[0]} و ...`;
  };

  const displayText = getDisplayText();

  return (
    <div className="w-[98%] max-w-sm relative">
      <h1 className="mb-[1.4vh] text-[2.1vh] font-semibold text-[#143A62] mr-[2%]">
        جستجوی شهر
      </h1>

      <div className="flex flex-wrap gap-2 border rounded-lg px-[1.4vh] py-[0.4vh] min-h-[5vh]">
        {displayText && (
          <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
            {displayText}
            <button
              type="button"
              className="mr-1 font-bold"
              onClick={() =>
                handleRemoveCity(isAllIranMode ? "ALL_IRAN" : selectedCities[0])
              }
            >
              ×
            </button>
          </div>
        )}

        {/* دکمه باز کردن مودال – همیشه نمایش داده می‌شود (بدون محدودیت تعداد) */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 text-sm hover:underline focus:outline-none px-2 py-1"
        >
          + انتخاب شهر
        </button>
      </div>

      <ProvinceCityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        multiSelect={true}
        initialSelected={selectedCities.map((city) => ({
          id: city,
          name: city,
          type: "city",
          provinceId: undefined,
        }))}
      />
    </div>
  );
};

export default CityChoice;
