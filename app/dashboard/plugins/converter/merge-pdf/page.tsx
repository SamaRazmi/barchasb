"use client";

import ConverterFooter from "@/components/Converter/converterFooter";
import TestHeader from "@/components/tests/testHeader";
import { fetchWithAuth } from "@/lib/api";
import { useState } from "react";

type StatusType = "success" | "error" | "info" | "";

interface StatusState {
  type: StatusType;
  message: string;
}

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusState>({
    type: "",
    message: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
    setMergedPdfUrl(null);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length < 2) {
      setStatus({
        type: "error",
        message: "لطفاً حداقل دو فایل PDF انتخاب کنید.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", message: "در حال ادغام فایل‌ها در سرور..." });

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      // استفاده از fetchWithAuth به جای fetch معمولی
      const res = await fetchWithAuth("/api/converter/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `خطای سرور: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      setStatus({ type: "success", message: "فایل با موفقیت ادغام شد ✅" });
    } catch (err) {
      console.error("Frontend Error:", err);
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "خطا در ارتباط با سرور",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="bg-slate-50 min-h-screen flex flex-col items-center px-4 font-vazir"
        dir="rtl"
      >
        <div className="w-full max-w-8xl px-8 pt-5">
          <TestHeader />
        </div>

        <div className="text-center mb-2 max-w-xl mt-10">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            ادغام فایل‌های PDF
          </h2>
          <p className="text-sm text-slate-600 leading-7">
            با ابزار آنلاین ادغام PDF می‌توانید چندین فایل را در یک فایل واحد
            ترکیب کنید.
          </p>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit}>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition
            ${files.length > 0 ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-blue-500 bg-slate-50"}`}
            >
              <input
                type="file"
                accept="application/pdf"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="text-4xl mb-2">
                {files.length > 0 ? "📚" : "📂"}
              </div>
              <p className="font-semibold text-slate-700">
                {files.length > 0
                  ? `${files.length} فایل انتخاب شده است`
                  : "انتخاب فایل‌های PDF جهت ادغام"}
              </p>
              <span className="text-xs text-slate-400 mt-1">حداقل ۲ فایل</span>
            </div>

            {files.length > 0 && (
              <div className="mt-6 bg-slate-50 rounded-xl p-4 max-h-40 overflow-y-auto border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2">
                  لیست فایل‌ها:
                </p>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-600 mb-1 truncate"
                  >
                    {idx + 1}. {file.name}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || files.length < 2}
              className={`w-full mt-7 font-bold py-4 rounded-xl transition shadow-md
            ${loading || files.length < 2 ? "bg-slate-300 cursor-not-allowed text-slate-500" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {loading ? "در حال پردازش..." : "ادغام و ساخت PDF واحد"}
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

          {mergedPdfUrl && (
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <a
                href={mergedPdfUrl}
                download="merged.pdf"
                className="inline-block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition mb-6"
              >
                دانلود فایل ادغام شده ✅
              </a>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-80">
                <iframe
                  src={mergedPdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </div>

        <div className="max-w-3xl mt-10 text-center">
          <p className="text-slate-600 text-sm leading-7">
            فایل‌های ادغام شده در مرورگر شما نمایش داده می‌شوند و می‌توانید
            آن‌ها را دانلود کنید.
          </p>
        </div>
      </div>
      <ConverterFooter />
    </div>
  );
}
