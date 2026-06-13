"use client";

import ConverterFooter from "@/components/Converter/converterFooter";
import TestHeader from "@/components/tests/testHeader";
import { fetchWithAuth } from "@/lib/api";
import React, { useState, ChangeEvent, FormEvent } from "react";

export default function CompressPdfTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [status, setStatus] = useState<string>("");
  const [downloadLink, setDownloadLink] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setDownloadLink("");
    setStatus("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus("لطفاً یک فایل PDF انتخاب کنید.");
      return;
    }

    setStatus("در حال فشرده‌سازی فایل...");

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      // استفاده از fetchWithAuth به جای fetch معمولی
      // این تابع هدر Authorization را به صورت خودکار اضافه می‌کند
      const response = await fetchWithAuth("/api/converter/compress-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `خطا: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setDownloadLink(url);
      setStatus("✅ فشرده‌سازی با موفقیت انجام شد");
    } catch (err) {
      console.error(err);
      setStatus(err instanceof Error ? err.message : "❌ خطا در اتصال به سرور");
    }
  };

  return (
    <div>
      <div
        className="bg-slate-50 flex flex-col items-center px-4 font-vazir"
        dir="rtl"
      >
        <div className="w-full max-w-8xl px-8 pt-5">
          <TestHeader />
        </div>

        {/* عنوان */}
        <div className="text-center mb-4 mt-10 max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            فشرده‌سازی PDF
          </h2>
          <p className="text-sm text-slate-600 leading-7">
            با این ابزار می‌توانید حجم فایل‌های PDF خود را کاهش دهید تا ارسال و
            بارگذاری آن‌ها آسان‌تر شود.
          </p>
        </div>

        {/* کارت ابزار */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit}>
            {/* آپلود فایل */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition
              ${
                selectedFile
                  ? "border-green-400 bg-green-50"
                  : "border-slate-300 hover:border-blue-500 bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />

              <div className="text-4xl mb-2">{selectedFile ? "✅" : "📄"}</div>
              <p className="font-semibold text-slate-700">
                {selectedFile ? selectedFile.name : "انتخاب فایل PDF"}
              </p>
              <span className="text-xs text-slate-400 mt-1">
                یا فایل را اینجا رها کنید
              </span>
            </div>

            {/* دکمه ارسال */}
            <button
              type="submit"
              className="w-full mt-7 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md"
            >
              فشرده‌سازی فایل
            </button>
          </form>

          {/* وضعیت */}
          {status && (
            <div className="mt-5 text-sm p-3 rounded-lg text-center bg-slate-100 text-slate-700">
              {status}
            </div>
          )}

          {/* لینک دانلود */}
          {downloadLink && (
            <div className="mt-6 text-center">
              <a
                href={downloadLink}
                download="compressed.pdf"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                دانلود فایل فشرده
              </a>
            </div>
          )}
        </div>

        <div className="max-w-3xl mt-5 text-center pb-10">
          <p className="text-slate-600 text-sm leading7">
            حجم فایل PDF شما بسته به ساختار آن ممکن است کاهش چشمگیری نداشته
            باشد.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 ">
        <ConverterFooter />
      </div>{" "}
    </div>
  );
}
