"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/api";
import TestHeader from "@/components/tests/testHeader";
import TestFooter from "@/components/tests/testFooter";

import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  isActive: boolean;
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetchWithAuth("/api/tests/categories");
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data: Category[] = await res.json();
    return data.filter((c) => c.isActive);
  } catch (err) {
    console.error("fetchCategories Error:", err);
    throw new Error("خطا در دریافت دسته‌ها");
  }
};

const categoryStyles = [
  {
    gradient: "from-violet-500 to-fuchsia-500",
    softBg: "from-violet-50 to-fuchsia-50",
    iconBg: "from-violet-500 to-fuchsia-200",
    icon: "🧠",
  },
  {
    gradient: "from-sky-500 to-cyan-400",
    softBg: "from-sky-50 to-cyan-50",
    iconBg: "from-sky-600 to-indigo-200",
    icon: "🚀",
  },
  {
    gradient: "from-emerald-500 to-teal-400",
    softBg: "from-emerald-50 to-teal-50",
    iconBg: "from-emerald-500 to-teal-400",
    icon: "🎯",
  },
  {
    gradient: "from-orange-500 to-amber-400",
    softBg: "from-orange-50 to-amber-50",
    iconBg: "from-sky-600 to-indigo-200",
    icon: "🔥",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gradient-to-b from-white to-slate-100">
        <div className="p-6 bg-white/80 border border-red-200 text-center rounded-2xl shadow-xl backdrop-blur-xl">
          <p className="text-xl font-bold text-red-500">
            خطا در دریافت اطلاعات
          </p>
          <p className="text-slate-600 mt-2 text-sm">لطفاً دوباره تلاش کنید.</p>
        </div>
      </div>
    );
  }

  /* ------------ صفحه اصلی ------------ */
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white via-slate-50 to-indigo-50/40 text-slate-800 overflow-hidden">
      <section className="relative flex-1 ">
        {/* پس‌زمینه فانتزی روشن */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-8">
          {/* ---------- عنوان صفحه ---------- */}
          <div className="text-center mb-4">
            <TestHeader />
            <h1 className="text-3xl md:text-5xl font-black leading-tight bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 animated-gradient bg-clip-text text-transparent">
              انتخاب دسته‌بندی آزمون
            </h1>

            <p className="text-slate-600 mt-6 max-w-2xl mx-auto md:text-lg leading-8">
              از میان دسته‌بندی‌های زیر، بخش موردنظرت رو انتخاب کن و وارد مسیر
              یادگیری حرفه‌ای شو.
            </p>
          </div>

          {/* ---------- کارت‌ها ---------- */}
          <div className=" flex md:flex-row flex-col justify-center items-center gap-5 mt-8 ">
            {categories?.map((cat, index) => {
              const style = categoryStyles[index % categoryStyles.length];

              return (
                <Link
                  key={cat._id}
                  href={`/dashboard/plugins/tests/categories/${cat._id}`}
                  className="group"
                >
                  <div
                    className="
    relative rounded-3xl overflow-hidden 
    border border-slate-200/70
    bg-white
    p-6 h-fit
    shadow-[0_10px_30px_rgba(0,0,0,0.06)]
    transition-all duration-300
    hover:-translate-y-2
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
    hover:border-slate-300
  "
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${style.gradient} opacity-80`}
                    />

                    <div className="flex justify-between items-center mb-6">
                      <div
                        className={`
        text-3xl p-3 rounded-2xl 
        bg-gradient-to-br ${style.iconBg}
        text-white
        shadow-[0_6px_18px_rgba(0,0,0,0.15)]
        transition-transform duration-300
        group-hover:scale-105
      `}
                      >
                        {style.icon}
                      </div>

                      <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                        فعال
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                      {cat.name}
                    </h2>

                    <p className="text-slate-500 text-sm leading-7 mt-3">
                      ورود به آزمون‌های مربوط به {cat.name} و مشاهده زیردسته‌های
                      مرتبط.
                    </p>

                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-sm text-slate-400">
                        مشاهده زیردسته‌ها
                      </span>

                      <div
                        className={`
        px-4 py-2 text-sm text-white font-semibold rounded-full
        bg-gradient-to-r ${style.gradient}
        shadow-md
        transition-all duration-300
        group-hover:scale-105
      `}
                      >
                        ورود
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="pt-5 ">
          <TestFooter />
        </div>
      </section>
    </main>
  );
}
