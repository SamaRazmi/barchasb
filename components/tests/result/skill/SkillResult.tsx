// "use client";

// import React from "react";

// export default function SkillResult({ data }) {
//   // استخراج امن دیتاها
//   const results = data?.results;
//   if (!results)
//     return <div className="text-center p-5">دیتایی برای نمایش وجود ندارد.</div>;

//   const summary = results.summary;
//   const detailed = results.detailedResult;
//   const analysis = detailed?.analysis;
//   const levels = results.levelBreakdown;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6 dir-rtl text-gray-800 font-sans">
//       {/* هدر نتیجه */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-2">
//         <p className="text-sm text-gray-500">{detailed?.baseInfo?.category}</p>
//         <h1 className="text-2xl font-bold text-gray-800">
//           نتیجه آزمون: {detailed?.baseInfo?.testName}
//         </h1>
//         <div className="pt-4">
//           <span className="inline-block bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-lg font-semibold border border-blue-100">
//             سطح شما: {results.assignedLevel}
//           </span>
//         </div>
//       </div>

//       {/* خلاصه آمار (کارت‌های رنگی) */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
//           <p className="text-gray-500 text-sm mb-1">نمره شما</p>
//           <p className="text-2xl font-bold text-blue-600">
//             ٪ {results?.weightedScore}
//             {/* ٪ {summary?.scorePercentage} */}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
//           <p className="text-gray-500 text-sm mb-1">کل سوالات</p>
//           <p className="text-2xl font-bold text-gray-700">
//             {summary?.totalQuestions}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 text-center">
//           <p className="text-emerald-600 text-sm mb-1">پاسخ صحیح</p>
//           <p className="text-2xl font-bold text-emerald-600">
//             {summary?.correctAnswers}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4 text-center">
//           <p className="text-red-500 text-sm mb-1">پاسخ غلط</p>
//           <p className="text-2xl font-bold text-red-500">
//             {summary?.wrongAnswers}
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* تحلیل مباحث (Topic Analysis) */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-lg font-bold mb-4 border-b pb-2">
//             عملکرد در مباحث مختلف
//           </h2>
//           <div className="space-y-4 max-h-64 overflow-y-auto pl-2">
//             {analysis?.topicAnalysis?.map((topic, index) => (
//               <div key={index}>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="font-medium text-gray-700">
//                     {topic.topic}
//                   </span>
//                   <span className="text-gray-500">
//                     {topic.percentage}% ({topic.correct} از {topic.total})
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-2">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${topic.percentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* تحلیل بر اساس سطح سختی (Level Breakdown) */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-lg font-bold mb-4 border-b pb-2">
//             عملکرد بر اساس سختی سوالات
//           </h2>
//           <div className="space-y-3">
//             {levels &&
//               Object.entries(levels)
//                 .sort(([keyA], [keyB]) =>
//                   keyA.localeCompare(keyB, undefined, {
//                     numeric: true,
//                     sensitivity: "base",
//                   }),
//                 )
//                 .map(([levelName, stats]) => (
//                   <div
//                     key={levelName}
//                     className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
//                   >
//                     <span className="font-bold text-gray-700 w-12">
//                       {levelName}
//                     </span>
//                     <div className="flex gap-4 text-sm">
//                       <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
//                         ✓ {stats.correct}
//                       </span>
//                       <span className="text-red-500 bg-red-50 px-2 py-1 rounded">
//                         ✗ {stats.wrong}
//                       </span>
//                       <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded">
//                         کل: {stats.total}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//           </div>
//         </div>
//       </div>

//       {/* نقاط قوت و ضعف */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
//           <h2 className="text-lg font-bold text-emerald-800 mb-3">
//             نقاط قوت شما
//           </h2>
//           {analysis?.strengths?.length > 0 ? (
//             <ul className="list-disc list-inside text-emerald-700 space-y-1">
//               {analysis.strengths.map((item, i) => (
//                 <li key={i}>{item}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-emerald-600 text-sm">
//               نیاز به تمرین بیشتر برای ایجاد نقاط قوت دارید.
//             </p>
//           )}
//         </div>

//         <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
//           <h2 className="text-lg font-bold text-red-800 mb-3">
//             مباحث نیازمند تمرین (نقاط ضعف)
//           </h2>
//           {analysis?.weaknesses?.length > 0 ? (
//             <ul className="list-disc list-inside text-red-700 space-y-1">
//               {analysis.weaknesses.map((item, i) => (
//                 <li key={i}>{item}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-red-600 text-sm">نقطه ضعف خاصی ثبت نشده است.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

/* =========================================
   Types
========================================= */

