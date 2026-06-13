// "use client";

// import PsychologicalResultLayout from "./PsychologicalResultLayout";

// export default function EmotionIntelligenceResult({ data }) {
//   // const { totalScore, categories, suggestions } = data;
//   const { totalScore, results = {}, suggestions } = data;

//   const levelsColor = {
//     پایین: "bg-red-500",
//     متوسط: "bg-yellow-500",
//     بالا: "bg-green-600",
//   };

//   const levelBorder = {
//     پایین: "border-red-500",
//     متوسط: "border-yellow-500",
//     بالا: "border-green-600",
//   };

//   const overallStatus =
//     totalScore >= 120
//       ? {
//           title: "هوش هیجانی بسیار بالا",
//           color: "text-green-600",
//           desc: "سطح تسلط هیجانی شما بسیار بالاست. شما می‌توانید احساسات خود و دیگران را به‌خوبی مدیریت کنید و در ارتباطات و چالش‌ها عملکردی استثنایی دارید.",
//         }
//       : totalScore >= 90
//         ? {
//             title: "هوش هیجانی خوب",
//             color: "text-blue-600",
//             desc: "شما از هوش هیجانی قابل‌توجهی برخوردارید. توانایی کنترل و تحلیل احساسات را دارید و در روابط اجتماعی معمولاً موفق عمل می‌کنید.",
//           }
//         : totalScore >= 60
//           ? {
//               title: "هوش هیجانی متوسط",
//               color: "text-yellow-600",
//               desc: "هوش هیجانی شما در سطح متوسط قرار دارد. با کمی تمرین می‌توانید مهارت‌های ارتباطی و مدیریت احساسات را تقویت کنید.",
//             }
//           : {
//               title: "نیاز به تقویت جدی",
//               color: "text-red-600",
//               desc: "هوش هیجانی شما پایین‌تر از حد نرمال است و لازم است روی شناخت هیجانات و مهارت‌های اجتماعی خود بیشتر کار کنید.",
//             };

//   return (
//     <PsychologicalResultLayout title="نتیجه تست هوش هیجانی Bar-On">
//       <div className="space-y-8">
//         {/* امتیاز کلی */}
//         <div className="text-center border rounded-xl p-6 bg-gray-50 shadow-sm">
//           <h2 className="text-xl font-bold mb-2">مجموع امتیاز شما</h2>
//           <div className="text-4xl font-extrabold text-indigo-600">
//             {totalScore}
//           </div>

//           <div className={`mt-4 text-lg font-semibold ${overallStatus.color}`}>
//             {overallStatus.title}
//           </div>

//           <p className="mt-3 text-gray-600 leading-relaxed text-sm md:text-base">
//             {overallStatus.desc}
//           </p>
//         </div>

//         {/* دسته‌ها */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {Object.entries(results).map(([name, info]) => {
//             const percentage = Math.round((info.score / 30) * 100);

//             return (
//               <div
//                 key={name}
//                 className={`border rounded-xl p-5 shadow-sm bg-white transition hover:shadow-md ${levelBorder[info.level]}`}
//               >
//                 <h3 className="text-base md:text-lg font-bold mb-2">{name}</h3>

//                 {/* Progress Bar + درصد */}
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-full h-3 bg-gray-200 rounded-full">
//                     <div
//                       className={`h-full rounded-full transition-all ${levelsColor[info.level]}`}
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                   </div>

//                   <span className="text-sm font-semibold w-10 text-right">
//                     %{percentage}
//                   </span>
//                 </div>

//                 <div className="text-sm font-medium mb-2">
//                   سطح: {info.level}
//                 </div>

//                 <p className="text-gray-700 text-sm leading-relaxed">
//                   {info.analysis}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         {/* پیشنهادهای رشد — فقط اگر بک‌اند فرستاده باشد
//         {suggestions && suggestions.length > 0 && (
//           <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
//             <h3 className="text-lg font-bold mb-3 text-indigo-700">
//               پیشنهادهای توسعه فردی
//             </h3>

