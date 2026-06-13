"use client";

import ConverterFooter from "@/components/Converter/converterFooter";
import TestHeader from "@/components/tests/testHeader";
import { fetchWithAuth } from "@/lib/api";
import React, { useState } from "react";

type StatusType = "success" | "error" | "info" | "";

interface StatusState {
  type: StatusType;
  message: string;
}

export default function ImageToPDFTool() {
  const [images, setImages] = useState<File[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [status, setStatus] = useState<StatusState>({ type: "", message: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
    setDownloadLink("");
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      setStatus({
        type: "error",
        message: "لطفاً حداقل یک تصویر انتخاب کنید.",
      });
      return;
    }

    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);
      setStatus({ type: "info", message: "در حال تبدیل تصاویر به PDF..." });

      const response = await fetchWithAuth("/api/converter/to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const errorBody = contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        throw new Error(
          typeof errorBody === "string"
            ? errorBody
            : errorBody?.message || `خطای سرور (${response.status})`,
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setDownloadLink(url);
      setStatus({ type: "success", message: "PDF با موفقیت ساخته شد ✅" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "خطا در اتصال به سرور",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="bg-slate-50 flex flex-col items-center px-4 font-vazir relative"
        dir="rtl"
      >
        <div className="w-full max-w-8xl px-8 pt-5">
          <TestHeader />
        </div>

        <div className="text-center mb-4 max-w-xl">
          <div className="max-w-3xl mt-5 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              تبدیل تصویر به PDF
            </h2>
            <p className="text-sm text-slate-600 leading-7">
              با این ابزار می‌توانید تصاویر خود را به راحتی به یک فایل PDF تبدیل
              کنید.
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit}>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition ${
                images.length > 0
                  ? "border-green-400 bg-green-50"
                  : "border-slate-300 hover:border-blue-500 bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="text-4xl mb-2">
                {images.length > 0 ? "🖼️" : "📤"}
              </div>
              <p className="font-semibold text-slate-700">
                {images.length > 0
                  ? `${images.length} تصویر انتخاب شد`
                  : "انتخاب یا رها کردن تصاویر"}
              </p>
              <span className="text-xs text-slate-400 mt-1">
                می‌توانید چند تصویر انتخاب کنید
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-7 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md disabled:bg-slate-400"
            >
              {loading ? "در حال تبدیل..." : "تبدیل به PDF"}
            </button>
          </form>

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

          {downloadLink && (
            <div className="mt-6 text-center">
              <a
                href={downloadLink}
                download="converted.pdf"
                onClick={() =>
                  setTimeout(() => URL.revokeObjectURL(downloadLink), 2000)
                }
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                دانلود فایل PDF
              </a>
            </div>
          )}
        </div>

        <div className="max-w-3xl mt-10 text-center pb-10">
          <p className="text-slate-600 text-sm leading-7">
            چند تصویر را انتخاب کنید و آن‌ها را به یک فایل PDF تبدیل کنید.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 ">
        <ConverterFooter />
      </div>
    </div>
  );
}
