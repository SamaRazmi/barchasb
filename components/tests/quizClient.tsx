"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QuizTimer from "./timer";
import NextButton from "./nextButton";
import ResultButton from "./resultButton";
import { fetchWithAuth } from "@/lib/api";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface QuizClientProps {
  questions: Question[];
  timeLimit?: number | null;
  sessionId: string;
  subcategory: string;
}

type SelectedAnswers = Record<string, string>;

export default function QuizClient({
  questions,
  timeLimit,
  sessionId,
  subcategory,
}: QuizClientProps) {
  const router = useRouter();

  const STORAGE_KEY = `quiz_progress_${subcategory}`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<SelectedAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. لود کردن وضعیت از Storage هنگام Mount شدن
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { savedIndex, savedSelected } = JSON.parse(saved);
        setCurrentIndex(savedIndex);
        setSelected(savedSelected);
      } catch (e) {
        console.error("Error parsing saved quiz state", e);
      }
    }
    setIsLoaded(true);
  }, [STORAGE_KEY]);

  // 2. ذخیره کردن وضعیت در Storage با هر تغییر
  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedIndex: currentIndex, savedSelected: selected }),
      );
    }
  }, [currentIndex, selected, isLoaded, STORAGE_KEY]);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (optionId: string) => {
    setSelected((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: selected[q.id] ?? null,
    }));

    try {
      const res = await fetchWithAuth("/api/tests/submit", {
        method: "POST",
        body: JSON.stringify({ sessionId, answers }),
      });

      if (!res.ok) throw new Error("ارسال پاسخ‌ها ناموفق");

      // اضافه کردن این بخش برای اینکه ResultPage کار کند:
      const resultData = await res.json();
      sessionStorage.setItem(
        `quiz_result_${sessionId}`,
        JSON.stringify(resultData),
      );

      // پاکسازی پس از اتمام موفق
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(`active_session_${subcategory}`);

      // هدایت به صفحه نتیجه
      router.replace(
        `/dashboard/plugins/tests/quiz/${subcategory}/result?sessionId=${sessionId}`,
      );
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert("خطا در ارسال نتایج.");
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!submitting) handleSubmit();
  };

  if (!questions.length) {
    return <p className="text-center mt-10">سوالی وجود ندارد</p>;
  }

  if (!isLoaded || !currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const isPersian = (text: string) => /[\u0600-\u06FF]/.test(text);
  const isLastQuestion = currentIndex + 1 === questions.length;
  const isCurrentAnswered = selected[currentQuestion.id] !== undefined;

  return (
    <div className="flex flex-col gap-1.5 transition-all duration-300 justify-center items-center w-full px-5 sm:px-10">
      {/* progress */}

      <div className="flex justify-center items-center gap-[50px] sm:gap-[70px] md:gap-[600px] w-full px-4">
        {/* فقط اگر زمان بزرگتر از صفر بود تایمر نمایش داده شود */}
        {timeLimit && timeLimit > 0 ? (
          <QuizTimer seconds={timeLimit} onTimeUp={handleTimeUp} />
        ) : (
          <div /> // یک المان خالی برای حفظ ساختار flex و چیدمان
        )}
        <div className="text-[16px] font-bold">
          {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {/* question card */}
      <div className="rounded-[20px] px-5 sm:px-10 pb-8 pt-3 shadow-[0px_0px_20px_rgba(0,0,0,0.1),1px_6px_6px_rgba(0,0,0,0.1)] w-full max-w-200">
        <p
          dir={isPersian(currentQuestion.text) ? "rtl" : "ltr"}
          className={`font-semibold pb-2 px-3 text-[16px] ${
            isPersian(currentQuestion.text) ? "text-right" : "text-left"
          }`}
        >
          {currentIndex + 1}. {currentQuestion.text}
        </p>

        <div className="flex flex-col gap-1 w-full">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              className={`flex items-center py-0.5 border border-[#bbbbbb] rounded-[15px] cursor-pointer transition-all ${
                selected[currentQuestion.id] === opt.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <Image
                src={
                  selected[currentQuestion.id] === opt.id
                    ? "/images/isSelect.svg"
                    : "/images/select.svg"
                }
                alt="select"
                width={36}
                height={36}
                className="w-8 h-8"
              />

              <p className="text-[14px] ml-2">{opt.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-10 mt-10 mb-10 cursor-pointer">
        {!isLastQuestion ? (
          <NextButton
            lable="سوال بعدی"
            src={
              isCurrentAnswered
                ? "/images/nextArrow.png"
                : "/images/nextDisArrow.png"
            }
            onclick={handleNext}
            disabled={!isCurrentAnswered}
            classStyle="p-3 rounded disabled:bg-gray-400 hover:bg-blue-600"
          />
        ) : (
          <ResultButton
            lable={submitting ? "در حال ارسال..." : "نمایش نتیجه"}
            src={
              isCurrentAnswered
                ? "/images/result1.svg"
                : "/images/disresult.svg"
            }
            onClick={handleSubmit}
            disabled={!isCurrentAnswered || submitting}
            classStyle={`p-3 rounded ${
              !isCurrentAnswered || submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          />
        )}
      </div>
    </div>
  );
}
