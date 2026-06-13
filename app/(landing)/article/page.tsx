"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import Header from "@/components/Home/Header";

interface ArticleSummary {
  _id: string;
  title: string;
  slugArticle?: string;
  mainImageUrl: string;
  summary: string;
  categoryId: string;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}

function makeSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(
      /[^\u0600-\u06FF\uFB8A\u067E\u0686\u0698\u06AF\u06A9\u06CC\u200c\-0-9a-z]/g,
      "",
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const ArticleListPage: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // --- تنظیمات صفحه‌بندی ---
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6; // در هر صفحه ۶ مقاله نمایش داده شود

  useEffect(() => {
    fetch("https://barchasb-server-admin.liara.run/public/articles/summary")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // محاسبات صفحه‌بندی
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // اسکرول به بالا بعد از تعویض صفحه
  };

  const handleToolClick = (link: string) => {
    if (isLoggedIn) {
      router.push(link);
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="bg-[#f6f8fb] min-h-screen">
      <Header />

      <div className="pt-24 md:pt-28">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* سایدبار راست */}
            <aside className="col-span-12 xl:col-span-2">
              <div className="xl:sticky xl:top-[110px] space-y-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#143A62] to-[#1e538a] rounded-3xl shadow-xl p-6 text-white">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                      🎮 برچسب کلاب
                    </h4>
                    <p className="text-[11px] opacity-90 leading-6 mb-5">
                      امتیاز بگیر و جایزه ببر.
                    </p>
                    <button
                      onClick={() => router.push("/club")}
                      className="w-full bg-white text-[#143A62] font-bold text-xs py-3 rounded-2xl hover:scale-[1.03] transition-all"
                    >
                      ورود به کلاب
                    </button>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f97316] via-[#fb923c] to-[#fdba74] p-6 text-white shadow-lg shadow-orange-200/50">
                  <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/20 blur-2xl"></div>
                  <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-white/10 blur-2xl"></div>

                  <div className="relative z-10">
                    <h4 className="font-black text-sm mb-2">مشاوره رایگان</h4>
                    <p className="text-[11px] leading-6 opacity-95 mb-4">
                      نیاز به راهنمایی در مورد مقالات یا خدمات دارید؟
                    </p>

                    <button
                      onClick={() => router.push("/contactUs")}
                      className="
            group relative w-full overflow-hidden
            py-3 rounded-2xl text-xs font-black text-[#143A62]
            bg-white
            shadow-md shadow-blue-300/30
            transition-all duration-300 ease-out
            hover:scale-[1.03] hover:-translate-y-0.5
            hover:shadow-xl hover:shadow-orange-400/40
            active:scale-[0.98]
            focus:outline-none focus:ring-4 focus:ring-white/40
          "
                    >
                      <span className="absolute inset-0 -translate-x-full skew-x-12 bg-orange-100/40 group-hover:translate-x-full transition-transform duration-700"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        <span>ارتباط با ما</span>
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                          ←
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* ستون اصلی با صفحه‌بندی */}
            <main className="col-span-12 lg:col-span-8 xl:col-span-7 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10">
              <div className="mb-10 border-b border-gray-50 pb-8 flex justify-between items-end">
                <div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                    مجله خبری
                  </span>
                  <h1 className="text-3xl font-black text-[#143A62] mt-4">
                    مقالات برچسب
                  </h1>
                </div>
                <div className="text-[10px] font-bold text-white bg-gray-400 rounded-[10px] py-1 px-2  ">
                  صفحه {currentPage} از {totalPages}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20 animate-pulse text-gray-300 text-5xl">
                  ...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentArticles.map((article) => {
                      const slug =
                        article.slugArticle || makeSlug(article.title);

                      return (
                        <Link
                          key={article._id}
                          href={`/article/${slug}`}
                          className="
          group relative flex flex-col overflow-hidden
          rounded-[2rem] border border-gray-100 bg-white
          p-4 shadow-[0_10px_30px_rgba(20,58,98,0.05)]
          transition-all duration-300 ease-out
          hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)]
          hover:border-orange-200
        "
                        >
                          {/* glow */}
                          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-50/60 via-transparent to-blue-50/40"></div>

                          {/* image */}
                          <div className="relative z-10 h-52 w-full rounded-3xl overflow-hidden mb-4">
                            <img
                              src={
                                article.mainImageUrl ||
                                "/images/comingsoon_barchasb.svg"
                              }
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              alt={article.title}
                            />

                            {/* top badge */}
                            <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-[#143A62] shadow-sm">
                              مقاله
                            </div>
                          </div>

                          {/* content */}
                          <div className="relative z-10 flex flex-col flex-1">
                            <h2 className="text-lg font-black text-[#143A62] line-clamp-2 group-hover:text-orange-500 transition-colors mb-2">
                              {article.title}
                            </h2>

                            <p className="text-[11px] text-gray-400 leading-6 line-clamp-2 mb-5">
                              {stripHtml(article.summary)}
                            </p>

                            {/* CTA */}
                            <div className="mt-auto flex items-center justify-between">
                              <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#143A62] transition-colors">
                                مطالعه مقاله
                              </span>

                              <span
                                className="
                flex items-center justify-center
                w-10 h-10 rounded-full
                bg-orange-50 text-orange-500
                transition-all duration-300
                group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-md
              "
                              >
                                ←
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* کنترلر صفحه‌بندی */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2">
                      <button
                        onClick={() =>
                          currentPage > 1 && paginate(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className={`p-3 rounded-2xl border transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50"}`}
                      >
                        <span className="text-[#143A62]">→</span>
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`w-10 h-10 rounded-2xl font-bold text-xs transition-all ${
                            currentPage === i + 1
                              ? "bg-[#143A62] text-white shadow-lg shadow-blue-900/20 scale-110"
                              : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          currentPage < totalPages && paginate(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className={`p-3 rounded-2xl border transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50"}`}
                      >
                        <span className="text-[#143A62]">←</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>

            {/* سایدبار چپ (تبلیغات) */}
            <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
              <div className="sticky top-[110px] space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6">
                  <div className="group relative h-[380px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#143A62] to-[#2a5d91] text-white p-6 flex flex-col justify-between">
                    <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full w-fit">
                      تبلیغات شما
                    </span>
                    <div>
                      <h4 className="text-xl font-bold mb-4">فضای تبلیغات</h4>
                      <p className="text-[10px] opacity-70 mb-6 leading-5">
                        کسب‌وکار خود را در پربازدیدترین بخش سایت معرفی کنید.
                      </p>
                      <button
                        className="
  group relative w-full overflow-hidden
  py-3 rounded-2xl text-xs font-black text-white
  bg-gradient-to-r from-[#4DA8FF] via-[#63B5FF] to-[#7CC4FF]
  shadow-lg shadow-blue-300/35
  transition-all duration-300 ease-out
  hover:scale-[1.03] hover:-translate-y-0.5
  hover:shadow-2xl hover:shadow-blue-200/50
  hover:from-[#69B8FF] hover:via-[#7AC2FF] hover:to-[#95D0FF]
  active:scale-[0.98]
  focus:outline-none focus:ring-4 focus:ring-blue-200/50
"
                      >
                        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 group-hover:translate-x-full transition-transform duration-700"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          <span>ثبت آگهی</span>
                          <span className="transition-transform duration-300 group-hover:-translate-x-1">
                            ←
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6">
                  <h4 className="text-sm font-black text-[#143A62] mb-4 px-2">
                    ابزارهای سریع
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: 1,
                        title: " رزومه ساز ",
                        dark: true,
                        link: "/dashboard/plugins/resume",
                      },
                      {
                        id: 2,
                        title: " آزمون های روانشناسی ",
                        dark: false,
                        link: "/dashboard/plugins/tests",
                      },
                      {
                        id: 3,
                        title: " آزمون های شغلی ",
                        dark: false,
                        link: "/dashboard/plugins/tests",
                      },

                      {
                        id: 4,
                        title: "تبدیل فایل ",
                        dark: true,
                        link: "/dashboard/plugins/converter",
                      },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleToolClick(item.link)}
                        className="w-full text-right text-[11px] font-bold p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleListPage;
