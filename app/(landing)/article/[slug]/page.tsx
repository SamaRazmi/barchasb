// import React from "react";
// import Header from "@/components/Home/Header";
// import ArticlePage from "./ArticlePage";

// const Article: React.FC = () => {
//   return (
//     <div>
//       <ArticlePage />
//       {/* قسمت پایین خالی و بدون محتوا */}
//     </div>
//   );
// };

// export default Article;

"use client";
import React from "react";
import Header from "@/components/Home/Header";
import ArticlePage from "./ArticlePage";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Article: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

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
      <div className="pt-20 md:pt-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* ستون اصلی */}
            <main
              className="col-span-12 lg:col-span-8 xl:col-span-8 order-1 
      bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm 
      border border-gray-100 overflow-hidden"
            >
              <ArticlePage />
            </main>

            {/* سایدبار چپ */}
            <aside className="col-span-12 lg:col-span-4 xl:col-span-2 order-2 xl:order-none">
              <div className="space-y-6 xl:sticky xl:top-[110px]">
                {/* تبلیغ */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <div
                    className="group relative h-[260px] sm:h-[300px] xl:h-[380px] rounded-2xl overflow-hidden 
            bg-gradient-to-br from-[#143A62] to-[#2a5d91] 
            text-white flex flex-col justify-between p-6 
            transition-all duration-500 ease-out
            hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#143A62]/30"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 
              transition-opacity duration-500 
              bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"
                    />

                    <div className="relative z-10">
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        تبلیغات
                      </span>

                      <h4 className="text-lg sm:text-xl font-bold mt-4 leading-7 sm:leading-8">
                        تبلیغ
                        <br />
                        کسب و کار شما
                      </h4>
                    </div>

                    <div className="relative z-10">
                      <p className="text-xs opacity-80 mb-3">
                        جهت سفارش با پشتیبانی تماس بگیرید
                      </p>

                      <button
                        className="opacity-100 xl:opacity-0 translate-y-0 xl:translate-y-3  
                xl:group-hover:opacity-100 xl:group-hover:translate-y-0 
                transition-all duration-500 text-xs bg-white text-[#143A62] 
                px-4 py-2 rounded-full font-bold shadow-md w-full"
                      >
                        ثبت سفارش تبلیغ
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h4 className="text-sm font-bold text-[#143A62] mb-4">
                    ابزارهای کاربردی
                  </h4>

                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
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
                        className="w-full text-right text-xs px-4 py-3 rounded-xl 
                  bg-gray-50 hover:bg-[#143A62] hover:text-white 
                  transition-all duration-300"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* سایدبار راست */}
            <aside className="col-span-12 xl:col-span-2 order-3">
              <div className="space-y-6 xl:sticky xl:top-[110px]">
                {/* برچسب کلاب */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#143A62] to-[#1e538a] rounded-3xl shadow-xl p-6 text-white">
                  {/* افکت نور پس‌زمینه */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                  {/* عنوان */}
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                      🎮 برچسب کلاب
                    </h4>

                    <p className="text-[11px] opacity-90 leading-6 mb-5">
                      بازی کن، امتیاز بگیر و مهارت‌های شغلی‌ات را ارتقا بده.
                      آزمون‌ها، چالش‌ها و بازی‌های جذاب منتظر تو هستند.
                    </p>

                    {/* آیتم‌ها */}
                    <div className="grid grid-cols-2 gap-2 mb-5 text-[11px]">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                        🎡 چرخونه شانس
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                        🎯 چالش مهارتی
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                        🏆 جمع کردن امتیاز
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                        🎁 جایزه و هدیه
                      </div>
                    </div>

                    {/* دکمه */}
                    <button
                      onClick={() => router.push("/club")}
                      className="w-full bg-white text-[#143A62] font-bold text-sm py-3 rounded-2xl hover:scale-[1.03] transition-all shadow-lg"
                    >
                      ورود به برچسب کلاب 🚀
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-3xl text-white p-6">
                  <h4 className="font-bold mb-2">نیاز به راهنمایی دارید؟</h4>

                  <p className="text-xs leading-6 opacity-90 mb-4">
                    برای دریافت مشاوره درباره خدمات برچسب با ما تماس بگیرید.
                  </p>

                  <button
                    onClick={() => router.push("/contactUs")}
                    className="w-full bg-white text-orange-500 rounded-xl py-2 text-xs font-bold hover:scale-105 transition"
                  >
                    تماس با پشتیبانی
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-gray-200 text-center text-gray-400 text-xs">
        تمام حقوق این وب سایت متعلق به سامانه برچسب می‌باشد
      </footer>
    </div>
  );
};

export default Article;
