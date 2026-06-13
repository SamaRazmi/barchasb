"use client";

import TestFooter from "@/components/tests/testFooter";
import TestHeader from "@/components/tests/testHeader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Clock, HelpCircle, ArrowRight } from "lucide-react"; // نصب کن: npm install lucide-react

export default function QuizIntroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subcategory } = useParams<{ subcategory: string }>();

  const quizTitle = searchParams.get("title") ?? "آزمون";
  const quizDesc =
    searchParams.get("desc") ??
    "این آزمون برای ارزیابی سطح دانش شما طراحی شده است.";
  const totalQuestions = Number(searchParams.get("totalQuestions") ?? 0);
  const timeLimitMinutes = Number(searchParams.get("timeLimit") ?? 0);

  const startQuiz = () => {
    const query = new URLSearchParams({
      title: quizTitle,
      desc: quizDesc,
      totalQuestions: String(totalQuestions),
      timeLimit: String(timeLimitMinutes),
    });
    router.push(
      `/dashboard/plugins/tests/quiz/${subcategory}?${query.toString()}`,
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 pt-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        <TestHeader />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full  max-w-lg  bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {quizTitle}
            </h1>
            <p className="text-slate-500 mt-3 leading-relaxed max-w-sm mx-auto">
              {quizDesc}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
              <HelpCircle className="text-indigo-500" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  تعداد سوال
                </p>
                <p className="font-bold text-slate-800">
                  {totalQuestions > 0 ? totalQuestions : "-"}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
              <Clock className="text-indigo-500" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  زمان آزمون
                </p>
                <p className="font-bold text-slate-800">
                  {timeLimitMinutes > 0 ? `${timeLimitMinutes} دقیقه` : "آزاد"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}

          <div className="flex justify-center">
            <button
              onClick={startQuiz}
              className="startButtom flex items-center justify-center gap-2 text-white rounded-[15px] md:text-[18px] text-[16px] font-bold transition-colors duration-300 cursor-pointer w-full max-w-[200px] py-3"
            >
              <span>شروع آزمون</span>
              <span> آماده‌ام </span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            پیش از شروع، از اتصال پایدار اینترنت اطمینان حاصل کنید.
          </p>
        </div>
      </div>

      <TestFooter />
    </main>
  );
}
