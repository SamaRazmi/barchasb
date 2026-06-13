"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import { useFormStore } from "@/store/formStore";
import FloatingInput from "@/components/common/FloatingInput";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import SelectImageModal from "@/components/common/SelectImageModal";
import AddRelatedDescriptionModal from "@/components/common/AddRelatedDescriptionModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ImageItem {
  src: string;
  file?: File;
  fromApi?: boolean;
  isMain?: boolean;
}

const EditFormDigitalProjects: React.FC = () => {
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  const { getFormData, setField } = useFormStore();
  const digitalData = getFormData("editDigital") as Record<string, any>;

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [state, setState] = useState({
    title: "",
    minBudget: "",
    maxBudget: "",
    description: "",
    mainImage: "",
    skills: [] as string[],
    images: [] as ImageItem[],
  });

  useEffect(() => {
    if (digitalData) {
      setState({
        title: digitalData.title || "",
        minBudget: digitalData.minBudget || "",
        maxBudget: digitalData.maxBudget || "",
        description: digitalData.description || "",
        mainImage: digitalData.mainImage || "",
        skills: digitalData.skills || [],
        images: digitalData.images || [],
      });
    }
  }, [digitalData]);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setState((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }));
    setSkillInput("");
  };

  const handleRemoveSkill = (index: number) => {
    setState((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!state.title || !state.minBudget || !state.maxBudget) {
      setErrorMessage("لطفاً فیلدهای ضروری را پر کنید");
      return;
    }

    Object.entries(state).forEach(([key, value]) => {
      setField("editDigital", key, value);
    });

    router.push("/dashboard/myads");
  };

  return (
    <div
      ref={parentRef}
      className="relative z-10 flex flex-col h-[90%] mt-4 px-3"
    >
      {/* background */}
      <div
        className="absolute inset-0 rounded-[20px]"
        style={{ backgroundColor: "rgba(247,247,247,0.98)" }}
      />
      <img
        src="/images/bg_support_formik_desk.svg"
        className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
        alt=""
      />

      {/* back */}
      <div
        className="absolute top-1 right-2 z-30 bg-white p-1 rounded-full cursor-pointer"
        onClick={() => router.back()}
      >
        <Image
          src="/images/back_arrow.svg"
          alt="back"
          width={25}
          height={25}
          className="rotate-180"
        />
      </div>

      <div className="relative z-20 p-4">
        {errorMessage && (
          <div className="text-red-600 text-center mb-3 font-bold">
            {errorMessage}
          </div>
        )}

        {/* image */}
        <div
          className="flex items-center gap-3 my-4 cursor-pointer"
          onClick={() => setImageModalOpen(true)}
        >
          <img
            src={state.mainImage || "/images/img_form.svg"}
            className="w-[7vh] h-[7vh] rounded-md object-cover"
            alt="main"
          />
          <span className="text-gray-400">عکس پروژه</span>
        </div>

        {/* FORM - responsive single column on mobile, two columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mr-[10%] sm:mr-[5%] md:mr-[1%] w-full">
          <FloatingInput
            placeholder="عنوان پروژه"
            value={state.title}
            onChange={(v) => setState({ ...state, title: v })}
          />

          <FloatingInput
            placeholder="حداقل بودجه (تومان)"
            inputType="price"
            value={state.minBudget}
            onChange={(v) => setState({ ...state, minBudget: v })}
          />

          <FloatingInput
            placeholder="حداکثر بودجه (تومان)"
            inputType="price"
            value={state.maxBudget}
            onChange={(v) => setState({ ...state, maxBudget: v })}
          />

          <ModalTriggerInput
            placeholder="توضیحات پروژه"
            value={state.description}
            onClick={() => setDescriptionModalOpen(true)}
          />
        </div>

        {/* Skills section */}
        <div className="mt-8">
          <div className="flex gap-2 w-[60%]">
            <FloatingInput
              placeholder="مهارت مورد نیاز"
              value={skillInput}
              onChange={setSkillInput}
            />
            <Button
              onClick={handleAddSkill}
              style={{
                backgroundColor: "#143A62",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              افزودن
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {state.skills.map((skill, index) => (
              <div
                key={index}
                className="relative bg-[#143A62] text-white px-3 py-1 rounded"
              >
                {skill}
                <span
                  onClick={() => handleRemoveSkill(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* save button - centered on mobile, right-aligned on desktop */}
        <div className="mt-10">
          <Button
            onClick={handleSave}
            className="block w-[88%] md:w-[25%] h-[7vh] rounded-[10px] mx-auto md:mx-0"
            style={{
              backgroundColor: "rgba(20,58,98,0.85)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "2.4vh",
            }}
          >
            ثبت ویرایش
          </Button>
        </div>
      </div>

      {/* MODALS */}
      <SelectImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelect={(images: ImageItem[]) => {
          if (!images || images.length === 0) return;

          setState((prev) => ({
            ...prev,
            images,
            mainImage: images[0].fromApi
              ? images[0].src
              : URL.createObjectURL(images[0].file!),
          }));

          setField("editDigital", "images", images);
          setField("editDigital", "mainImage", images[0].fromApi);
        }}
        parentRef={parentRef}
        userType="editDigital"
      />

      <AddRelatedDescriptionModal
        isOpen={descriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        onSave={(desc: string) =>
          setState((prev) => ({ ...prev, description: desc }))
        }
        parentRef={parentRef}
        titleModal="توضیحات پروژه"
        titleAdd="شرح پروژه:"
        titleAddHolder="عنوان"
        titleDescription="جزئیات:"
        userType="digital"
      />
    </div>
  );
};

export default EditFormDigitalProjects;
