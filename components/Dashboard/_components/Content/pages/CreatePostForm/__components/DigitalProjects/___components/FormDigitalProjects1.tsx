"use client";

import React, { useState, useRef, useEffect } from "react";
import { PersonProvider, usePerson } from "@/context/PersonContext";
import FloatingSelect from "@/components/common/FloatingSelect";
import StepProgress from "@/components/common/StepProgress";
import Button from "@mui/material/Button";
import { useFormStore } from "@/store/formStore";
import DigitalProjectsForm2 from "./FormDigitalProjects2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import SelectImageModal from "@/components/common/SelectImageModal";
import FloatingInput from "@/components/common/FloatingInput";
import SwitchPersonSentence from "../../CommonForms/SwitchPerson";
import AddRelatedDescriptionModal from "@/components/common/AddRelatedDescriptionModal";
import DualFloatingSelect, {
  TimeUnit,
} from "@/components/common/DualFloatingSelect";

interface ImageItem {
  src: string;
  file?: File;
  fromApi?: boolean;
  isMain?: boolean;
}

const FormDigitalProjects1: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { activeTab, setActiveTab } = usePerson();
  const router = useRouter();

  const setUserType = useFormStore((state) => state.setUserType);
  const setCurrentStep = useFormStore((state) => state.setCurrentStep);
  const { getFormData, setField } = useFormStore();

  const digitalData = getFormData("digital") as Record<string, any>;

  const [mainImage, setMainImage] = useState<string | null>(
    digitalData?.mainImage || null,
  );
  const [requestType, setRequestType] = useState<string>(
    digitalData?.requestType || "",
  );

  const [state, setState] = useState<{
    minBudget: string;
    maxBudget: string;
    title: string;
    description: string;
  }>({
    minBudget: digitalData?.minBudget || "",
    maxBudget: digitalData?.maxBudget || "",
    title: digitalData?.title || "",
    description: digitalData?.description || "",
  });

  // مقادیر مربوط به DualFloatingSelect
  const [durationUnit, setDurationUnit] = useState<TimeUnit | "">(
    digitalData?.durationUnit || "",
  );

  const [durationAmount, setDurationAmount] = useState<string>(
    digitalData?.durationAmount?.toString() || "",
  );

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [showNextForm, setShowNextForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (digitalData.person) {
      setActiveTab(digitalData.person);
    }
  }, [digitalData.person, setActiveTab]);

  useEffect(() => {
    if (digitalData?.person && activeTab !== digitalData.person) {
      setActiveTab(digitalData.person);
    }
  }, [activeTab, digitalData?.person, setActiveTab]);

  const handleDurationChange = (unit: TimeUnit | "", amount: string) => {
    setDurationUnit(unit);
    setDurationAmount(amount);

    setField("digital", "durationUnit", unit);
    setField("digital", "durationAmount", amount);
  };
  const handleRequestTypeChange = (
    value: string | number | (string | number)[],
  ) => {
    const selectedValue = String(Array.isArray(value) ? value[0] : value);

    setRequestType(selectedValue);
    setField("digital", "requestType", selectedValue);
  };
  const handleNextStep = () => {
    if (!state.title || !state.minBudget || !state.maxBudget) {
      setErrorMessage("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }
    setField("digital", "requestType", requestType);
    setField("digital", "minBudget", state.minBudget);
    setField("digital", "maxBudget", state.maxBudget);
    setField("digital", "title", state.title);
    setField("digital", "description", state.description);
    if (mainImage) setField("digital", "mainImage", mainImage);
    setField("digital", "person", activeTab);
    // ذخیره نهایی مقادیر زمان
    setField("digital", "durationUnit", durationUnit);
    setField("digital", "durationAmount", durationAmount);

    setUserType("digital");
    setCurrentStep(2);
    setErrorMessage("");
    setShowNextForm(true);
  };

  if (showNextForm) return <DigitalProjectsForm2 />;

  return (
    <div
      className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] sm:mt-4 px-3"
      ref={parentRef}
    >
      {/* بک‌گراند رنگی */}
      <div
        className="absolute inset-0 w-full h-full rounded-[20px]"
        style={{ backgroundColor: "rgba(247,247,247,0.98)", zIndex: 0 }}
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

      <div className="flex flex-col justify-start h-[95%] p-4 relative z-20 w-[80%] mx-auto">
        <StepProgress currentStep={1} />
        <SwitchPersonSentence />

        {errorMessage && (
          <div className="text-red-600 text-[1.8vh] font-bold mb-2 w-full text-center">
            {errorMessage}
          </div>
        )}

        {/* فرم دو ستونه */}
        <div className="relative z-20 flex flex-col sm:flex-row justify-center items-start w-full sm:w-[85%] gap-1 sm:gap-2 md:gap-6 mr-[10%]">
          {/* ستون اول */}
          <div className="flex flex-col gap-2 sm:gap-2 sm:flex-1 w-[99%] mr-[-10%] md:mr-[0%] sm:w-[85%] items-center sm:items-start">
            <div
              className="flex items-center gap-2 cursor-pointer my-[0.6vh] md:my-[2vh]"
              onClick={() => setImageModalOpen(true)}
            >
              <img
                src={mainImage || "/images/img_form.svg"}
                alt="عکس پروفایل"
                className="w-[7vh] h-[7vh] object-cover rounded-md"
              />
              <span className="text-[2.4vh] text-gray-400 font-medium">
                عکس پروفایل
              </span>
            </div>

            {/* حداقل بودجه */}
            <FloatingInput
              placeholder="حداقل بودجه (تومان)"
              variant="input"
              value={state.minBudget}
              onChange={(val) => setState({ ...state, minBudget: val })}
              inputType="price"
            />

            {/* توضیحات */}
            <ModalTriggerInput
              placeholder="توضیحات"
              value={state.description}
              onClick={() => setDescriptionModalOpen(true)}
            />

            {/* سطر آخر ستون اول: انتخاب واحد و مقدار */}
            <DualFloatingSelect
              onChange={handleDurationChange}
              width="77%"
              height="6.5vh"
            />
          </div>

          {/* ستون دوم */}
          <div className="flex flex-col gap-1 sm:gap-1 sm:flex-1 w-full items-start mt-[2%]">
            {/* نوع درخواست */}
            <FloatingSelect
              placeholder="نوع درخواست"
              value={requestType}
              options={[
                {
                  label: "درخواست دهنده",
                  value: "requester",
                },
                {
                  label: "ارائه دهنده",
                  value: "provider",
                },
              ]}
              onChange={(value) => handleRequestTypeChange(value)}
            />
            {/* عنوان آگهی */}
            <FloatingInput
              placeholder="عنوان آگهی"
              variant="input"
              value={state.title}
              onChange={(val) => setState({ ...state, title: val })}
              inputType="alphanumeric"
            />

            {/* حداکثر بودجه */}
            <FloatingInput
              placeholder="حداکثر بودجه (تومان)"
              variant="input"
              value={state.maxBudget}
              onChange={(val) => setState({ ...state, maxBudget: val })}
              inputType="price"
            />

            {/* دکمه مرحله بعد */}
            <Button
              onClick={handleNextStep}
              className="w-[76%] h-[7vh] mt-1 rounded-[10px]"
              style={{
                backgroundColor: "rgba(20,58,98,0.85)",
                color: "#FFFFFF",
                fontSize: "2.6vh",
                fontWeight: 600,
                textTransform: "none",
                marginTop: "2%",
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
              setField("digital", "mainImage", url);
              setField(
                "digital",
                "images",
                images.map((img) => img.file).filter(Boolean),
              );
            }
          }}
          parentRef={parentRef}
          userType="digital"
        />
        <AddRelatedDescriptionModal
          isOpen={descriptionModalOpen}
          onClose={() => setDescriptionModalOpen(false)}
          onSave={(desc: string) => {
            setState((prev) => ({ ...prev, description: desc }));
          }}
          parentRef={parentRef}
          titleModal="توضیحات پروژه"
          titleAdd="شرح پروژه:"
          titleAddHolder="عنوان"
          titleDescription="جزئیات:"
          userType="digital"
        />
      </div>
    </div>
  );
};

export default FormDigitalProjects1;
