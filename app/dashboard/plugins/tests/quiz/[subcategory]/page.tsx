// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import { fetchWithAuth } from "@/lib/api";
// import QuizClient from "@/components/tests/quizClient";
// import TestFooter from "@/components/tests/testFooter";

// /* =========================
//    Types
// ========================= */

// interface Option {
//   id: string;
//   text: string;
// }

// interface Question {
//   id: string;
//   text: string;
//   options: Option[];
// }

// interface StartQuizResponse {
//   sessionId: string;
//   questions: {
//     _id: string;
//     questionText?: string;
//     text?: string;
//     options?: {
//       _id: string;
//       text?: string;
//     }[];
//   }[];
// }

// /* =========================
//    Component
// ========================= */

// export default function QuizPage() {
//   const { subcategory: typeId } = useParams<{ subcategory: string }>();
//   const searchParams = useSearchParams();

//   const quizTitle = searchParams.get("title") ?? "آزمون";
//   const quizDesc = searchParams.get("desc") ?? "";

//   const timeLimitParam = searchParams.get("timeLimit");
//   const timeLimitSeconds = timeLimitParam ? Number(timeLimitParam) * 60 : null;

//   const userId = "699412d02b085af77322ab98";

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<boolean>(false);

//   useEffect(() => {
//     if (!typeId) return;

//     async function startQuiz() {
//       try {
//         const res = await fetchWithAuth("/api/tests/start", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ typeId, userId }),
//         });

//         if (!res.ok) throw new Error("شروع آزمون ناموفق");

//         const data: StartQuizResponse = await res.json();

//         setSessionId(data.sessionId);

//         const formattedQuestions: Question[] = (data.questions || []).map(
//           (q) => ({
//             id: q._id,
//             text: q.questionText || q.text || "بدون متن",
//             options: (q.options || []).map((o) => ({
//               id: o._id,
//               text: o.text || "",
//             })),
//           }),
//         );

//         setQuestions(formattedQuestions);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     }

//     startQuiz();
//   }, [typeId]);

//   /* =========================
//      Loading
//   ========================= */

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto" />
//           <p className="mt-4 text-gray-600">در حال دریافت اطلاعات...</p>
//         </div>
//       </div>
//     );

//   /* =========================
//      Error
//   ========================= */

//   if (error || !questions.length)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <p className="mt-4 text-red-600">خطا در دریافت اطلاعات...</p>
//         </div>
//       </div>
//     );

//   /* =========================
//      Render
//   ========================= */

//   return (
//     <main className="h-screen relative pt-8">
//       <div className="flex flex-col gap-3 justify-center items-center px-5 text-center">
//         <p className="text-[32px] font-bold">تست {quizTitle}</p>

//         {quizDesc && <p className="text-gray-600 text-[18px]">{quizDesc}</p>}

//         <QuizClient
//           questions={questions}
//           timeLimit={timeLimitSeconds}
//           sessionId={sessionId}
//           subcategory={typeId}
//         />
//       </div>

//       <div className="absolute bottom-0 w-full">
//         <TestFooter />
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import QuizClient from "@/components/tests/quizClient";
import TestFooter from "@/components/tests/testFooter";

type Option = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
};

type StartQuizResponse = {
  sessionId: string;
  questions: {
    _id: string;
    questionText?: string;
    text?: string;
    options?: {
      _id: string;
      text?: string;
    }[];
  }[];
};

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const typeId = params?.subcategory as string;

  const quizTitle = searchParams.get("title") ?? "آزمون";
  const quizDesc = searchParams.get("desc") ?? "";

  const timeLimitParam = searchParams.get("timeLimit");
  const timeLimitSeconds = timeLimitParam ? Number(timeLimitParam) * 60 : null;

  const userId = "699412d02b085af77322ab98";
  console.log("QuizPage loaded");
  console.log("params:", params);
  console.log("typeId:", typeId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("useEffect started");
    async function startQuiz() {
      try {
        console.log("typeId:", typeId);
        console.log("request body:", { typeId, userId });

        const res = await fetchWithAuth("/api/tests/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typeId, userId }),
        });

        console.log("response status:", res.status);

        const data = await res.json();
        console.log("API response:", data);

        if (!res.ok) throw new Error("شروع آزمون ناموفق");

        setSessionId(data.sessionId);

        const formattedQuestions: Question[] = (data.questions || []).map(
          (q: any) => ({
            id: q._id,
            text: q.questionText || q.text || "بدون متن",
            options: (q.options || []).map((o: any) => ({
              id: o._id,
              text: o.text || "",
            })),
          }),
        );

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error("quiz error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (typeId) startQuiz();
  }, [typeId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto" />
          <p className="mt-4 text-gray-600">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );

  if (error || !questions.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">خطا در دریافت اطلاعات</p>
      </div>
    );

  return (
    <main className="h-screen relative pt-8">
      <div className="flex flex-col gap-3 justify-center items-center px-5 text-center">
        <p className="text-[32px] font-bold">تست {quizTitle}</p>

        {quizDesc && <p className="text-gray-600 text-[18px]">{quizDesc}</p>}

        {sessionId && (
          <QuizClient
            questions={questions}
            timeLimit={timeLimitSeconds ?? undefined}
            sessionId={sessionId}
            subcategory={typeId}
          />
        )}
      </div>

      <div className="absolute bottom-0 w-full">
        <TestFooter />
      </div>
    </main>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import { fetchWithAuth } from "@/lib/api";
// import QuizClient from "@/components/tests/quizClient";
// import TestFooter from "@/components/tests/testFooter";

// export default function QuizPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const typeId = params?.subcategory as string;

//   const quizTitle = searchParams.get("title") ?? "آزمون";
//   const quizDesc = searchParams.get("desc") ?? "";
//   const timeLimitParam = searchParams.get("timeLimit");
//   const timeLimitSeconds = timeLimitParam ? Number(timeLimitParam) * 60 : null;

//   const [questions, setQuestions] = useState<any[]>([]);
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     if (!typeId) return;

//     async function startQuiz() {
//       try {
//         // بازیابی sessionId قبلی اگر وجود داشت
//         const cachedSession = sessionStorage.getItem(`active_session_${typeId}`);

//         const res = await fetchWithAuth("/api/tests/start", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ typeId, userId: "699412d02b085af77322ab98" }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error("شروع آزمون ناموفق");

//         // استفاده از sessionId دریافتی
//         setSessionId(data.sessionId);
//         sessionStorage.setItem(`active_session_${typeId}`, data.sessionId);

//         const formattedQuestions = (data.questions || []).map((q: any) => ({
//           id: q._id,
//           text: q.questionText || q.text || "بدون متن",
//           options: (q.options || []).map((o: any) => ({ id: o._id, text: o.text || "" })),
//         }));

//         setQuestions(formattedQuestions);
//       } catch (err) {
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     }

//     startQuiz();
//   }, [typeId]);

//   if (loading) return <div className="h-screen flex justify-center items-center">در حال دریافت...</div>;
//   if (error || !questions.length) return <div className="h-screen flex justify-center items-center">خطا...</div>;

//   return (
//     <main className="h-screen relative pt-8">
//       <div className="flex flex-col gap-3 justify-center items-center px-5 text-center">
//         <p className="text-[32px] font-bold">تست {quizTitle}</p>
//         {sessionId && (
//           <QuizClient
//             questions={questions}
//             timeLimit={timeLimitSeconds ?? undefined}
//             sessionId={sessionId}
//             subcategory={typeId}
//           />
//         )}
//       </div>
//       <div className="absolute bottom-0 w-full"><TestFooter /></div>
//     </main>
//   );
// }
