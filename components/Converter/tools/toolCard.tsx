// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import Image from "next/image";

// export default function ToolCard({ title, description, icon, href }) {
//   return (
//     <Link href={href} className="group block">
//       <div className="h-full w-80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#bab9c880] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//         {/* Icon */}
//         <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
//           {icon}
//         </div>

//         {/* Title */}
//         <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
//           {title}
//         </h3>

//         {/* Description */}
//         <p className="text-sm text-slate-500 leading-6 mb-6">{description}</p>

//         <div>
//           <Image
//             src={"/images/myfooter.png"}
//             alt="footer"
//             width={1000}
//             height={1000}
//           />
//         </div>
//       </div>
//     </Link>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export default function ToolCard({
  title,
  description,
  icon,
  href,
}: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="h-full w-80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#bab9c880] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-6 mb-6">{description}</p>

        {/* Footer Image */}
        <div>
          <Image
            src="/images/converterfooter.png"
            alt="footer"
            width={1000}
            height={1000}
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </Link>
  );
}
