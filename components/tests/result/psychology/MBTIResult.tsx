// "use client";

// import React from "react";

// // یک کامپوننت داخلی برای نمایش نوارهای پیشرفت ویژگی‌های MBTI
// const MbtiBar = ({
//   leftLabel,
//   rightLabel,
//   leftValue,
//   rightValue,
//   leftKey,
//   rightKey,
// }) => {
//   return (
//     <div className="flex flex-col mb-6 w-full">
//       <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
//         <span>
//           {leftLabel} ({leftKey}: {leftValue}%)
//         </span>
//         <span>
//           {rightLabel} ({rightKey}: {rightValue}%)
//         </span>
//       </div>
//       <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-200">
//         {/* نوار سمت چپ */}
//         <div
//           className="bg-blue-500 h-full flex justify-center items-center text-xs text-white"
//           style={{ width: `${leftValue}%` }}
//         ></div>
//         {/* نوار سمت راست */}
//         <div
//           className="bg-emerald-500 h-full flex justify-center items-center text-xs text-white"
//           style={{ width: `${rightValue}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default function MbtiResult({ data }) {
//   // استخراج اطلاعات از دیتای ورودی
//   const { results } = data;
//   if (!results) return <div>دیتای نتیجه یافت نشد.</div>;

//   const { type, percentages, report } = results;

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8" dir="rtl">
//       {/* بخش هدر: عنوان تیپ شخصیتی */}
//       <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <h1 className="text-5xl font-extrabold text-indigo-600 mb-2">{type}</h1>
//         <h2 className="text-2xl font-bold text-gray-800">{report?.title}</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* بخش نمودارها و درصدها */}
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//           <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
//             تحلیل ابعاد شخصیتی
//           </h3>

//           <MbtiBar
//             leftLabel="برون‌گرا"
//             rightLabel="درون‌گرا"
//             leftKey="E"
//             rightKey="I"
//             leftValue={percentages?.EI?.E || 0}
//             rightValue={percentages?.EI?.I || 0}
//           />
//           <MbtiBar
//             leftLabel="شهودی"
//             rightLabel="حسی"
//             leftKey="N"
//             rightKey="S"
//             leftValue={percentages?.SN?.N || 0}
//             rightValue={percentages?.SN?.S || 0}
//           />
//           <MbtiBar
//             leftLabel="احساسی"
//             rightLabel="منطقی"
//             leftKey="F"
//             rightKey="T"
//             leftValue={percentages?.TF?.F || 0}
//             rightValue={percentages?.TF?.T || 0}
//           />
//           <MbtiBar
//             leftLabel="قضاوت‌گر"
//             rightLabel="ادراکی"
//             leftKey="J"
//             rightKey="P"
//             leftValue={percentages?.JP?.J || 0}
//             rightValue={percentages?.JP?.P || 0}
//           />
//         </div>

//         {/* بخش گزارش تفصیلی */}
//         <div className="space-y-6">
//           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
//             <h3 className="text-lg font-bold text-blue-800 mb-2">
//               خلاصه شخصیت
//             </h3>
//             <p className="text-blue-900 leading-relaxed text-justify">
//               {report?.summary}
//             </p>
//           </div>

//           <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
//             <h3 className="text-lg font-bold text-emerald-800 mb-2">
//               پیشنهادات شغلی و مسیر زندگی
//             </h3>
//             <p className="text-emerald-900 leading-relaxed text-justify">
//               {report?.suggestions}
//             </p>
//           </div>

//           <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
//             <h3 className="text-lg font-bold text-rose-800 mb-2">
//               نقاط قابل بهبود (نقدها)
//             </h3>
//             <p className="text-rose-900 leading-relaxed text-justify">
//               {report?.critiques}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

/* =======================
   Types
======================= */

interface MbtiBarProps {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  leftKey: string;
  rightKey: string;
}

interface DimensionPair {
  [key: string]: number;
}

interface MbtiPercentages {
  EI?: {
    E: number;
    I: number;
  };
  SN?: {
    S: number;
    N: number;
  };
  TF?: {
    T: number;
    F: number;
  };
  JP?: {
    J: number;
    P: number;
  };
}

interface MbtiReport {
  title?: string;
  summary?: string;
  suggestions?: string;
  critiques?: string;
}

interface MbtiResults {
  type: string;
  percentages?: MbtiPercentages;
  report?: MbtiReport;
}

interface MbtiData {
  results?: MbtiResults;
}

interface MbtiResultProps {
  data: MbtiData;
}

/* =======================
   Internal Component
======================= */

const MbtiBar: React.FC<MbtiBarProps> = ({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  leftKey,
  rightKey,
}) => {
  return (
    <div className="flex flex-col mb-6 w-full">
      <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
        <span>
          {leftLabel} ({leftKey}: {leftValue}%)
        </span>
        <span>
          {rightLabel} ({rightKey}: {rightValue}%)
        </span>
      </div>

      <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-200">
        <div
          className="bg-blue-500 h-full"
          style={{ width: `${leftValue}%` }}
        />
        <div
          className="bg-emerald-500 h-full"
          style={{ width: `${rightValue}%` }}
        />
      </div>
    </div>
  );
};

/* =======================
   Main Component
======================= */

export default function MbtiResult({ data }: MbtiResultProps) {
  const { results } = data;

  if (!results) return <div>دیتای نتیجه یافت نشد.</div>;

  const { type, percentages, report } = results;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8" dir="rtl">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-2">{type}</h1>

        <h2 className="text-2xl font-bold text-gray-800">{report?.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
            تحلیل ابعاد شخصیتی
          </h3>

          <MbtiBar
            leftLabel="برون‌گرا"
            rightLabel="درون‌گرا"
            leftKey="E"
            rightKey="I"
            leftValue={percentages?.EI?.E ?? 0}
            rightValue={percentages?.EI?.I ?? 0}
          />

          <MbtiBar
            leftLabel="شهودی"
            rightLabel="حسی"
            leftKey="N"
            rightKey="S"
            leftValue={percentages?.SN?.N ?? 0}
            rightValue={percentages?.SN?.S ?? 0}
          />

          <MbtiBar
            leftLabel="احساسی"
            rightLabel="منطقی"
            leftKey="F"
            rightKey="T"
            leftValue={percentages?.TF?.F ?? 0}
            rightValue={percentages?.TF?.T ?? 0}
          />

          <MbtiBar
            leftLabel="قضاوت‌گر"
            rightLabel="ادراکی"
            leftKey="J"
            rightKey="P"
            leftValue={percentages?.JP?.J ?? 0}
            rightValue={percentages?.JP?.P ?? 0}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              خلاصه شخصیت
            </h3>
            <p className="text-blue-900 leading-relaxed text-justify">
              {report?.summary}
            </p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">
              پیشنهادات شغلی و مسیر زندگی
            </h3>
            <p className="text-emerald-900 leading-relaxed text-justify">
              {report?.suggestions}
            </p>
          </div>

          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <h3 className="text-lg font-bold text-rose-800 mb-2">
              نقاط قابل بهبود (نقدها)
            </h3>
            <p className="text-rose-900 leading-relaxed text-justify">
              {report?.critiques}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
