"use client";

import React, { useState, useRef } from "react";
import { PersonProvider, usePerson } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import FloatingInput from "@/components/common/FloatingInput";
import SelectImageModal from "@/components/common/SelectImageModal";
import Button from "@mui/material/Button";
import FormAdvertiser2 from "./FormAdvertiser2";
import SwitchPersonSentence from "../../CommonForms/SwitchPerson";
import { useFormStore } from "@/store/formStore";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import AddAdsModal from "./AddAdsModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
interface ImageItem {
  src: string;
  file?: File;
  fromApi?: boolean;
  isMain?: boolean;
}

const FormAdvertiser1: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { activeTab, setActiveTab } = usePerson();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [showNextForm, setShowNextForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const router = useRouter();

  const setUserType = useFormStore((state) => state.setUserType);
  const setCurrentStep = useFormStore((state) => state.setCurrentStep);
  const advertiserData =
    useFormStore((state) => state.fields["advertiser"]) || {};
  const [mainImage, setMainImage] = useState<string | null>(
    advertiserData?.mainImage || "/images/img_form.svg",
  );

  const setField = useFormStore((state) => state.setField);
  useEffect(() => {
    if (advertiserData.person) {
      setActiveTab(advertiserData.person);
    }
  }, [advertiserData.person, setActiveTab]);
  // تب اولیه: قفل کردن تب‌ها اگر قبلاً کسی مقدار وارد کرده
  useEffect(() => {
    if (advertiserData.person) {
      setActiveTab(advertiserData.person);
    }
  }, [advertiserData.person, setActiveTab]);
  useEffect(() => {
    if (advertiserData?.person && activeTab !== advertiserData.person) {
      setActiveTab(advertiserData.person);
    }
  }, [activeTab, advertiserData?.person, setActiveTab]);

  const handleNextStep = () => {
    const requiredFields = ["title", "category", "description"];
    const emptyFields = requiredFields.filter((key) => !advertiserData[key]);

    if (emptyFields.length > 0) {
      setErrorMessage("لطفا تمام فیلدها را پر کنید");
      return;
    }

    setField("advertiser", "title", advertiserData.title || "");
    setField("advertiser", "description", advertiserData.description || "");
    setField("advertiser", "category", advertiserData.category || "");
    setField("advertiser", "person", activeTab);

    // ذخیره عکس‌ها
    if (mainImage) setField("advertiser", "mainImage", mainImage);
    if (images.length > 0) setField("advertiser", "images", images);

    // نمایش همه داده‌ها در Console
    console.log("همه داده‌های فرم advertiser:", {
      ...advertiserData,
      mainImage,
      images,
      person: activeTab,
    });

    setUserType("advertiser");
    setCurrentStep(2);
    setErrorMessage("");
    setShowNextForm(true);
  };

  if (showNextForm) return <FormAdvertiser2 />;

  return (
    <div
      className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] sm:mt-4 px-3"
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
      {/* دکمه Close در موبایل */}
      <div className="absolute top-2 left-2 sm:hidden z-30">
        <button
          onClick={() => {
            onClose?.(); // ✅ فقط اگر تعریف شده باشد اجرا می‌شود
            router.push("/dashboard/createform");
          }}
          className="bg-red-500 text-white px-2 py-1 rounded-full font-bold text-[1.2vh]"
        >
          ✕
        </button>
      </div>
      {/* دکمه برگشت */}
      <div
        className="hidden sm:flex absolute top-0 right-1 z-50 bg-gray-200 p-1 rounded-full cursor-pointer items-center justify-center"
        onClick={() => router.push("/dashboard/createform")}
      >
        <img
          src="/images/back_arrow.svg"
          alt="Back"
          className="w-6 h-6 rotate-180"
        />
      </div>

      <div className="flex flex-col justify-start h-[95%] p-4 relative z-20 w-[95%] sm:w-[80%] mx-auto">
        <StepProgress currentStep={1} />
        <SwitchPersonSentence />

        {errorMessage && (
          <div className="text-red-600 text-[1.6vh] sm:text-[1.8vh] font-bold mb-2 w-full text-center">
            {errorMessage}
          </div>
        )}

        <div className="relative z-20 flex flex-col sm:flex-row justify-center items-start w-full sm:w-[85%] gap-1 sm:gap-4 md:gap-6 mr-[10%]">
          <div className="flex flex-col gap-1 sm:gap-3 sm:flex-1 w-[99%] mr-[-10%] md:mr-[0%] sm:w-[85%] items-center sm:items-start">
            <div
              className="flex items-center gap-0 sm:gap-2 cursor-pointer my-[1.2vh] md:my-[2.8vh]"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={mainImage || "/images/img_form.svg"}
                alt="عکس آگهی"
                className="w-[5vh] h-[5vh] sm:w-[7vh] sm:h-[7vh] object-cover rounded-md"
              />
              <span className="text-[2vh] sm:text-[2.4vh] text-gray-400 font-medium">
                عکس آگهی
              </span>
            </div>

            <FloatingInput
              placeholder="توضیحات"
              variant="textarea"
              value={advertiserData.description || ""}
              onChange={(val) => setField("advertiser", "description", val)}
              inputType="alphanumeric"
            />
          </div>

          <div className="flex flex-col gap-1 sm:gap-6 sm:flex-1 w-full items-start">
            <FloatingInput
              placeholder="عنوان آگهی"
              variant="input"
              value={advertiserData.title || ""}
              onChange={(val) => setField("advertiser", "title", val)}
              inputType="alphanumeric"
            />
            <ModalTriggerInput
              placeholder="دسته آگهی"
              value={advertiserData.category || ""}
              onClick={() => setIsCategoryModalOpen(true)}
            />

            <Button
              onClick={handleNextStep}
              className="w-[76%] h-[7vh] mt-4 rounded-[10px]"
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
          </div>
        </div>

        <SelectImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(images: ImageItem[]) => {
            if (images.length > 0 && images[0].file) {
              const url = URL.createObjectURL(images[0].file);
              setMainImage(url);

              // فقط فایل‌های واقعی را جدا می‌کنیم
              const files = images
                .map((img) => img.file)
                .filter(Boolean) as File[];
              setImages(files);

              setField("advertiser", "mainImage", url);
              setField("advertiser", "images", files);
            }
          }}
          parentRef={parentRef}
          userType="advertiser"
        />
        {isCategoryModalOpen && (
          <AddAdsModal
            parentRef={parentRef}
            onClose={() => setIsCategoryModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default FormAdvertiser1;
