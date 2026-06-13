"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useProvinces, useCities } from "@/api/apiClient";

interface Province {
  id: number;
  name: string;
}

export interface SelectedItem {
  id: string;
  name: string;
  type: "city";
  provinceId?: string;
}

interface ProvinceCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCities: SelectedItem[], allIranSelected: boolean) => void;
  multiSelect?: boolean;
  initialSelected?: SelectedItem[];
}

const fetchAllCities = async (): Promise<string[]> => {
  const res = await axios.get(
    "https://barchasb-server.liara.run/api/all-cities",
  );
  return res.data;
};

const ProvinceCityModal: React.FC<ProvinceCityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  multiSelect = true,
  initialSelected = [],
}) => {
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const typedProvinces = provincesData as Province[] | undefined;

  const { data: allCities = [] } = useQuery({
    queryKey: ["allCities"],
    queryFn: fetchAllCities,
  });

  const [selectedProvinceForCities, setSelectedProvinceForCities] = useState<
    string | null
  >(null);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [generalSearchTerm, setGeneralSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] =
    useState<SelectedItem[]>(initialSelected);
  const [allIranChecked, setAllIranChecked] = useState(false);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  const { data: citiesData, isLoading: citiesLoading } = useCities(
    selectedProvinceForCities || "",
  );

  // ریست وضعیت هنگام باز شدن مودال
  useEffect(() => {
    if (isOpen) {
      setSelectedCities(initialSelected);
      setSelectedProvinceForCities(null);
      setCitySearchTerm("");
      setGeneralSearchTerm("");
      setAllIranChecked(false);
    }
  }, [isOpen, initialSelected]);

  // تشخیص کل ایران از روی مقدار اولیه
  useEffect(() => {
    if (
      initialSelected.length === allCities.length &&
      allCities.length > 0 &&
      !allIranChecked
    ) {
      setAllIranChecked(true);
    }
  }, [initialSelected, allCities, allIranChecked]);

  // --- پیمایش عمودی بدون اسکرول‌بار (ماوس، کیبورد، لمس) ---
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      if (!contentScrollRef.current) return;
      const activeEl = document.activeElement;
      if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA") {
        return;
      }
      contentScrollRef.current.scrollTop += e.deltaY;
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contentScrollRef.current) return;
      const activeEl = document.activeElement;
      if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA") {
        return;
      }

      const step = 40;
      const pageStep = contentScrollRef.current.clientHeight;
      switch (e.key) {
        case "ArrowDown":
          contentScrollRef.current.scrollTop += step;
          e.preventDefault();
          break;
        case "ArrowUp":
          contentScrollRef.current.scrollTop -= step;
          e.preventDefault();
          break;
        case "PageDown":
          contentScrollRef.current.scrollTop += pageStep;
          e.preventDefault();
          break;
        case "PageUp":
          contentScrollRef.current.scrollTop -= pageStep;
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // پیمایش لمسی عمودی (بدون اسکرول‌بار)
  const handleTouchStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    const startScrollTop = contentScrollRef.current?.scrollTop || 0;
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!contentScrollRef.current) return;
      const deltaY = startY - moveEvent.touches[0].clientY;
      contentScrollRef.current.scrollTop = startScrollTop + deltaY;
      moveEvent.preventDefault();
    };
    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  // --- توابع کمکی ---
  const isCitySelected = (cityName: string, provinceId?: string) =>
    selectedCities.some(
      (c) =>
        c.name === cityName &&
        (provinceId ? c.provinceId === provinceId : true),
    );

  const toggleCity = (cityName: string, provinceId?: string) => {
    const cityId = provinceId
      ? `${provinceId}-${cityName}`
      : `global-${cityName}`;
    if (isCitySelected(cityName, provinceId)) {
      setSelectedCities((prev) => prev.filter((c) => c.id !== cityId));
      if (allIranChecked) setAllIranChecked(false);
    } else {
      setSelectedCities((prev) => [
        ...prev,
        { id: cityId, name: cityName, type: "city", provinceId },
      ]);
    }
  };

  const selectAllCitiesOfProvince = (
    provinceName: string,
    cities: string[],
  ) => {
    const newCities = [...selectedCities];
    for (const city of cities) {
      const cityId = `${provinceName}-${city}`;
      if (!newCities.some((c) => c.id === cityId)) {
        newCities.push({
          id: cityId,
          name: city,
          type: "city",
          provinceId: provinceName,
        });
      }
    }
    setSelectedCities(newCities);
    if (allIranChecked) setAllIranChecked(false);
  };

  const clearAll = () => {
    setSelectedCities([]);
    setAllIranChecked(false);
  };

  const removeSelectedCity = (city: SelectedItem) => {
    setSelectedCities((prev) => prev.filter((c) => c.id !== city.id));
    if (allIranChecked) setAllIranChecked(false);
  };

  const handleAllIranChange = () => {
    if (allIranChecked) {
      setAllIranChecked(false);
      setSelectedCities([]);
    } else {
      setAllIranChecked(true);
      const allCityItems: SelectedItem[] = allCities.map((city) => ({
        id: `all-${city}`,
        name: city,
        type: "city",
        provinceId: undefined,
      }));
      setSelectedCities(allCityItems);
    }
  };

  // فیلترها
  const filteredProvinces = useMemo(() => {
    if (!typedProvinces) return [];
    if (!generalSearchTerm.trim()) return typedProvinces;
    const term = generalSearchTerm.trim().toLowerCase();
    return typedProvinces.filter((p) => p.name.toLowerCase().includes(term));
  }, [typedProvinces, generalSearchTerm]);

  const currentCities = (citiesData as string[]) || [];
  const filteredCitiesInProvince = useMemo(() => {
    if (!selectedProvinceForCities) return [];
    if (!citySearchTerm.trim()) return currentCities;
    const term = citySearchTerm.trim().toLowerCase();
    return currentCities.filter((city) => city.toLowerCase().includes(term));
  }, [currentCities, citySearchTerm, selectedProvinceForCities]);

  const globalCitySearchResults = useMemo(() => {
    if (!citySearchTerm.trim()) return [];
    const term = citySearchTerm.trim().toLowerCase();
    return allCities.filter((city) => city.toLowerCase().includes(term));
  }, [allCities, citySearchTerm]);

  const globalSearchResultsForGeneral = useMemo(() => {
    if (!generalSearchTerm.trim()) return [];
    const term = generalSearchTerm.trim().toLowerCase();
    return allCities.filter((city) => city.toLowerCase().includes(term));
  }, [allCities, generalSearchTerm]);

  const handleViewCities = (provinceName: string) => {
    setSelectedProvinceForCities(provinceName);
    setCitySearchTerm("");
  };

  const backToProvinces = () => {
    setSelectedProvinceForCities(null);
    setCitySearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[#143A62] w-full max-w-2xl rounded-xl shadow-lg flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* خط اول: جستجوی شهر (اختصاصی) و حذف همه */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <div className="relative w-64 text-white">جستجوی شهر</div>
          <button
            onClick={clearAll}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            حذف همه
          </button>
        </div>

        {/* خط دوم: جستجوی استان یا شهر (ترکیبی) */}
        <div className="p-4 border-b border-white/20">
          <input
            type="text"
            placeholder="جستجوی شهر..."
            value={generalSearchTerm}
            onChange={(e) => setGeneralSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* نمایش تگ‌های انتخاب شده در یک خط افقی با اسکرول لمسی */}
        {selectedCities.length > 0 && (
          <div className="p-4 border-b border-white/20">
            <div
              className="flex flex-row flex-nowrap gap-2 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {selectedCities.map((city) => (
                <div
                  key={city.id}
                  className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center gap-1 shrink-0"
                >
                  <span>{city.name}</span>
                  <button
                    onClick={() => removeSelectedCity(city)}
                    className="text-blue-600 hover:text-blue-800 font-bold mr-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* بدنه اصلی (لیست استان/شهر) با اسکرول عمودی مخفی و پیمایش سفارشی */}
        <div
          ref={contentScrollRef}
          className="flex-1 p-4 overflow-y-hidden max-h-96"
          onTouchStart={handleTouchStart}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* گزینه کل ایران */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/20">
            <span className="font-bold text-white">کل ایران</span>
            <input
              type="checkbox"
              checked={allIranChecked}
              onChange={handleAllIranChange}
              className="w-5 h-5"
            />
          </div>

          {/* نتایج جستجوی اختصاصی شهر */}
          {citySearchTerm.trim() !== "" && (
            <div className="mb-4">
              <div className="font-bold text-white mb-2">نتایج جستجوی شهر:</div>
              {globalCitySearchResults.length === 0 && (
                <p className="text-white">هیچ شهری یافت نشد.</p>
              )}
              {globalCitySearchResults.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2 p-2 hover:bg-white/20 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isCitySelected(city, undefined)}
                    onChange={() => toggleCity(city, undefined)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">{city}</span>
                </div>
              ))}
            </div>
          )}

          {/* نتایج جستجوی ترکیبی */}
          {generalSearchTerm.trim() !== "" && (
            <div className="mb-4">
              <div className="font-bold text-white mb-2">
                نتایج جستجو (شهرها):
              </div>
              {globalSearchResultsForGeneral.length === 0 && (
                <p className="text-white">هیچ شهری یافت نشد.</p>
              )}
              {globalSearchResultsForGeneral.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2 p-2 hover:bg-white/20 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isCitySelected(city, undefined)}
                    onChange={() => toggleCity(city, undefined)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">{city}</span>
                </div>
              ))}
            </div>
          )}

          {/* نمایش عادی (بدون جستجو) */}
          {citySearchTerm.trim() === "" && generalSearchTerm.trim() === "" && (
            <>
              {selectedProvinceForCities === null ? (
                /* نمایش استان‌ها */
                <div>
                  {provincesLoading && <p>در حال بارگذاری استان‌ها...</p>}
                  {typedProvinces?.map((province) => (
                    <div
                      key={province.name}
                      className="mb-3 bg-[#FFFFFF0D] border-b border-[#FFFFFF] rounded-md cursor-pointer transition-colors duration-200 hover:bg-white/20 group"
                      onClick={() => handleViewCities(province.name)}
                    >
                      <div className="flex items-center justify-between p-2 rounded-md">
                        <span className="font-medium text-white transition-colors group-hover:text-[#143A62]">
                          {province.name}
                        </span>
                        <button className="text-[2vh] text-gray-300 transition-colors group-hover:text-[#143A62] rotate-180">
                          ‹
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* نمایش شهرهای استان */
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={backToProvinces}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      › برگشت به استان‌ها
                    </button>
                    <span className="text-gray-600">
                      / {selectedProvinceForCities}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-3">
                    <span className="font-medium">
                      همه شهرهای {selectedProvinceForCities}
                    </span>
                    <button
                      onClick={() =>
                        selectAllCitiesOfProvince(
                          selectedProvinceForCities,
                          currentCities,
                        )
                      }
                      className="text-blue-600 underline text-sm"
                    >
                      انتخاب همه
                    </button>
                  </div>

                  {citiesLoading && <p>در حال بارگذاری شهرها...</p>}
                  {!citiesLoading && filteredCitiesInProvince.length === 0 && (
                    <p>شهری یافت نشد</p>
                  )}
                  {filteredCitiesInProvince.map((city) => (
                    <div
                      key={city}
                      className="flex items-center gap-2 p-2 hover:bg-white/20 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isCitySelected(
                          city,
                          selectedProvinceForCities,
                        )}
                        onChange={() =>
                          toggleCity(city, selectedProvinceForCities)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-white">{city}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* دکمه‌های پایین */}
        <div className="flex justify-center gap-4 p-4 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-[35%] px-4 py-2 border border-red-500 rounded-md text-red-500 bg-transparent hover:bg-red-500/10 transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={() => {
              onConfirm(selectedCities, allIranChecked);
              onClose();
            }}
            className="w-[35%] px-4 py-2 border border-white rounded-md text-white bg-transparent hover:bg-white/10 transition-colors"
          >
            تأیید
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProvinceCityModal;
