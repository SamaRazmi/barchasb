"use client";

import { useField } from "formik";
import { ChangeEvent, InputHTMLAttributes } from "react";

// استفاده از InputHTMLAttributes برای اینکه تمام ویژگی‌های استاندارد Input (مثل placeholder) را داشته باشیم
interface ProfTelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  lable: string;
  name: string; // نام فیلد در فرمیک اجباری است
  classStyle?: string;
}

export default function ProfTelInput({
  lable,
  name,
  classStyle = "",
  placeholder,
  ...rest // سایر پراپ‌های استاندارد مثل disabled یا type را اینجا دریافت می‌کنیم
}: ProfTelInputProps) {
  // استفاده از name برای ارتباط با فرمیک
  const [field, meta] = useField<string>(name);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-[18px] font-bold text-white/90">{lable} :</div>

      <input
        type="tel"
        placeholder={placeholder}
        {...field}
        {...rest} // سایر پراپ‌ها به اینپوت منتقل می‌شوند
        maxLength={11}
        value={field.value || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
          field.onChange({
            target: {
              name: field.name,
              value: onlyNumbers,
            },
          });
        }}
        className={`w-full p-2 border-2 rounded-[20px] bg-white/93 border-[#ffba52] focus:border-[#ef9a1b] transition-colors focus:outline-none cursor-pointer ${classStyle}`}
      />

      <div className="min-h-5 text-red-500 text-sm">
        {meta.touched && meta.error ? meta.error : " "}
      </div>
    </div>
  );
}
