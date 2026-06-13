"use client";

import { useField } from "formik";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

// تعریف اینترفیس مشخص برای کامپوننت
interface ProfDateInputProps {
  lable: string;
  name: string;
  classStyle?: string;
}

export default function ProfDateInput({
  lable,
  name,
  classStyle = "",
  ...props
}: ProfDateInputProps) {
  // استفاده از useField برای مدیریت فیلد فرمیک
  const [field, meta, helpers] = useField(name);

  const tenYearsAgo = new DateObject({
    calendar: persian,
    locale: persian_fa,
  }).subtract(10, "years");

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-[18px] font-bold text-white/90">{lable} :</div>

      <DatePicker
        calendar={persian}
        locale={persian_fa}
        // تبدیل فیلد به مقدار قابل فهم برای DatePicker
        value={field.value || ""}
        placeholder="yyyy-mm-dd"
        maxDate={tenYearsAgo}
        // اصلاح دقیق تایپ در onChange
        onChange={(date: DateObject | null) => {
          helpers.setValue(date ? date.format("YYYY/MM/DD") : "");
        }}
        inputClass={`w-full p-2 border-2 rounded-[20px] bg-white/93 border-[#ffba52] 
        focus:border-[#ef9a1b] transition-colors focus:outline-none cursor-pointer placeholder:px-2 ${classStyle}`}
        {...props}
      />

      <div className="min-h-5 text-red-500 text-sm">
        {meta.touched && meta.error ? meta.error : " "}
      </div>
    </div>
  );
}
