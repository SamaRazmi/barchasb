"use client";

import Image from "next/image";
import { useRef, useState, ChangeEvent } from "react";
import { useFormikContext } from "formik";
import ProfTextInput from "./profileTxtInput";
import ProfTelInput from "./profileTelInput";
import ProfDateInput from "./profileDateInput";
import ProfDropdown from "./profileDropdown";

// فرض بر این است که اینترفیس کلی فرم شما به این صورت است
interface FormValues {
  personal: {
    avatar: string;
    fullName: string;
    phone: string;
    birthDate: string;
    gender: string;
    maritalStatus: string;
  };
}

const DEFAULT_AVATAR = "/images/Profile.png";

export default function UploadInput() {
  // تایپ‌دهی به useRef برای المنت اینپوت فایل
  const inputRef = useRef<HTMLInputElement>(null);

  // استفاده از جنریک FormValues برای Formik
  const { values, setFieldValue } = useFormikContext<FormValues>();

  const [loading, setLoading] = useState<boolean>(false);

  const image = values.personal.avatar || DEFAULT_AVATAR;
  const showPlus = image === DEFAULT_AVATAR && !loading;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setFieldValue("personal.avatar", url);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 pt-5">
      {/* IMAGE */}
      <div
        className="relative w-40 h-40 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Image
          src={image}
          alt="profile"
          fill
          className="rounded-full object-cover border-2 border-[#FEBD59]"
        />

        {/* PLUS ICON */}
        {showPlus && (
          <Image
            src="/images/plus.jpg"
            alt="add"
            width={40}
            height={40}
            className="absolute bottom-0 right-2 border-2 border-[#FEBD59] rounded-full bg-white"
          />
        )}

        {/* LOADING SPINNER */}
        {loading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* FIELDS */}
      <div className="flex flex-col gap-10 justify-center items-center ">
        <ProfTextInput name="personal.fullName" lable="نام و نام خانوادگی" />
        <ProfTelInput name="personal.phone" lable="شماره همراه" />
        <ProfDateInput name="personal.birthDate" lable="تاریخ تولد" />

        <div className="flex flex-col gap-18 justify-center items-center">
          <div className="mb-[60px]">
            <ProfDropdown
              name="personal.gender"
              label="جنسیت"
              options={[
                { tag: "مرد", value: "male" },
                { tag: "زن", value: "female" },
              ]}
            />
          </div>
          <div>
            <ProfDropdown
              name="personal.maritalStatus"
              label="وضعیت تأهل"
              options={[
                { tag: "مجرد", value: "single" },
                { tag: "متأهل", value: "married" },
              ]}
            />
          </div>
        </div>
      </div>

      <img
        src="/images/logo1.png"
        alt="logo"
        className="w-[135px] h-[105px] mt-12"
      />
    </div>
  );
}
