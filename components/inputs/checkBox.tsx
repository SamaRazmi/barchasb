import { useField } from "formik";
import Image from "next/image";

// تعریف تایپ برای propsهای کامپوننت
interface CheckBoxProps {
  name: string;
  label: string;
  value: string | number; // بسته به نوع مقداری که به فیلد می‌دهید
}

export default function CheckBox({ name, label, value }: CheckBoxProps) {
  // مشخص کردن تایپ برای useField در صورت نیاز (معمولاً خودش تشخیص می‌دهد اما صراحت بهتر است)
  const [field] = useField({ name, type: "radio", value });

  const isSelected = field.checked;

  return (
    <label className="relative h-8 cursor-pointer flex items-center gap-2">
      <input
        type="radio"
        {...field}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />

      <Image
        src={isSelected ? "/images/afterCheck.svg" : "/images/beforCheck.svg"}
        alt={label}
        width={32}
        height={32}
      />
      <p>{label}</p>
    </label>
  );
}
