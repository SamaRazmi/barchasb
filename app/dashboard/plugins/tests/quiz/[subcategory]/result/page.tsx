"use client";

import ResultFactory from "@/components/tests/result/ResultFactory";
import TestHeader from "@/components/tests/testHeader";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const sessionId = searchParams.get("sessionId");
  const subcategory = params?.subcategory as string;

  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // 1. تلاش برای خواندن با sessionId دقیق
    const storedResult = sessionStorage.getItem(`quiz_result_${sessionId}`);

    // 2. اگر نبود، تلاش برای خواندن با کلید عمومی‌تری که ممکن است در QuizClient ذخیره کرده باشیم
    const fallbackResult = sessionStorage.getItem(
      `quiz_result_last_${subcategory}`,
    );

    if (storedResult) {
      setData(JSON.parse(storedResult));
    } else if (fallbackResult) {
      setData(JSON.parse(fallbackResult));
    } else {
      // اگر نتیجه‌ای نیست، شاید کاربر مستقیم رفرش کرده
      setError("نتیجه‌ای یافت نشد. لطفاً آزمون را مجدداً انجام دهید.");
    }
  }, [sessionId, subcategory]);

  if (!sessionId)
    return <div className="p-10 text-center">شناسه آزمون یافت نشد.</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  if (!data)
    return <div className="p-10 text-center">در حال پردازش نتیجه...</div>;

  return (
    <main className="min-h-screen pt-8 pb-20 px-5">
      <div className="px-20">
        <TestHeader />
      </div>
      <ResultFactory subcategory={subcategory} data={data} />
    </main>
  );
}
