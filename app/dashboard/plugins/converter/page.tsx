"use client";
import ConverterFooter from "@/components/Converter/converterFooter";
import ConverterHeader from "@/components/Converter/converterHeader";
import ToolCard from "@/components/Converter/tools/toolCard";
import TestHeader from "@/components/tests/testHeader";
import { FileText, Scissors, Image, FilePlus } from "lucide-react";
import { JSX } from "react";

export default function ToolsPage(): JSX.Element {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div
        className="pt-10 px-6 flex flex-col items-center font-vazir"
        dir="rtl"
      >
        <div className="w-full max-w-8xl">
          <TestHeader />
        </div>

        {/* Hero */}
        <div className="text-center max-w-8xl mb-10">
          <div className="mb-3">
            <ConverterHeader />
          </div>
          <p className="text-sm text-slate-600 leading-7">
            با استفاده از این ابزارها می‌توانید فایل‌های PDF و تصاویر خود را به
            راحتی مدیریت کنید. امکان ادغام PDF، فشرده‌سازی فایل‌ها، استخراج
            صفحات و تبدیل تصاویر به PDF تنها با چند کلیک در دسترس شما قرار دارد.
          </p>
        </div>
        {/* Tools Grid */}
        <div className="flex flex-wrap gap-8 w-full justify-center max-w-6xl">
          <ToolCard
            title="ادغام PDF"
            description="چندین فایل PDF را در یک فایل ترکیب کنید"
            href="converter/merge-pdf"
            icon={<FilePlus size={28} />}
          />

          <ToolCard
            title="فشرده سازی PDF"
            description="حجم فایل PDF را به راحتی کاهش دهید"
            href="converter/compress-pdf"
            icon={<FileText size={28} />}
          />

          <ToolCard
            title="تبدیل تصویر به PDF"
            description="چند تصویر را در یک فایل PDF قرار دهید"
            href="converter/image-to-pdf"
            icon={<Image size={28} />}
          />

          <ToolCard
            title="استخراج صفحات"
            description="صفحات خاصی را از یک فایل PDF جدا کنید"
            href="converter/extract-pages"
            icon={<Scissors size={28} />}
          />

          <ToolCard
            title="تبدیل فرمت تصویر"
            description="تبدیل تصاویر بین فرمت‌های مختلف"
            href="converter/image-convert"
            icon={<Image size={28} />}
          />
        </div>
        {/* SEO Section */}
        <div className="max-w-3xl text-center mt-14 mb-10">
          <p className="text-slate-600 leading-7 text-sm">
            مجموعه‌ای از ابزارهای آنلاین برای تبدیل، ادغام، فشرده‌سازی و مدیریت
            فایل‌های PDF و تصاویر. بدون نصب نرم‌افزار، سریع و کاملاً آنلاین.
          </p>
        </div>
      </div>

      <div>
        <ConverterFooter />
      </div>
    </div>
  );
}
