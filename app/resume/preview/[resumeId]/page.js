"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { fetchResumeById, uploadResumePDF } from "@/lib/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ResumePreview = dynamic(
  () => import("@/components/resume/ResumePreview"),
  {
    ssr: false,
  },
);
const BackButton = dynamic(() => import("@/components//tests/backButton"), {
  ssr: false,
});
export default function PreviewPage() {
  const params = useParams();
  const resumeId = params?.resumeId;
  const componentRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadResume() {
      const saved = localStorage.getItem("resumeData");
      if (saved) {
        setData(JSON.parse(saved));
        setLoading(false);
        return;
      }
      if (resumeId) {
        try {
          const resumeFromServer = await fetchResumeById(resumeId);
          setData(resumeFromServer);
        } catch (err) {
          console.error("Failed to fetch resume:", err);
          alert("خطا در دریافت اطلاعات رزومه");
        }
      }
      setLoading(false);
    }
    if (resumeId !== undefined) loadResume();
    else setLoading(false);
  }, [resumeId]);

  const handlePrint = () => {
    if (!componentRef.current) return;
    const printWindow = window.open("", "PRINT", "width=900,height=600");
    if (!printWindow) return;
    const styles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((node) => node.outerHTML)
      .join("\n");
    printWindow.document.write(`
        <html><head><title>پرینت رزومه</title>${styles}</head>
        <body>${componentRef.current.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };
  const handleSavePDFToServer = async () => {
    if (!componentRef.current) return;
    setUploading(true);

    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2, // کیفیت بالا
        useCORS: true,
        logging: false,
        backgroundColor: null, // این باعث می‌شود لبه‌های گرد رزومه تمیز در بیایند
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth(); // ۲۱۰ میلی‌متر

      // محاسبه ارتفاع جدید بر اساس تناسب عرض به ارتفاع تصویر
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // اگر ارتفاع محاسبه شده از ۲۹۷ بیشتر شد، آن را به ۲۹۷ محدود می‌کنیم
      // اما اگر کمتر بود، همان مقدار واقعی را قرار می‌دهیم تا چیزی بریده نشود
      const finalHeight = pdfHeight > 297 ? 297 : pdfHeight;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, finalHeight);

      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], `resume-${resumeId}.pdf`, {
        type: "application/pdf",
      });

      await uploadResumePDF(resumeId, pdfFile);
      alert("PDF با موفقیت ذخیره شد.");
    } catch (error) {
      console.error(error);
      alert("خطا در تولید PDF");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("لطفاً یک فایل PDF انتخاب کنید");
      return;
    }
    if (!resumeId) {
      alert("شناسه رزومه وجود ندارد");
      return;
    }
    setUploading(true);
    try {
      await uploadResumePDF(resumeId, file);
      alert("فایل PDF با موفقیت آپلود شد");
    } catch (error) {
      alert("خطا در آپلود فایل: " + error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (loading)
    return <div className="text-center p-10">در حال بارگذاری...</div>;
  if (!data) return <div className="text-center p-10">رزومه‌ای یافت نشد</div>;

  return (
    <div
      style={{ fontFamily: "Goozar" }}
      className="flex font-[Goozar] flex-col items-center gap-5 min-h-screen "
    >
      <div className="flex md:gap-80 gap-32 m-5">
        <BackButton
          label="داشبورد"
          ImgSrc="/images/homeicon.svg"
          onClick={() => router.push("/dashboard")}
        />
        <BackButton
          label="بازگشت"
          ImgSrc="/images/back_arrow.svg"
          onClick={() => router.back()}
        />
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={handlePrint}
          className="px-8 py-3 bg-[#102e4e] text-white font-bold rounded-xl shadow-lg hover:shadow-[#102e4e]/40 transition flex items-center gap-2"
        >
          <span>📄</span> پرینت / دانلود PDF
        </button>

        <button
          onClick={handleSavePDFToServer}
          disabled={uploading}
          className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          }`}
        >
          {uploading ? "⏳ در حال پردازش..." : "💾 ذخیره و ثبت نهایی"}
        </button>

        <label
          className={`cursor-pointer px-8 py-3 rounded-xl font-bold transition ${
            uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white shadow-md flex items-center gap-2`}
        >
          📎 آپلود فایل PDF (دستی)
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <div ref={componentRef}>
        <ResumePreview style={{ fontFamily: "Goozar" }} data={data} />
      </div>
    </div>
  );
}