interface TopicAnalysisItem {
  topic: string;
  percentage: number;
  correct: number;
  total: number;
}

interface Analysis {
  topicAnalysis?: TopicAnalysisItem[];
  strengths?: string[];
  weaknesses?: string[];
}

interface BaseInfo {
  category?: string;
  testName?: string;
}

interface DetailedResult {
  baseInfo?: BaseInfo;
  analysis?: Analysis;
}

interface Summary {
  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  scorePercentage?: number;
}

interface LevelStats {
  correct: number;
  wrong: number;
  total: number;
}

interface SkillResults {
  summary?: Summary;
  detailedResult?: DetailedResult;
  levelBreakdown?: Record<string, LevelStats>;

  assignedLevel?: string;
  weightedScore?: number;
}

interface SkillResultData {
  results?: SkillResults;
}

interface SkillResultProps {
  data: SkillResultData;
}

/* =========================================
   Component
========================================= */

export default function SkillResult({ data }: SkillResultProps) {
  // استخراج امن دیتاها
  const results = data?.results;

  if (!results) {
    return <div className="text-center p-5">دیتایی برای نمایش وجود ندارد.</div>;
  }

  const summary = results.summary;
  const detailed = results.detailedResult;
  const analysis = detailed?.analysis;
  const levels = results.levelBreakdown;

  return (
    <div className="max-w-4xl mx-auto space-y-6 dir-rtl text-gray-800 font-sans">
      {/* هدر نتیجه */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-2">
        <p className="text-sm text-gray-500">{detailed?.baseInfo?.category}</p>

        <h1 className="text-2xl font-bold text-gray-800">
          نتیجه آزمون: {detailed?.baseInfo?.testName}
        </h1>

        <div className="pt-4">
          <span className="inline-block bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-lg font-semibold border border-blue-100">
            سطح شما: {results.assignedLevel}
          </span>
        </div>
      </div>

      {/* خلاصه آمار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-gray-500 text-sm mb-1">نمره شما</p>

          <p className="text-2xl font-bold text-blue-600">
            ٪ {results?.weightedScore ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-gray-500 text-sm mb-1">کل سوالات</p>

          <p className="text-2xl font-bold text-gray-700">
            {summary?.totalQuestions ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 text-center">
          <p className="text-emerald-600 text-sm mb-1">پاسخ صحیح</p>

          <p className="text-2xl font-bold text-emerald-600">
            {summary?.correctAnswers ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4 text-center">
          <p className="text-red-500 text-sm mb-1">پاسخ غلط</p>

          <p className="text-2xl font-bold text-red-500">
            {summary?.wrongAnswers ?? 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تحلیل مباحث */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            عملکرد در مباحث مختلف
          </h2>

          <div className="space-y-4 max-h-64 overflow-y-auto pl-2">
            {analysis?.topicAnalysis?.map((topic, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">
                    {topic.topic}
                  </span>

                  <span className="text-gray-500">
                    {topic.percentage}% ({topic.correct} از {topic.total})
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${topic.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* تحلیل سطح سختی */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">
            عملکرد بر اساس سختی سوالات
          </h2>

          <div className="space-y-3">
            {levels &&
              Object.entries(levels)
                .sort(([keyA], [keyB]) =>
                  keyA.localeCompare(keyB, undefined, {
                    numeric: true,
                    sensitivity: "base",
                  }),
                )
                .map(([levelName, stats]) => (
                  <div
                    key={levelName}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <span className="font-bold text-gray-700 w-12">
                      {levelName}
                    </span>

                    <div className="flex gap-4 text-sm">
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        ✓ {stats.correct}
                      </span>

                      <span className="text-red-500 bg-red-50 px-2 py-1 rounded">
                        ✗ {stats.wrong}
                      </span>

                      <span className="text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        کل: {stats.total}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* نقاط قوت و ضعف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
          <h2 className="text-lg font-bold text-emerald-800 mb-3">
            نقاط قوت شما
          </h2>

          {analysis?.strengths?.length ? (
            <ul className="list-disc list-inside text-emerald-700 space-y-1">
              {analysis.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-emerald-600 text-sm">
              نیاز به تمرین بیشتر برای ایجاد نقاط قوت دارید.
            </p>
          )}
        </div>

        <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
          <h2 className="text-lg font-bold text-red-800 mb-3">
            مباحث نیازمند تمرین (نقاط ضعف)
          </h2>

          {analysis?.weaknesses?.length ? (
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {analysis.weaknesses.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 text-sm">نقطه ضعف خاصی ثبت نشده است.</p>
          )}
        </div>
      </div>
    </div>
  );
}
