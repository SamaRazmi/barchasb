"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/api";
import TestHeader from "@/components/tests/testHeader";
import TestFooter from "@/components/tests/testFooter";

interface Blueprint {
  totalQuestions?: number;
  timeLimit?: number;
}

interface Subcategory {
  _id: string;
  name: string;
  description?: string | null;
  blueprint?: Blueprint | null;
}

// دریافت زیردسته‌ها
const fetchSubcategories = async (
  categoryId: string,
): Promise<Subcategory[]> => {
  const res = await fetchWithAuth(`/api/tests/categories/${categoryId}/types`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `خطای سرور: ${res.status}`);
  }

  const data = await res.json();
  // اگر بک‌ند داده‌ها را در یک فیلد خاص مثل 'data' می‌فرستد:
  return Array.isArray(data) ? data : data.subcategories || [];
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.parent as string | undefined;

  const {
    data: subcategories,
    isLoading,
    error,
  } = useQuery<Subcategory[]>({
    queryKey: ["subcategories", categoryId],
    queryFn: () => fetchSubcategories(categoryId!),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!categoryId,
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

  if (error || !subcategories) {
    return (
      <div className="flex justify-center text-2xl items-center h-screen text-red-500 font-bold">
        خطا در دریافت داده‌ها !!
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 pt-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        <TestHeader />
      </div>
      <div className="flex flex-col items-center gap-10 px-4 flex-grow">
        {/* Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center items-center gap-4">
            <Image
              src="/images/knowledge.svg"
              alt="knowledge"
              width={40}
              height={40}
              className="w-14 h-14"
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              دسته‌بندی آزمون‌ها
            </h1>
          </div>

          <div>
            <p className="text-slate-500 text-[18px]">
              یک آزمون را انتخاب کنید و مهارت خود را بسنجید
            </p>
          </div>
        </div>

        {/* Cards */}
        {subcategories.length === 0 ? (
          <p className="text-gray-500 font-bold">
            زیر دسته‌ای برای این دسته‌بندی پیدا نشد
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
            {subcategories.map((sub) => {
              const totalQuestions =
                typeof sub.blueprint?.totalQuestions === "number"
                  ? sub.blueprint.totalQuestions
                  : 30;

              const query = new URLSearchParams({
                title: sub.name,
                desc: sub.description ?? "",
                totalQuestions: String(totalQuestions),
              });

              if (sub.blueprint?.timeLimit) {
                query.append("timeLimit", String(sub.blueprint.timeLimit));
              }

              return (
                <Link
                  key={sub._id}
                  href={`/dashboard/plugins/tests/quiz/${sub._id}/intro?${query.toString()}`}
                  className="group relative bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl p-6
                shadow-lg hover:shadow-2xl hover:-translate-y-2
                transition-all duration-300 overflow-hidden"
                >
                  {/* gradient glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition duration-500 bg-gradient-to-br from-blue-50 to-indigo-50"></div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-800">
                      {sub.name}
                    </h3>

                    <p className="text-slate-500 text-sm mt-3 leading-6 line-clamp-2">
                      {sub.description ||
                        "آزمون استاندارد جهت ارزیابی دانش و مهارت شما."}
                    </p>

                    {/* stats */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                        <span className="font-bold text-slate-700">
                          {totalQuestions}
                        </span>
                        <span className="text-slate-500 text-xs">سوال</span>
                      </div>

                      {sub.blueprint?.timeLimit ? (
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                          <span className="font-bold text-slate-700">
                            {sub.blueprint.timeLimit}
                          </span>
                          <span className="text-slate-500 text-xs">دقیقه</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">
                          بدون محدودیت زمان
                        </div>
                      )}
                    </div>

                    {/* button */}
                    <div className="mt-6">
                      <div
                        className="w-full text-center py-2.5 rounded-xl
  bg-gradient-to-r from-slate-700 via-slate-500 to-orange-500
  text-white text-sm font-semibold 
  shadow-md
  group-hover:scale-[1.03]
  group-hover:shadow-lg
  group-hover:shadow-orange-500/20
  transition-all duration-300"
                      >
                        اطلاعات آزمون
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-auto w-full ">
        <TestFooter />
      </div>
    </main>
  );
}
