// "use client";

// import React from "react";

// export default function NEOResult({ data }) {
//   const { results, totalScore } = data;

//   if (!results) return <div>دیتای نتیجه یافت نشد.</div>;

//   // تبدیل آبجکت نتایج به آرایه برای رندر راحت‌تر
//   const traits = Object.values(results);

//   // تابعی برای تعیین رنگ بر اساس وضعیت (پایین، متوسط، بالا)
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "بالا":
//         return "bg-emerald-100 text-emerald-800 border-emerald-200";
//       case "پایین":
//         return "bg-rose-100 text-rose-800 border-rose-200";
//       default:
//         return "bg-amber-100 text-amber-800 border-amber-200"; // برای حالت "متوسط"
//     }
//   };

//   const getBarColor = (status) => {
//     switch (status) {
//       case "بالا":
//         return "bg-emerald-500";
//       case "پایین":
//         return "bg-rose-500";
//       default:
//         return "bg-amber-500";
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-6" dir="rtl">
//       {/* هدر */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2">
//         <h1 className="text-2xl font-extrabold text-gray-800">
//           نتیجه آزمون شخصیت‌شناسی NEO (پنج عاملی)
//         </h1>
//         {totalScore !== undefined && (
//           <p className="text-gray-500 text-sm">امتیاز کلی: {totalScore}</p>
//         )}
//       </div>

//       {/* لیست عامل‌های شخصیتی */}
//       <div className="space-y-6">
//         {traits.map((trait, index) => (
//           <div
//             key={index}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start"
//           >
//             {/* بخش سمت راست: نوار پیشرفت و اطلاعات */}
//             <div className="w-full md:w-1/3 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-bold text-gray-800">
//                   {trait.name}
//                 </h3>
//                 <span
//                   className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(trait.status)}`}
//                 >
//                   {trait.status}
//                 </span>
//               </div>

//               <div>
//                 <div className="flex justify-between text-sm text-gray-500 mb-1">
//                   <span>امتیاز</span>
//                   <span>{trait.score}</span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//                   <div
//                     className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(trait.status)}`}
//                     style={{ width: `${trait.score}%` }} // فرض بر این است که سقف نمره ۱۰۰ است
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* بخش سمت چپ: تحلیل */}
//             <div className="w-full md:w-2/3">
//               <h4 className="text-sm font-bold text-gray-600 mb-2">
//                 تحلیل وضعیت شما:
//               </h4>
//               <p className="text-gray-700 leading-relaxed text-justify text-sm">
//                 {trait.analysis}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

/* =======================
   Types
======================= */

type TraitStatus = "پایین" | "متوسط" | "بالا";

interface NEOTrait {
  name: string;
  score: number;
  status: TraitStatus;
  analysis: string;
}

interface NEOResults {
  [key: string]: NEOTrait;
}

interface NEOData {
  results?: NEOResults;
  totalScore?: number;
}

interface NEOResultProps {
  data: NEOData;
}

/* =======================
   Component
======================= */

export default function NEOResult({ data }: NEOResultProps) {
  const { results, totalScore } = data;

  if (!results) return <div>دیتای نتیجه یافت نشد.</div>;

  // تبدیل آبجکت نتایج به آرایه برای رندر راحت‌تر
  const traits: NEOTrait[] = Object.values(results);

  // تعیین رنگ وضعیت
  const getStatusColor = (status: TraitStatus): string => {
    switch (status) {
      case "بالا":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";

      case "پایین":
        return "bg-rose-100 text-rose-800 border-rose-200";

      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  // تعیین رنگ نوار پیشرفت
  const getBarColor = (status: TraitStatus): string => {
    switch (status) {
      case "بالا":
        return "bg-emerald-500";

      case "پایین":
        return "bg-rose-500";

      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6" dir="rtl">
      {/* هدر */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-800">
          نتیجه آزمون شخصیت‌شناسی NEO (پنج عاملی)
        </h1>

        {totalScore !== undefined && (
          <p className="text-gray-500 text-sm">امتیاز کلی: {totalScore}</p>
        )}
      </div>

      {/* لیست عامل‌های شخصیتی */}
      <div className="space-y-6">
        {traits.map((trait, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start"
          >
            {/* بخش سمت راست */}
            <div className="w-full md:w-1/3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  {trait.name}
                </h3>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                    trait.status,
                  )}`}
                >
                  {trait.status}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>امتیاز</span>
                  <span>{trait.score}</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${getBarColor(
                      trait.status,
                    )}`}
                    style={{ width: `${trait.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* بخش تحلیل */}
            <div className="w-full md:w-2/3">
              <h4 className="text-sm font-bold text-gray-600 mb-2">
                تحلیل وضعیت شما:
              </h4>

              <p className="text-gray-700 leading-relaxed text-justify text-sm">
                {trait.analysis}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
