"use client";

import { useField } from "formik";
import { InputHTMLAttributes } from "react";

// تعریف اینترفیس برای پراپ‌ها
interface ProfTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  lable: string;
  name: string; // نام فیلد در Formik اجباری است
  classStyle?: string;
}

export default function ProfTextInput({
  lable,
  name,
  classStyle = "",
  placeholder,
  ...rest // دریافت سایر پراپ‌های استاندارد اینپوت
}: ProfTextInputProps) {
  // استفاده از name برای اتصال به Formik
  const [field, meta] = useField(name);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-[18px] font-bold text-white/90">{lable} :</div>

      <input
        type="text"
        placeholder={placeholder}
        {...field}
        {...rest} // انتقال سایر پراپ‌ها به اینپوت
        className={`w-full p-2 border-2 rounded-[20px] bg-white/93 border-[#ffba52] focus:border-[#ef9a1b] transition-colors focus:outline-none cursor-pointer ${classStyle}`}
      />

      <div className="min-h-5 text-red-500 text-sm">
        {meta.touched && meta.error ? meta.error : " "}
      </div>
    </div>
  );
}
