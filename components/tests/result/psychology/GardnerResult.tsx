// "use client";

// import React from "react";

// export default function GardnerResult({ data }) {
//   const { results, totalScore } = data;
//   const { profile, topStrengths } = results;

//   if (!profile) return <div>دیتای نتیجه یافت نشد.</div>;

//   const intelligences = Object.values(profile);

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8" dir="rtl">
//       {/* هدر */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 text-center space-y-2">
//         <h1 className="text-2xl font-extrabold text-indigo-900">
//           نتیجه آزمون هوش‌های چندگانه گاردنر
//         </h1>
//         {totalScore !== undefined && (
//           <p className="text-indigo-600 font-medium">
//             امتیاز کلی شما: {totalScore}
//           </p>
//         )}
//       </div>

//       {/* نقاط قوت برتر */}
//       {topStrengths && topStrengths.length > 0 && (
//         <div className="space-y-4">
//           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
//             هوش‌های برتر شما
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {topStrengths.map((strength, index) => (
//               <div
//                 key={index}
//                 className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex flex-col items-center text-center gap-2"
//               >
//                 <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl">
//                   {index + 1}
//                 </div>
//                 <h3 className="font-bold text-gray-800">{strength.label}</h3>
//                 <span className="text-amber-600 font-semibold">
//                   {strength.percentage}٪
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* پروفایل کامل */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
//           پروفایل کامل هوش‌های هشت‌گانه
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {intelligences.map((item, index) => (
//             <div
//               key={index}
//               className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-center">
//                 <h3 className="font-bold text-gray-800">{item.label}</h3>
//                 <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
//                   {item.percentage}٪
//                 </span>
//               </div>

//               {/* نوار پیشرفت */}
//               <div className="w-full bg-gray-100 rounded-full h-2">
//                 <div
//                   className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
//                   style={{ width: `${item.percentage}%` }}
//                 ></div>
//               </div>

//               {/* تحلیل */}
//               <p className="text-gray-600 text-sm leading-relaxed text-justify mt-2">
//                 {item.analysis}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

interface IntelligenceItem {
  label: string;
  percentage: number;
  analysis: string;
}

interface StrengthItem {
  label: string;
  percentage: number;
}

interface GardnerResults {
  profile?: Record<string, IntelligenceItem>;
  topStrengths?: StrengthItem[];
}

interface GardnerData {
  results: GardnerResults;
  totalScore?: number;
}

interface GardnerResultProps {
  data: GardnerData;
}

export default function GardnerResult({ data }: GardnerResultProps) {
  const { results, totalScore } = data;
  const { profile, topStrengths } = results;

  if (!profile) return <div>دیتای نتیجه یافت نشد.</div>;

  const intelligences = Object.values(profile);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8" dir="rtl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-indigo-900">
          نتیجه آزمون هوش‌های چندگانه گاردنر
        </h1>

        {totalScore !== undefined && (
          <p className="text-indigo-600 font-medium">
            امتیاز کلی شما: {totalScore}
          </p>
        )}
      </div>

      {topStrengths && topStrengths.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
            هوش‌های برتر شما
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topStrengths.map((strength, index) => (
              <div
                key={index}
                className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex flex-col items-center text-center gap-2"
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl">
                  {index + 1}
                </div>

                <h3 className="font-bold text-gray-800">{strength.label}</h3>

                <span className="text-amber-600 font-semibold">
                  {strength.percentage}٪
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
          پروفایل کامل هوش‌های هشت‌گانه
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligences.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{item.label}</h3>

                <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  {item.percentage}٪
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <p className="text-gray-600 text-sm leading-relaxed text-justify mt-2">
                {item.analysis}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