//             <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
//               {suggestions.map((item, i) => (
//                 <li key={i}>• {item}</li>
//               ))}
//             </ul>
//           </div>
//         )} */}
//       </div>
//     </PsychologicalResultLayout>
//   );
// }

"use client";

import PsychologicalResultLayout from "./PsychologicalResultLayout";

type Level = "پایین" | "متوسط" | "بالا";

interface CategoryResult {
  score: number;
  level: Level;
  analysis: string;
}

interface EmotionIntelligenceData {
  totalScore: number;
  results?: Record<string, CategoryResult>;
  suggestions?: string[];
}

interface EmotionIntelligenceResultProps {
  data: EmotionIntelligenceData;
}

export default function EmotionIntelligenceResult({
  data,
}: EmotionIntelligenceResultProps) {
  const { totalScore, results = {}, suggestions } = data;

  const levelsColor: Record<Level, string> = {
    پایین: "bg-red-500",
    متوسط: "bg-yellow-500",
    بالا: "bg-green-600",
  };

  const levelBorder: Record<Level, string> = {
    پایین: "border-red-500",
    متوسط: "border-yellow-500",
    بالا: "border-green-600",
  };

  const overallStatus =
    totalScore >= 120
      ? {
          title: "هوش هیجانی بسیار بالا",
          color: "text-green-600",
          desc: "سطح تسلط هیجانی شما بسیار بالاست. شما می‌توانید احساسات خود و دیگران را به‌خوبی مدیریت کنید و در ارتباطات و چالش‌ها عملکردی استثنایی دارید.",
        }
      : totalScore >= 90
        ? {
            title: "هوش هیجانی خوب",
            color: "text-blue-600",
            desc: "شما از هوش هیجانی قابل‌توجهی برخوردارید. توانایی کنترل و تحلیل احساسات را دارید و در روابط اجتماعی معمولاً موفق عمل می‌کنید.",
          }
        : totalScore >= 60
          ? {
              title: "هوش هیجانی متوسط",
              color: "text-yellow-600",
              desc: "هوش هیجانی شما در سطح متوسط قرار دارد. با کمی تمرین می‌توانید مهارت‌های ارتباطی و مدیریت احساسات را تقویت کنید.",
            }
          : {
              title: "نیاز به تقویت جدی",
              color: "text-red-600",
              desc: "هوش هیجانی شما پایین‌تر از حد نرمال است و لازم است روی شناخت هیجانات و مهارت‌های اجتماعی خود بیشتر کار کنید.",
            };

  return (
    <PsychologicalResultLayout title="نتیجه تست هوش هیجانی Bar-On">
      <div className="space-y-8">
        <div className="text-center border rounded-xl p-6 bg-gray-50 shadow-sm">
          <h2 className="text-xl font-bold mb-2">مجموع امتیاز شما</h2>

          <div className="text-4xl font-extrabold text-indigo-600">
            {totalScore}
          </div>

          <div className={`mt-4 text-lg font-semibold ${overallStatus.color}`}>
            {overallStatus.title}
          </div>

          <p className="mt-3 text-gray-600 leading-relaxed text-sm md:text-base">
            {overallStatus.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(results).map(([name, info]) => {
            const percentage = Math.round((info.score / 30) * 100);

            return (
              <div
                key={name}
                className={`border rounded-xl p-5 shadow-sm bg-white transition hover:shadow-md ${levelBorder[info.level]}`}
              >
                <h3 className="text-base md:text-lg font-bold mb-2">{name}</h3>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${levelsColor[info.level]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-sm font-semibold w-10 text-right">
                    %{percentage}
                  </span>
                </div>

                <div className="text-sm font-medium mb-2">
                  سطح: {info.level}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {info.analysis}
                </p>
              </div>
            );
          })}
        </div>

        {/* پیشنهادها در صورت نیاز */}
        {/*
        {suggestions && suggestions.length > 0 && (
          <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-3 text-indigo-700">
              پیشنهادهای توسعه فردی
            </h3>

            <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
              {suggestions.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        */}
      </div>
    </PsychologicalResultLayout>
  );
}
