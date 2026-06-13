"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@mui/material/Button";

import { usePerson } from "@/context/PersonContext";
import { useUser } from "@/context/UserContext";
import { useFormStore } from "@/store/formStore";

import StepProgress from "@/components/common/StepProgress";
import FloatingInput from "@/components/common/FloatingInput";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import AddJobModal from "./AddJobModal";
import SelectImageModal from "@/components/common/SelectImageModal";
import AddRelatedDescriptionModal from "@/components/common/AddRelatedDescriptionModal";
import SwitchPersonSentence from "../../CommonForms/SwitchPerson";
import FormEmployee2 from "./FormEmployee2";

interface ImageItem {
  src: string;
  file?: File;
  fromApi?: boolean;
  isMain?: boolean;
}

// نوع داده دسته‌بندی جدید
interface CategoryItem {
  name: string;
  subCategories: string[];
}

const FormEmployee1: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useUser();
  const { activeTab, setActiveTab } = usePerson();
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  const { getFormData, setField, setCurrentStep, setUserType } = useFormStore();
  const employerData = getFormData("employer") as Record<string, any>;

  // مدال‌ها
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showNextForm, setShowNextForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // تصاویر
  const [mainImage, setMainImage] = useState<string | null>(
    employerData?.mainImage || null,
  );
  const [images, setImages] = useState<File[]>(employerData?.images || []);

  // ✅ state جدید برای دسته‌بندی (آرایه‌ای از اشیاء)
  const [categories, setCategories] = useState<CategoryItem[]>(
    employerData?.categories || [],
  );

  // برای نمایش در فرم، اولین دسته اصلی و زیردسته‌های آن را استخراج می‌کنیم (فعلاً فقط یک دسته پشتیبانی می‌شود)
  const mainCategory = categories.length > 0 ? categories[0].name : "";
  const subCategories =
    categories.length > 0 ? categories[0].subCategories : [];

  // State جدا برای هر تب (با فیلدهای جدید)
  const [stateSelf, setStateSelf] = useState({
    name: employerData?.name || (user ? `${user.name} ${user.lastName}` : ""),
    title: employerData?.title || "",
    description: employerData?.description || "",
    additionalItems: employerData?.additionalItems || [],
  });

  const [stateOther, setStateOther] = useState({
    name: employerData?.person === "digari" ? employerData?.name || "" : "",
    title: employerData?.person === "digari" ? employerData?.title || "" : "",
    description:
      employerData?.person === "digari" ? employerData?.description || "" : "",
    additionalItems:
      employerData?.person === "digari"
        ? employerData?.additionalItems || []
        : [],
  });

  // State فعلی که به فرم متصل است
  const state = activeTab === "khodam" ? stateSelf : stateOther;
  const setState = activeTab === "khodam" ? setStateSelf : setStateOther;

  // تب اولیه
  useEffect(() => {
    if (employerData.person) setActiveTab(employerData.person);
  }, [employerData.person, setActiveTab]);

  const toPersianNumber = (num: number) =>
    num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

  const [otherInitialized, setOtherInitialized] = useState(false);

  useEffect(() => {
    if (employerData.person) {
      setActiveTab(employerData.person);
    }
  }, []);

  useEffect(() => {
    if (employerData.person) {
      setActiveTab(employerData.person);
    }
  }, [employerData.person, setActiveTab]);

  useEffect(() => {
    if (employerData?.person && activeTab !== employerData.person) {
      setActiveTab(employerData.person);
    }
  }, [activeTab, employerData?.person, setActiveTab]);

  // ✅ تابع کمکی برای نمایش خلاصه دسته‌ها در ModalTriggerInput
  const getCategoryDisplayText = () => {
    const count = categories.length;
    if (count === 0) return "";
    if (count === 1) return "1 دسته اصلی";
    return `${count} دسته اصلی`;
  };

  // ✅ تابع پردازش خروجی مدال AddJobModal (اکنون آرایه‌ای از اشیاء می‌گیرد)
  const handleCategorySelect = (selectedCategories: CategoryItem[]) => {
    if (!selectedCategories.length) {
      setCategories([]);
      return;
    }
    // فعلاً فقط از اولین دسته اصلی استفاده می‌کنیم (چون فرم فعلی فقط یک دسته اصلی را پشتیبانی می‌کند)
    setCategories(selectedCategories);
  };

  const handleNextStep = () => {
    // اعتبارسنجی فیلدهای مورد نیاز (نام، عنوان، توضیحات، دسته اصلی)
    const requiredFields: (keyof typeof state)[] = [
      "name",
      "title",
      "description",
    ];
    const emptyFields = requiredFields.filter(
      (key) =>
        !state[key] || (Array.isArray(state[key]) && state[key].length === 0),
    );

    if (categories.length === 0) emptyFields.push("category" as any);
    if (emptyFields.length > 0) {
      setErrorMessage("لطفا تمام فیلدها را پر کنید");
      return;
    }

    // ذخیره در Zustand برای تب مربوطه
    Object.entries(state).forEach(([key, value]) =>
      setField("employer", key, value),
    );
    setField("employer", "person", activeTab);
    // ✅ ذخیره ساختار جدید categories
    setField("employer", "categories", categories);
    // (اختیاری: برای سازگاری با کدهای قدیمی، می‌توان category و subCategories را هم ذخیره کرد، اما نیاز نیست)

    if (mainImage) setField("employer", "mainImage", mainImage);
    if (images.length > 0) setField("employer", "images", images);

    setUserType("employer");
    setCurrentStep(2);
    setErrorMessage("");
    setShowNextForm(true);
  };

  if (showNextForm) return <FormEmployee2 />;

  return (
    <div
      className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[98%] sm:h-[90%] px-1 mt-1 sm:mt-4 sm:px-3"
      ref={parentRef}
    >
      <div
        className="absolute inset-0 w-full h-full rounded-[20px]"
        style={{ backgroundColor: "rgba(247, 247, 247, 0.98)", zIndex: 0 }}
      />
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
            onClose?.();
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

      <div className="flex flex-col justify-start h-[98%] sm:h-[95%] sm:p-4 relative z-20 w-[80%] mx-auto">
        <StepProgress currentStep={1} />
        <SwitchPersonSentence />

        {errorMessage && (
          <div className="text-red-600 text-[1.4vh] md:text-[1.8vh] font-bold md:mb-2 w-full text-center">
            {errorMessage}
          </div>
        )}

        <div className="relative z-20 flex flex-col sm:flex-row justify-center items-start w-full sm:w-[85%] gap-1 sm:gap-4 md:gap-6 mr-[10%]">
          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-1 w-[99%] mr-[-10%] md:mr-[0%] sm:w-[85%] items-center sm:items-start">
            <div
              className="flex items-center gap-2 cursor-pointer my-[0.6vh] md:my-[2.8vh]"
              onClick={() => setImageModalOpen(true)}
            >
              <img
                src={mainImage || "/images/img_form.svg"}
                alt="عکس کارفرما"
                className="w-[5vh] h-[5vh] sm:w-[7vh] sm:h-[7vh] object-cover rounded-md"
              />
              <span className="text-[2vh] sm:text-[2.4vh] text-gray-400 font-medium">
                عکس کارفرما
              </span>
            </div>

            <FloatingInput
              placeholder="عنوان آگهی"
              variant="input"
              value={state.title}
              onChange={(val) => setState((prev) => ({ ...prev, title: val }))}
              inputType="alphanumeric"
            />
            <ModalTriggerInput
              placeholder="توضیحات"
              value={state.description}
              onClick={() => setDescriptionModalOpen(true)}
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-4 sm:flex-1 w-full items-start mt-[3.3%]">
            <FloatingInput
              placeholder="نام"
              variant="input"
              value={state.name}
              onChange={(val) => setState((prev) => ({ ...prev, name: val }))}
              inputType="text"
            />

            <ModalTriggerInput
              placeholder="دسته شغلی"
              value={getCategoryDisplayText()}
              onClick={() => setShowCategoryModal(true)}
            />

            <Button
              onClick={handleNextStep}
              className="w-[76%] h-[7vh] mt-5 rounded-[10px]"
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
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onSelect={(images: ImageItem[]) => {
            if (images.length > 0 && images[0].file) {
              const url = URL.createObjectURL(images[0].file);
              setMainImage(url);
              const files = images
                .map((img) => img.file)
                .filter(Boolean) as File[];
              setImages(files);
              setField("employer", "mainImage", url);
              setField("employer", "images", files);
            }
          }}
          parentRef={parentRef}
          userType="employer"
        />
        <AddRelatedDescriptionModal
          isOpen={descriptionModalOpen}
          onClose={() => setDescriptionModalOpen(false)}
          onSave={(desc) =>
            setState((prev) => ({ ...prev, description: desc }))
          }
          parentRef={parentRef}
          titleModal="توضیحات موقعیت شغلی"
          titleAdd="شرح موقعیت شغلی:"
          titleAddHolder="موقعیت شغلی"
          titleDescription="معرفی شرکت:"
          userType="employer"
        />

        {showCategoryModal && (
          <AddJobModal
            onClose={() => setShowCategoryModal(false)}
            parentRef={parentRef}
            onSelectCategories={handleCategorySelect}
          />
        )}
      </div>
    </div>
  );
};

export default FormEmployee1;
