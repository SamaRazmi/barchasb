"use client";

import { useField } from "formik";
import { InputHTMLAttributes } from "react";

// تعریف اینترفیس که علاوه بر پراپ‌های اختصاصی، تمام ویژگی‌های استاندارد Input را می‌پذیرد
interface TxtInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  lable: string;
  classStyle?: string;
}

export default function TxtInput({
  name,
  lable,
  placeholder,
  classStyle = "",
  ...rest
}: TxtInputProps) {
  // استفاده از useField برای اتصال به فرمیک
  const [field, meta] = useField(name);

  return (
    <div className={`flex flex-col gap-1 ${classStyle}`}>
      <label className="text-[20px] font-bold text-[#2D3E48]">{lable} :</label>

      <input
        {...field}
        {...rest}
        type="text"
        placeholder={placeholder}
        className={`w-full border-2 rounded-[20px] p-3 transition-colors
          ${meta.touched && meta.error ? "border-red-500" : "border-[#FEBD59]/80"}
          focus:border-[#ef9a1b] focus:outline-none`}
      />

      <div className="min-h-5 text-red-500 text-sm">
        {meta.touched && meta.error ? meta.error : " "}
      </div>
    </div>
  );
}
