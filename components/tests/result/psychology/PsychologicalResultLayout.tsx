// "use client";

// export default function PsychologicalResultLayout({ title, children }) {
//   return (
//     <div className="w-full max-w-3xl mx-auto p-6">
//       <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
//         {title && (
//           <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
//         )}
//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { ReactNode } from "react";

interface PsychologicalResultLayoutProps {
  title?: string;
  children: ReactNode;
}

export default function PsychologicalResultLayout({
  title,
  children,
}: PsychologicalResultLayoutProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        {title && (
          <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
        )}

        {children}
      </div>
    </div>
  );
}
