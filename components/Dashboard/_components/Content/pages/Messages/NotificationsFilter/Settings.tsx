"use client";
import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSuggestions } from "@/context/SuggestionsContext";
import {
  getSuggestionPreference,
  getSuggestionStats,
} from "@/api/apiSuggestion";
import Notifications from "./Notifications";

type OptionKey = "all" | "employer" | "jobseeker" | "seller" | "digital";

const options: { key: OptionKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "employer", label: "کارفرما" },
  { key: "jobseeker", label: "کارجو" },
  { key: "seller", label: "آگهی‌گذار" },
  { key: "digital", label: "آگهی مناقصه" },
];

const adTypeMap: Record<OptionKey, string | undefined> = {
  all: undefined,
  employer: "EmployerAd",
  jobseeker: "JobSeekerAd",
  seller: "SellerAd",
  digital: "DigitalAd",
};

interface FormValues {
  search: string;
  notificationCount: number;
}

const SettingsSchema = Yup.object().shape({
  search: Yup.string().required("موضوع اعلان الزامی است"),
  notificationCount: Yup.number()
    .min(1, "حداقل 1 اعلان")
    .required("تعداد اعلان الزامی است"),
});

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OptionKey>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const {
    fetchAndSetSuggestions,
    suggestions,
    isLoading,
    error,
    clearError,
    remaining,
  } = useSuggestions();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getSuggestionStats();
        setAvailableCount(stats.remaining);
      } catch (err) {
        console.error("Error fetching suggestion stats:", err);
        const pref = await getSuggestionPreference().catch(() => null);
        setAvailableCount(pref?.totalAllowed ?? 20);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (remaining !== undefined && remaining >= 0) {
      setAvailableCount(remaining);
    }
  }, [remaining]);

  const initialValues: FormValues = {
    search: "",
    notificationCount: 1,
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    clearError?.();
    try {
      const selectedType = adTypeMap[activeTab];
      const requestedCount = Math.min(values.notificationCount, availableCount);
      await fetchAndSetSuggestions(values.search, requestedCount, selectedType);
      setShowResults(true);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current || !showResults) return;
      const container = containerRef.current;
      const scrollAmount = 100;
      const pageScrollAmount = container.clientHeight;

      switch (e.key) {
        case "ArrowDown":
          container.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          container.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          container.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          container.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showResults]);

  if (showResults) {
    return (
      <div className="w-full">
        <div className="flex justify-start mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#143A62] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            بازگشت به تنظیمات
          </button>
        </div>

        {isLoading ? (
          <div className="text-center mt-10 text-gray-600">
            در حال بارگذاری پیشنهادات...
          </div>
        ) : error ? (
          <div className="text-center mt-10 text-red-500">{error}</div>
        ) : suggestions.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            هیچ پیشنهادی یافت نشد.
          </div>
        ) : (
          <div
            ref={containerRef}
            className="h-[55vh] w-full overflow-y-auto hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Notifications />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex flex-col items-center gap-[4vh] mt-[2vh]">
      <div className="w-[85%] max-w-3xl">
        <div className="bg-white shadow-[0px_0px_4px_0px_#0000001A] rounded-[10px] flex items-center relative overflow-hidden">
          {options.map((opt) => {
            const isSelected = opt.key === activeTab;
            return (
              <div
                key={opt.key}
                onClick={() => setActiveTab(opt.key)}
                className="flex-1 cursor-pointer relative py-2 text-center"
              >
                <div
                  className={`absolute inset-0 rounded-[10px] transition-all duration-300 ${
                    isSelected ? "bg-[#143A62] opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  className={`relative z-10 text-[1.2vh] lg:text-[2vh] ${
                    isSelected ? "text-white" : "text-[#143A62]"
                  }`}
                >
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-3 flex items-center justify-center rounded-[10px] bg-[rgba(217,217,217,0.44)] text-[#143A62] font-medium text-[1.5vh] h-[5vh] w-auto">
        تعداد اعلان‌های موجود: {availableCount}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={SettingsSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="flex flex-col items-center gap-[6vh] w-full lg:w-[85%]">
            <div className="relative w-full">
              <Field
                name="search"
                placeholder="موضوع اعلان"
                className="w-full h-[6vh] rounded-[10px] bg-white pr-[8vh] pl-4 text-[#143A6280] text-[2vh] font-medium"
              />
              <img
                src="/images/search_skills_icon.svg"
                alt="search icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ width: "2.5vh", height: "4vh" }}
              />
              {errors.search && touched.search && (
                <div className="text-red-500 mt-1 text-[1.2vh]">
                  {errors.search}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between w-full rounded-[10px] px-2 lg:px-4 bg-[#143A621A] h-[6vh]">
              <span className="text-[1.2vh] lg:text-[2vh] text-[#143A62] text-center font-medium right-1 lg:right-4">
                چند اعلان را می‌خواهید استفاده کنید :
              </span>

              <div className="flex items-center lg:gap-[2px]">
                <button
                  type="button"
                  className="text-[#143A62] text-[2vh] lg:text-[3vh] w-[2vh] h-[2vh] md:w-[5vh] md:h-[5vh] flex items-center justify-center"
                  onClick={() => {
                    const newVal = Math.max(1, values.notificationCount - 1);
                    setFieldValue("notificationCount", newVal);
                  }}
                >
                  -
                </button>

                <input
                  type="number"
                  name="notificationCount"
                  value={values.notificationCount}
                  min={1}
                  max={availableCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      const clamped = Math.min(
                        Math.max(1, val),
                        availableCount,
                      );
                      setFieldValue("notificationCount", clamped);
                    }
                  }}
                  className="w-[5vh] h-[5vh] md:w-[6vh] md:h-[6vh] text-center bg-white rounded-[6px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#143A62] text-[2vh]"
                />

                <button
                  type="button"
                  className="text-[#143A62] text-[2vh] lg:text-[3vh] w-[2vh] h-[2vh] md:w-[5vh] md:h-[5vh] flex items-center justify-center"
                  onClick={() => {
                    const newVal = Math.min(
                      availableCount,
                      values.notificationCount + 1,
                    );
                    setFieldValue("notificationCount", newVal);
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[6vh] bg-[#143A62] text-white rounded-[10px] text-[2.5vh] font-medium flex items-center justify-center"
              disabled={isSubmitting || availableCount === 0}
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت"}
            </button>
          </Form>
        )}
      </Formik>

      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Settings;
