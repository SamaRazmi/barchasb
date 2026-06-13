"use client";

import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import { useFormStore } from "@/store/formStore";
import FloatingInput from "@/components/common/FloatingInput";
import StepProgress from "@/components/common/StepProgress";
import DigitalProjectsForm1 from "./FormDigitalProjects1";
import Form3 from "../../CommonForms/Form3";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FormDigitalProjects2: React.FC = () => {
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);
  const { setField, getFormData } = useFormStore();

  const digitalData = getFormData("digital") as Record<string, any>;

  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(digitalData?.skills || []);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed) {
      const updatedSkills = [...skills, trimmed];
      setSkills(updatedSkills);
      setField("digital", "skills", updatedSkills);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, idx) => idx !== index);
    setSkills(updatedSkills);
    setField("digital", "skills", updatedSkills);
  };

  const handleNext = () => {
    if (skills.length === 0) {
      setErrorMessage("لطفاً حداقل یک مهارت اضافه کنید");
      return;
    }
    setErrorMessage("");
    setShowNext(true);
  };

  if (showPrev) return <DigitalProjectsForm1 />;
  if (showNext) return <Form3 />;

  return (
    <div
      className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] mt-4 px-3"
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
      {/* دکمه برگشت */}
      <div
        className="absolute top-1 right-2 cursor-pointer z-30 bg-white p-1 rounded-full flex justify-end items-center"
        onClick={() => router.push("/dashboard/createform")}
      >
        <Image
          src="/images/back_arrow.svg"
          alt="Back"
          width={25}
          height={25}
          className="rotate-180"
        />
      </div>

      <div className="flex flex-col justify-start h-[95%] p-4 relative z-20 w-[96%] sm:w-[80%] mx-auto">
        <StepProgress currentStep={2} />

        {errorMessage && (
          <div className="w-full text-center text-red-600 text-[1.6vh] font-bold mt-4">
            {errorMessage}
          </div>
        )}

        {/* بخش FloatingInput + مهارت‌ها + دکمه‌ها */}
        <div className="flex flex-col items-center h-[85%] w-full mr-[8%] mt-[6vh]">
          {/* FloatingInput و دکمه افزودن */}
          <div className="flex gap-2 w-[85%] sm:w-[70%] ml-auto justify-start">
            <FloatingInput
              placeholder="مهارت‌های مورد نیاز"
              variant="input"
              value={skillInput}
              onChange={setSkillInput}
              width="70%"
              inputType="text"
            />
            <Button
              onClick={handleAddSkill}
              className="h-[5vh] sm:h-[7vh] rounded-[10px] text-[1.8vh] sm:text-[2.2vh]"
              style={{
                backgroundColor: "#143A62",
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              افزودن
            </Button>
          </div>

          {/* نمایش مهارت‌ها */}
          <div className="flex flex-wrap gap-2 bg-white px-4 py-2 rounded-[10px] mt-1 w-[80%] max-h-[50vh] overflow-auto ml-auto justify-start">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="relative bg-[#143A62] text-white rounded-md p-2 pl-4 pr-8 flex items-center shadow"
              >
                {skill}
                <div
                  onClick={() => handleRemoveSkill(index)}
                  className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer text-[10px]"
                >
                  ✕
                </div>
              </div>
            ))}
          </div>

          {/* دکمه‌ها کنار هم سمت چپ */}
          <div className="flex gap-2 mt-20 w-[80%] sm:w-[70%] mx-auto justify-end whitespace-nowrap">
            <Button
              onClick={() => setShowPrev(true)}
              className="h-[7vh] rounded-[10px] text-[1.4vh] sm:text-[2.2vh]"
              style={{
                backgroundColor: "#00B6FF",
                color: "#FFFFFF",
                fontWeight: 600,
                textTransform: "none",
                width: "25%",
              }}
            >
              مرحله قبل
            </Button>

            <Button
              onClick={handleNext}
              className="h-[7vh] rounded-[10px] text-[1.4vh] sm:text-[2.2vh]"
              style={{
                backgroundColor: "rgba(20,58,98,0.85)",
                color: "#FFFFFF",
                fontWeight: 600,
                textTransform: "none",
                width: "25%",
              }}
            >
              مرحله بعد
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDigitalProjects2;
