// "use client";

// import { useEffect, useRef, useState } from "react";

// const FULL_DASH_ARRAY = 283; // محیط دایره

// export default function ResultChart({ correctCount, totalCount }) {
//   const [fraction, setFraction] = useState(0);
//   const requestRef = useRef(null);

//   const targetFraction = correctCount / totalCount;

//   // انیمیشن روان
//   const animate = () => {
//     setFraction((prev) => {
//       const next = Math.min(prev + 0.01, targetFraction);
//       if (next < targetFraction)
//         requestRef.current = requestAnimationFrame(animate);
//       return next;
//     });
//   };

//   useEffect(() => {
//     setFraction(0); // ریست وقتی داده‌ها تغییر می‌کنند
//     requestRef.current = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(requestRef.current);
//   }, [correctCount, totalCount]);

//   const correctDash = (fraction * FULL_DASH_ARRAY).toFixed(0);
//   const wrongDash = ((1 - fraction) * FULL_DASH_ARRAY).toFixed(0);

//   return (
//     <div className="relative w-44 h-44">
//       <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
//         {/* لایه پس‌زمینه خاکستری */}
//         <circle
//           cx="50"
//           cy="50"
//           r="45"
//           fill="none"
//           stroke="#e0e0e0"
//           strokeWidth="8"
//         />

//         {/* درصد درست سبز */}
//         <circle
//           cx="50"
//           cy="50"
//           r="45"
//           fill="none"
//           stroke="#4ade80"
//           strokeWidth="8"
//           strokeDasharray={`${correctDash} 283`}
//           strokeLinecap="round"
//           className="transition-all duration-500 ease-out"
//         />

//         {/* درصد غلط قرمز */}
//         <circle
//           cx="50"
//           cy="50"
//           r="45"
//           fill="none"
//           stroke="#f87171"
//           strokeWidth="8"
//           strokeDasharray={`${wrongDash} 283`}
//           strokeLinecap="round"
//           strokeDashoffset={-correctDash}
//           className="transition-all duration-500 ease-out"
//         />
//       </svg>

//       {/* متن وسط دایره */}
//       <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-black">
//         <span className="text-2xl">{Math.round(fraction * 100)}%</span>
//         <div className="text-sm flex gap-1 text-[#5e7075] mt-1">
//           <div>
//             {correctCount}/{totalCount}
//           </div>
//           <p>درست</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

const FULL_DASH_ARRAY = 283;

interface ResultChartProps {
  correctCount: number;
  totalCount: number;
}

export default function ResultChart({
  correctCount,
  totalCount,
}: ResultChartProps) {
  const [fraction, setFraction] = useState<number>(0);

  const requestRef = useRef<number | null>(null);

  const targetFraction = totalCount > 0 ? correctCount / totalCount : 0;

  const animate = () => {
    setFraction((prev) => {
      const next = Math.min(prev + 0.01, targetFraction);

      if (next < targetFraction) {
        requestRef.current = requestAnimationFrame(animate);
      }

      return next;
    });
  };

  useEffect(() => {
    setFraction(0);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [correctCount, totalCount]);

  const correctDash = (fraction * FULL_DASH_ARRAY).toFixed(0);

  const wrongDash = ((1 - fraction) * FULL_DASH_ARRAY).toFixed(0);

  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />

        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#4ade80"
          strokeWidth="8"
          strokeDasharray={`${correctDash} ${FULL_DASH_ARRAY}`}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />

        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#f87171"
          strokeWidth="8"
          strokeDasharray={`${wrongDash} ${FULL_DASH_ARRAY}`}
          strokeLinecap="round"
          strokeDashoffset={-Number(correctDash)}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-black">
        <span className="text-2xl">{Math.round(fraction * 100)}%</span>

        <div className="text-sm flex gap-1 text-[#5e7075] mt-1">
          <div>
            {correctCount}/{totalCount}
          </div>

          <p>درست</p>
        </div>
      </div>
    </div>
  );
}
