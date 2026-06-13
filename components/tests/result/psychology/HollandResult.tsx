// "use client";

// import React from "react";

// export default function HollandResult({ data }) {
//   const { results } = data;
//   if (!results) return <div>دیتای نتیجه یافت نشد.</div>;

//   const {
//     topThreeCode,
//     primaryType,
//     suggestedJobs,
//     secondaryTypes,
//     fullBreakdown,
//   } = results;

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8" dir="rtl">
//       {/* هدر: کد سه‌گانه */}
//       <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <h2 className="text-gray-500 font-medium mb-2">
//           کد تیپ شخصیتی هالند شما (RIASEC)
//         </h2>
//         <h1 className="text-6xl font-extrabold text-indigo-600 tracking-widest">
//           {topThreeCode}
//         </h1>
//       </div>

//       {/* تیپ اصلی (Primary Type) */}
//       <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
//         <div className="flex items-center gap-3 mb-4">
//           <h3 className="text-2xl font-bold text-blue-800">
//             {primaryType.label}
//           </h3>
//           <span className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
//             {primaryType.title}
//           </span>
//         </div>
//         <p className="text-blue-900 leading-relaxed text-justify mb-6">
//           {primaryType.desc}
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <strong className="text-blue-800 block mb-2 font-bold">
//               ویژگی‌های بارز:
//             </strong>
//             <ul className="list-disc list-inside text-blue-900 space-y-1">
//               {primaryType.characteristics.map((char, idx) => (
//                 <li key={idx}>{char}</li>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <strong className="text-blue-800 block mb-2 font-bold">
//               محیط کاری ایده‌آل:
//             </strong>
//             <p className="text-blue-900 leading-relaxed">
//               {primaryType.environment}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* تیپ‌های فرعی (Secondary Types) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {secondaryTypes.map((type, index) => (
//           <div
//             key={index}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
//           >
//             <div className="flex items-center gap-2 mb-3">
//               <h4 className="text-lg font-bold text-gray-800">{type.label}</h4>
//               <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
//                 {type.title}
//               </span>
//             </div>
//             <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
//               {type.desc}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* مشاغل پیشنهادی */}
//       <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
//         <h3 className="text-lg font-bold text-emerald-800 mb-4">
//           مشاغل پیشنهادی برای شما
//         </h3>
//         <div className="flex flex-wrap gap-2">
//           {suggestedJobs.map((job, index) => (
//             <span
//               key={index}
//               className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm shadow-sm"
//             >
//               {job}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* نمودار خطی امتیازات (Breakdown) */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
//           تحلیل دقیق امتیازات شش‌گانه
//         </h3>
//         <div className="space-y-5">
//           {fullBreakdown.map((item, index) => (
//             <div key={index}>
//               <div className="flex justify-between text-sm mb-1 font-semibold text-gray-700">
//                 <span>
//                   {item.label} ({item.trait})
//                 </span>
//                 <span>{item.score} امتیاز</span>
//               </div>
//               <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//                 <div
//                   className="bg-indigo-500 h-3 rounded-full transition-all duration-1000"
//                   style={{ width: `${item.score}%` }} // فرض شده ماکزیمم 100 است
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

interface HollandType {
  label: string;
  title: string;
  desc: string;
  characteristics: string[];
  environment: string;
}

interface SecondaryType {
  label: string;
  title: string;
  desc: string;
}

interface BreakdownItem {
  label: string;
  trait: string;
  score: number;
}

interface HollandResults {
  topThreeCode: string;
  primaryType: HollandType;
  secondaryTypes: SecondaryType[];
  suggestedJobs: string[];
  fullBreakdown: BreakdownItem[];
}

interface HollandData {
  results?: HollandResults;
}

interface HollandResultProps {
  data: HollandData;
}

export default function HollandResult({ data }: HollandResultProps) {
  const { results } = data;

  if (!results) return <div>دیتای نتیجه یافت نشد.</div>;

  const {
    topThreeCode,
    primaryType,
    suggestedJobs,
    secondaryTypes,
    fullBreakdown,
  } = results;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8" dir="rtl">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-gray-500 font-medium mb-2">
          کد تیپ شخصیتی هالند شما (RIASEC)
        </h2>

        <h1 className="text-6xl font-extrabold text-indigo-600 tracking-widest">
          {topThreeCode}
        </h1>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-2xl font-bold text-blue-800">
            {primaryType.label}
          </h3>

          <span className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
            {primaryType.title}
          </span>
        </div>

        <p className="text-blue-900 leading-relaxed text-justify mb-6">
          {primaryType.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <strong className="text-blue-800 block mb-2 font-bold">
              ویژگی‌های بارز:
            </strong>

            <ul className="list-disc list-inside text-blue-900 space-y-1">
              {primaryType.characteristics.map((char, idx) => (
                <li key={idx}>{char}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong className="text-blue-800 block mb-2 font-bold">
              محیط کاری ایده‌آل:
            </strong>

            <p className="text-blue-900 leading-relaxed">
              {primaryType.environment}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryTypes.map((type, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-lg font-bold text-gray-800">{type.label}</h4>

              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {type.title}
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed text-justify mb-4">
              {type.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <h3 className="text-lg font-bold text-emerald-800 mb-4">
          مشاغل پیشنهادی برای شما
        </h3>

        <div className="flex flex-wrap gap-2">
          {suggestedJobs.map((job, index) => (
            <span
              key={index}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm shadow-sm"
            >
              {job}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
          تحلیل دقیق امتیازات شش‌گانه
        </h3>

        <div className="space-y-5">
          {fullBreakdown.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1 font-semibold text-gray-700">
                <span>
                  {item.label} ({item.trait})
                </span>

                <span>{item.score} امتیاز</span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
