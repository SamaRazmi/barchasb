"use client";

import ConverterFooter from "@/components/Converter/converterFooter";
import TestHeader from "@/components/tests/testHeader";
import { fetchWithAuth } from "@/lib/api";
import { useState } from "react";

/* =========================================
   Types
========================================= */

type ImageFormat = "jpeg" | "png" | "webp" | "avif";

interface StatusState {
  type: "success" | "error" | "info" | "";
  message: string;
}

/* =========================================
   Component
========================================= */

export default function ImageFormatConverter() {
  const [image, setImage] = useState<File | null>(null);

  const [format, setFormat] = useState<ImageFormat>("jpeg");

  const [quality, setQuality] = useState<number>(80);

  const [loading, setLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<StatusState>({
    type: "",
    message: "",
  });

  /* =========================================
     Handle Convert
  ========================================= */

  // ... (Types و سایر بخش‌ها بدون تغییر)

  const handleConvert = async (): Promise<void> => {
    if (!image) {
      setStatus({ type: "error", message: "لطفاً یک تصویر انتخاب کنید." });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "در حال تبدیل تصویر..." });

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("format", format);
      formData.append("quality", quality.toString());

      // استفاده از fetchWithAuth برای اضافه شدن خودکار توکن
      const res = await fetchWithAuth("/api/converter/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "خطا در تبدیل تصویر");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted.${format === "jpeg" ? "jpg" : format}`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus({
        type: "success",
        message: "تصویر با موفقیت تبدیل و دانلود شد ✅",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "خطای ارتباط با سرور",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (بقیه کد JSX بدون تغییر)

  /* =========================================
     Render
  ========================================= */

  return (
    <div>
      <div
        className="bg-slate-50 flex flex-col items-center px-4 font-vazir"
        dir="rtl"
      >
        <div className="w-full max-w-8xl px-8 pt-5">
          <TestHeader />
        </div>

        <div className="text-center mb-2 max-w-xl">
          <div className="max-w-3xl mt-5 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              تبدیل فرمت تصویر
            </h2>

            <p className="text-sm text-slate-600 leading-7">
              با این ابزار می‌توانید تصاویر خود را به فرمت‌های مختلف مثل JPG،
              PNG، WEBP و AVIF تبدیل کنید و کیفیت خروجی را به صورت دلخواه تنظیم
              کنید.
            </p>
          </div>
        </div>

        {/* کارت ابزار */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-5">
          {/* آپلود تصویر */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition
            ${
              image
                ? "border-green-400 bg-green-50"
                : "border-slate-300 hover:border-blue-500 bg-slate-50"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] || null;

                setImage(file);
              }}
            />

            <div className="text-4xl mb-2">{image ? "🖼️" : "📤"}</div>

            <p className="font-semibold text-slate-700">
              {image ? image.name : "انتخاب یا رها کردن تصویر اینجا"}
            </p>

            <span className="text-xs text-slate-400 mt-1">
              فرمت‌های رایج مانند JPG، PNG، WEBP و...
            </span>
          </div>

          {/* تنظیمات تبدیل */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* فرمت خروجی */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-700">
                فرمت خروجی
              </label>

              <div className="grid grid-cols-4 gap-2 text-sm">
                {(["jpeg", "png", "webp", "avif"] as ImageFormat[]).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormat(item)}
                      className={`py-2 rounded-xl border font-semibold transition
                      ${
                        format === item
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {item.toUpperCase()}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* کیفیت */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-700">
                کیفیت خروجی
              </label>

              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuality(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />

              <div className="text-xs text-slate-500 mt-2">
                کیفیت:
                <span className="font-bold"> {quality}</span> / 100
                <br />
                برای فرمت PNG تأثیری ندارد.
              </div>
            </div>
          </div>

          {/* دکمه تبدیل */}
          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md disabled:bg-slate-400"
          >
            {loading ? "در حال تبدیل تصویر..." : "تبدیل تصویر"}
          </button>

          {/* وضعیت */}
          {status.message && (
            <div
              className={`mt-5 text-sm p-3 rounded-lg text-center ${
                status.type === "error"
                  ? "bg-red-50 text-red-600"
                  : status.type === "success"
                    ? "bg-green-50 text-green-600"
                    : "bg-blue-50 text-blue-600"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>

        {/* توضیح پایین */}
        <div className="max-w-3xl mt-5 text-center pb-10">
          <p className="text-slate-600 text-sm leading-7">
            عکس‌های خود را به فرمت‌های JPG، PNG، WEBP یا AVIF با کیفیت دلخواه
            تبدیل کنید.
          </p>
        </div>
      </div>

      <ConverterFooter />
    </div>
  );
}
