"use client";

import ConverterFooter from "@/components/Converter/converterFooter";
import TestHeader from "@/components/tests/testHeader";
import { fetchWithAuth } from "@/lib/api";
import { useState } from "react";

/* =========================================
   Types
========================================= */

type StatusType = "success" | "error" | "info" | "";

interface StatusState {
  type: StatusType;
  message: string;
}

/* =========================================
   Component
========================================= */

export default function ExtractPdfPagesTool() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<StatusState>({
    type: "",
    message: "",
  });

  /* =========================================
     Parse Pages
  ========================================= */

  const parsePages = (input: string): number[] => {
    const result: number[] = [];

    const parts = input.split(",");

    for (let part of parts) {
      part = part.trim();

      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);

        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            result.push(i);
          }
        }
      } else {
        const num = Number(part);

        if (!isNaN(num)) {
          result.push(num);
        }
      }
    }

    return [...new Set(result)].sort((a, b) => a - b);
  };

  /* =========================================
     Handle Extract
  ========================================= */

  const handleExtract = async (): Promise<void> => {
    if (!pdfFile || !pages) {
      setStatus({
        type: "error",
        message: "لطفاً فایل و شماره صفحات را وارد کنید.",
      });

      return;
    }

    const parsedPages = parsePages(pages);

    if (parsedPages.length === 0) {
      setStatus({
        type: "error",
        message: "فرمت شماره صفحات نامعتبر است.",
      });

      return;
    }

    setLoading(true);

    setStatus({
      type: "info",
      message: "در حال پردازش فایل...",
    });

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("pages", JSON.stringify(parsedPages));

      const res = await fetchWithAuth("/api/converter/extract-pages", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        const errorBody = contentType.includes("application/json")
          ? await res.json()
          : await res.text();

        throw new Error(
          typeof errorBody === "string"
            ? errorBody
            : errorBody?.message || "Server error",
        );
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `extracted_${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      setStatus({
        type: "success",
        message: "فایل آماده شد و دانلود شروع شد ✅",
      });
    } catch (error) {
      console.error(error);

      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "خطایی رخ داد. دوباره تلاش کنید.",
      });
    } finally {
      setLoading(false);
    }
  };

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
              ابزار آنلاین استخراج صفحات PDF
            </h2>

            <p className="text-sm text-[#525362] leading-7">
              با استفاده از این ابزار می‌توانید صفحات دلخواه را از یک فایل PDF
              جدا کرده و فایل جدیدی بسازید. این ابزار سریع، رایگان و بدون نیاز
              به نصب نرم‌افزار است و در موبایل و دسکتاپ به راحتی کار می‌کند.
            </p>
          </div>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition ${
              pdfFile
                ? "border-green-400 bg-green-50"
                : "border-slate-300 hover:border-blue-500 bg-slate-50"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] || null;
                setPdfFile(file);
              }}
            />

            <div className="text-4xl mb-2">{pdfFile ? "✅" : "📄"}</div>

            <p className="font-semibold text-slate-700">
              {pdfFile ? pdfFile.name : "انتخاب فایل PDF"}
            </p>

            <span className="text-xs text-slate-400 mt-1">
              یا فایل را اینجا رها کنید
            </span>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              شماره صفحات
            </label>

            <input
              value={pages}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPages(e.target.value)
              }
              placeholder="مثال: 1-3,5,8"
              dir="ltr"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <p className="text-xs text-slate-400 mt-2">
              برای بازه از خط تیره (-) و برای جدا کردن از کاما استفاده کنید
            </p>
          </div>

          <button
            onClick={handleExtract}
            disabled={loading}
            className="w-full mt-7 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md disabled:bg-slate-400"
          >
            {loading ? "در حال پردازش..." : "استخراج صفحات"}
          </button>

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

        <div className="mt-5 pb-10">
          <p className="text-slate-600 text-sm leading-7">
            صفحات دلخواه خود را از فایل PDF جدا کنید و یک فایل جدید بسازید.
          </p>
        </div>
      </div>

      <ConverterFooter />
    </div>
  );
}
