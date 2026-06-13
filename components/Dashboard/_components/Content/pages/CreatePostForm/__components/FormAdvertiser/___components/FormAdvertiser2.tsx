"use client";
import React, { useState, useRef } from "react";
import { PersonProvider } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import FloatingSelect from "@/components/common/FloatingSelect";
import FloatingInput from "@/components/common/FloatingInput";
import { useProvinces, useCities } from "@/api/apiClient";
import Button from "@mui/material/Button";
import { useFormStore } from "@/store/formStore";
import FormAdvertiser1 from "./FormAdvertiser1";
import FormAdvertiser3 from "../../CommonForms/Form3";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import AdAttributesModal from "./AdAttributesModal";
import { useUser } from "@/context/UserContext";
const FormAdvertiser2: React.FC = () => {
  const { setField, getFormData } = useFormStore();
  const setUserType = useFormStore((state) => state.setUserType);
  const setCurrentStep = useFormStore((state) => state.setCurrentStep);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const parentRef = useRef<HTMLDivElement>(null);
  const { user, loading: userLoading } = useUser();
  // گرفتن داده‌های مرتبط با advertiser و مشخص کردن type
  const advertiserData = getFormData("advertiser") as Record<string, string>;

  const [selectedProvince, setSelectedProvince] = useState<string>(
    advertiserData?.province || user?.province || "",
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    advertiserData?.city || user?.city || "",
  );
  const categoryFromStore = advertiserData?.category || "";
  // مثال: "خدمات / آموزشی"

  const categoryName = categoryFromStore.split("/").pop()?.trim() || "";
  // خروجی: "آموزشی"
  const [status, setStatus] = useState<string[]>(
    typeof advertiserData?.status === "string"
      ? advertiserData.status.split(",").filter((s) => s)
      : Array.isArray(advertiserData?.status)
        ? advertiserData.status
        : [],
  );

  const [usage, setUsage] = useState<string[]>(
    typeof advertiserData?.usage === "string"
      ? advertiserData.usage.split(",").filter((s) => s)
      : Array.isArray(advertiserData?.usage)
        ? advertiserData.usage
        : [],
  );

  const [price, setPrice] = useState<string>(advertiserData?.price || "");
  const [features, setFeatures] = useState<string>(
    advertiserData?.features || "",
  );
  const [additionalOptions, setAdditionalOptions] = useState(
    advertiserData?.additionalOptions
      ? JSON.parse(advertiserData.additionalOptions)
      : { warranty: false, shipping: false },
  );
  const [priceOptions, setPriceOptions] = useState(
    advertiserData?.priceOptions
      ? JSON.parse(advertiserData.priceOptions)
      : { price: false, swap: false },
  );

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showNextForm, setShowNextForm] = useState(false);
  const [showPreviousForm, setShowPreviousForm] = useState(false);

  const userType = useFormStore.getState().userType;
  const currentStep = useFormStore.getState().currentStep;

  // گزینه‌های انتخاب استان و شهر
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: citiesData } = useCities(selectedProvince);

  const provinceOptions =
    provincesData?.map((p: { id: number; name: string }) => ({
      label: p.name,
      value: p.name,
    })) || [];

  const cityOptions =
    citiesData?.map((c: string) => ({ label: c, value: c })) || [];

  const statusOptions = [
    { label: "نو", value: "new" },
    { label: "کارکرده / دست دوم", value: "used" },
    { label: "آکبند", value: "sealed" },
    { label: "بازسازی شده", value: "refurbished" },
    { label: "معیوب / نیاز به تعمیر", value: "damaged" },
    { label: "قدیمی / کلکسیونی", value: "vintage" },
  ];

  const usageOptions = [
    { label: "شخصی", value: "personal" },
    { label: "تجاری / کسب‌وکار", value: "commercial" },
    { label: "آموزشی / یادگیری", value: "educational" },
    { label: "هدیه", value: "gift" },
    { label: "صنعتی", value: "industrial" },
  ];

  const handleNextStep = () => {
    const requiredFields = [
      selectedProvince,
      selectedCity,
      status,
      usage,
      price,
    ];

    if (requiredFields.some((item) => !item)) {
      setErrorMessage("لطفا فرم را پر کنید");
      return;
    }

    // ذخیره اطلاعات مرتبط با آگهی
    setField("advertiser", "province", selectedProvince);
    setField("advertiser", "city", selectedCity);
    setField("advertiser", "status", status);
    setField("advertiser", "usage", usage);
    setField("advertiser", "price", price);
    setField("advertiser", "features", features);
    setField(
      "advertiser",
      "additionalOptions",
      JSON.stringify(additionalOptions),
    );
    setField("advertiser", "priceOptions", JSON.stringify(priceOptions));

    setUserType("advertiser");
    setCurrentStep(2);
    setErrorMessage("");

    console.log(
      "داده‌های ذخیره‌شده مرتبط به آگهی:",
      getFormData("advertiser"),
      userType,
      currentStep,
    );

    setShowNextForm(true);
  };

  const handlePrevStep = () => {
    console.log("بازگشت به FormAdvertiser1");
    setShowPreviousForm(true);
  };

  if (showPreviousForm) return <FormAdvertiser1 />;
  if (showNextForm) return <FormAdvertiser3 />;

  return (
    <PersonProvider>
      <div
        className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[95%] sm:h-[90%]  sm:mt-4 sm:px-3"
        ref={parentRef}
      >
        {/* بک‌گراند رنگی */}
        <div
          className="absolute inset-0 w-full h-full rounded-[20px]"
          style={{ backgroundColor: "rgba(247, 247, 247, 0.98)", zIndex: 0 }}
        />
        {/* بک‌گراند تصویر */}
        <img
          src="/images/bg_support_formik_desk.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          style={{ zIndex: 1 }}
          loading="lazy"
        />
        <div className="flex flex-col justify-start items-center h-[90%] sm:p-4 relative z-20 w-[98%] sm:w-[85%] sm:mx-auto">
          <StepProgress currentStep={2} />
          {errorMessage && (
            <div
              className="w-full text-right text-red-600 mb-[1vh]"
              style={{ fontSize: "2vh" }}
            >
              {errorMessage}
            </div>
          )}

          {/* فرم */}
          <div className="relative z-20 flex flex-row justify-center gap-1 sm:gap-2  w-full mt-[2vh] sm:mt-[8vh]">
            {/* ستون اول */}
            <div className="flex flex-col gap-1 w-[70%] sm:w-full sm:gap-3 flex-1 mr-[4%] sm:mr-[10%]">
              <FloatingSelect
                placeholder={provincesLoading ? "در حال بارگذاری..." : "استان"}
                options={provinceOptions}
                value={selectedProvince}
                onChange={(val) => {
                  setSelectedProvince(val as string);
                  setSelectedCity("");
                }}
              />
              <FloatingSelect
                placeholder="وضعیت"
                options={statusOptions}
                value={status}
                onChange={(val) => setStatus(val as string[])}
              />

              <FloatingInput
                placeholder="قیمت (به تومان)"
                value={price}
                onChange={setPrice}
                inputType="price"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1vh] mb-2 justify-items-start sm:flex">
                <label className="inline-flex items-center bg-white rounded-[10px] p-[1vh] sm:px-[1.5vh] sm:py-[1.5vh] gap-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                    onChange={(e) =>
                      setAdditionalOptions({
                        ...additionalOptions,
                        warranty: e.target.checked,
                      })
                    }
                    checked={additionalOptions.warranty}
                  />
                  <span className="text-[#143A62E5] font-semibold text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                    گارانتی دارد
                  </span>
                </label>

                <label className="inline-flex items-center bg-white rounded-[10px] p-[1vh] sm:px-[1.5vh] sm:py-[1.5vh] gap-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                    onChange={(e) =>
                      setAdditionalOptions({
                        ...additionalOptions,
                        shipping: e.target.checked,
                      })
                    }
                    checked={additionalOptions.shipping}
                  />
                  <span className="text-[#143A62E5] font-semibold text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                    امکان ارسال دارد
                  </span>
                </label>
              </div>
            </div>

            {/* ستون دوم */}
            <div className="flex flex-col gap-1 w-[70%] sm:w-full sm:gap-3 flex-1 sm:ml-[1%]">
              <FloatingSelect
                placeholder="شهر / منطقه"
                options={cityOptions}
                value={selectedCity}
                onChange={(val) => setSelectedCity(val as string)}
              />

              <FloatingSelect
                placeholder="کاربرد"
                options={usageOptions}
                value={usage}
                onChange={(val) => setUsage(val as string[])}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1vh] mb-2 justify-items-start sm:flex">
                <label className="inline-flex items-center bg-white rounded-[10px] px-[1.5vh]  py-[1.5vh] gap-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                    onChange={(e) =>
                      setPriceOptions({
                        ...priceOptions,
                        price: e.target.checked,
                      })
                    }
                    checked={priceOptions.price}
                  />
                  <span className="text-[#143A62E5] font-semibold text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                    قیمت مقطوع
                  </span>
                </label>

                <label className="inline-flex items-center bg-white rounded-[10px] px-[1.5vh]  py-[1.5vh] gap-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                    onChange={(e) =>
                      setPriceOptions({
                        ...priceOptions,
                        swap: e.target.checked,
                      })
                    }
                    checked={priceOptions.swap}
                  />
                  <span className="text-[#143A62E5] font-semibold text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                    معاوضه می‌کنم
                  </span>
                </label>
              </div>

              <ModalTriggerInput
                placeholder="ویژگی‌ها و امکانات"
                value={
                  Object.keys(
                    JSON.parse(
                      (getFormData("advertiser") as Record<string, any>)
                        ?.attributes || "{}",
                    ),
                  ).length
                    ? "مشخصات ثبت شد"
                    : ""
                }
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-4 mt-[1vh] w-[80%] justify-end ml-[8%] sm:ml-[3%]">
            <Button
              onClick={handlePrevStep}
              className="w-[80%] sm:w-[20%] h-[7vh] rounded-[10px]"
              style={{
                backgroundColor: "#00B6FF",
                color: "#FFFFFF",
                fontSize: "2.6vh",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              مرحله قبل
            </Button>

            <Button
              onClick={handleNextStep}
              className="w-[80%] sm:w-[20%] h-[7vh] rounded-[10px]"
              style={{
                backgroundColor: "rgba(20,58,98,0.85)",
                color: "#FFFFFF",
                fontSize: "2.6vh",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              مرحله بعد
            </Button>
            {isModalOpen && (
              <AdAttributesModal
                categoryName={categoryName} // 👈 "آموزشی"
                onClose={() => setIsModalOpen(false)}
                parentRef={parentRef}
              />
            )}
          </div>
        </div>
      </div>
    </PersonProvider>
  );
};

export default FormAdvertiser2;
