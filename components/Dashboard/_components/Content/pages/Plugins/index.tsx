// import React from "react";
// import { useRouter } from "next/navigation";
// import TopBar from "@/components/common/TopBar";

// const Plugins: React.FC = () => {
//   const router = useRouter();

//   const plugins = [
//     {
//       id: "resume",
//       emoji: "📄",
//       label: " رزومه ساز",
//       path: "/dashboard/plugins/resume",
//     },
//     {
//       id: "tests",
//       emoji: "🧠",
//       label: "آزمون ها",
//       path: "/dashboard/plugins/tests",
//     },
//     {
//       id: "converter",
//       emoji: "🔁",
//       label: "تبدیل ها",
//       path: "/dashboard/plugins/converter",
//     },
//   ];

//   const handleClick = (path: string) => {
//     router.push(path);
//   };

//   return (
//     <div className="flex flex-col h-[88vh] overflow-hidden">
//       {/* حذف hidden و اضافه کردن flex در همه سایزها */}
//       <div className="flex flex-col md:h-full sm:m-[1.5vh]">
//         {/* فقط در md به بالا نمایش داده شود */}
//         <div className="hidden md:block">
//           <TopBar />
//         </div>
//         <div className="relative flex-1 bg-gray-100 overflow-y-auto overflow-x-hidden p-6 mt-[2vh] rounded-xl md:p-8">
//           <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr max-w-full">
//             {plugins.map((plugin) => (
//               <div
//                 key={plugin.id}
//                 onClick={() => handleClick(plugin.path)}
//                 className="bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-4 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
//                 style={{ minHeight: "28vh" }}
//               >
//                 <div className="text-7xl mb-3">{plugin.emoji}</div>
//                 <div className="text-lg font-semibold text-gray-800">
//                   {plugin.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Plugins;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/common/TopBar";

type Plugin = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  path: string;
  badge?: string;
  gradient: string;
};

const Plugins: React.FC = () => {
  const router = useRouter();

  const plugins: Plugin[] = [
    {
      id: "resume",
      emoji: "📄",
      label: "رزومه‌ساز",
      description: "ساخت رزومه حرفه‌ای با قالب‌های آماده",
      path: "/dashboard/plugins/resume",
      badge: "محبوب",
      gradient: "from-blue-500/20 to-cyan-400/10",
    },
    {
      id: "tests",
      emoji: "🧠",
      label: "آزمون‌ها",
      description: "مدیریت آزمون‌ها و مشاهده نتایج",
      path: "/dashboard/plugins/tests",
      badge: "ویژه",
      gradient: "from-sky-500/20 to-blue-400/10",
    },
    {
      id: "converter",
      emoji: "🔁",
      label: "تبدیل‌ها",
      description: "تبدیل سریع فرمت‌ها و ابزارهای کاربردی",
      path: "/dashboard/plugins/converter",
      badge: "جدید",
      gradient: "from-indigo-500/20 to-blue-400/10",
    },
  ];

  return (
    <div className="flex flex-col h-[88vh] overflow-hidden">
      <div className="flex flex-col md:h-full sm:m-[1.5vh]">
        <div className="hidden md:block">
          <TopBar />
        </div>

        {/* Light glass container */}
        <div
          className="relative flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 mt-[2vh] rounded-3xl
                          bg-gradient-to-b from-slate-50 via-sky-50 to-white 
                          border border-slate-200/70 shadow-[0_20px_60px_rgba(2,6,23,0.08)]"
        >
          {/* soft background blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          {/* Header */}
          {/* <div className="relative z-10 mb-6 flex items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  افزونه ها
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  ابزار موردنظرت را انتخاب کن و شروع کن.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-white/60 border border-slate-200/70 px-3 py-2 rounded-full backdrop-blur-md">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                آماده استفاده
              </div>
            </div> */}

          {/* Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
            {plugins.map((plugin) => (
              <button
                key={plugin.id}
                onClick={() => router.push(plugin.path)}
                className="group relative w-full text-right rounded-3xl overflow-hidden p-5 md:p-6
                            border border-black/5 bg-white/45 backdrop-blur-xl
                            shadow-[0_10px_30px_rgba(2,6,23,0.08)]
                            transition-all duration-300
                            hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_18px_45px_rgba(2,6,23,0.12)]
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                {/* gradient hover overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plugin.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* content */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="p-[1vh] pt-[1.5vh] rounded-[2vh] bg-white/55 border border-slate-400/20 backdrop-blur-md flex items-center justify-center text-[4vh] shadow-inner">
                      {plugin.emoji}
                    </div>

                    <div>
                      <div className="text-[3vh] font-semibold text-slate-900">
                        {plugin.label}
                      </div>
                      <div className="mt-1 text-sm text-slate-600 leading-6">
                        {plugin.description}
                      </div>
                    </div>
                  </div>

                  {plugin.badge && (
                    <span className="shrink-0 rounded-full bg-white/60 border border-slate-200/70 px-2.5 py-1 text-[11px] font-medium text-slate-700 backdrop-blur-md">
                      {plugin.badge}
                    </span>
                  )}
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500">ورود به ابزار</span>
                  <span className="text-sm font-medium text-blue-700 group-hover:text-blue-900 transition-colors flex items-center gap-2">
                    <span>باز کردن</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-[-4px]">
                      ←
                    </span>
                  </span>
                </div>

                {/* subtle shine */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-  /20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plugins;
