// // app/(landing)/article/[slug]/page.tsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import type { Swiper as SwiperType } from "swiper";
// import Image from "next/image";
// import "swiper/css";
// import "swiper/css/navigation";

// // تبدیل عنوان به slug خوانا (در صورت نبود slugArticle)
// function makeSlug(title: string): string {
//   return title
//     .trim()
//     .toLowerCase()
//     .replace(
//       /[^\u0600-\u06FF\uFB8A\u067E\u0686\u0698\u06AF\u06A9\u06CC\u200c\-0-9a-z]/g,
//       "",
//     )
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// // بررسی شناسه معتبر ۲۴ کاراکتری
// function isValidObjectId(id: string): boolean {
//   return /^[0-9a-fA-F]{24}$/.test(id);
// }

// interface Category {
//   _id: string;
//   name: string;
// }

// interface ArticleSummary {
//   _id: string;
//   title: string;
//   slugArticle?: string; // ممکن است وجود نداشته باشد
//   mainImageUrl: string;
//   summary: string;
//   categoryId: string;
// }

// interface FullArticle extends ArticleSummary {
//   text?: string;
//   insideImageUrl?: string;
//   firstName?: string;
//   lastName?: string;
//   category?: { name: string };
// }

// function stripHtml(html: string): string {
//   if (!html) return "";
//   return html.replace(/<[^>]*>/g, "");
// }

// function truncateToTwoLines(text: string, maxLength = 90): string {
//   const plain = stripHtml(text);
//   if (plain.length <= maxLength) return plain;
//   return plain.slice(0, maxLength).trim() + "...";
// }

// function extractImagesFromHtml(html: string): string[] {
//   if (!html) return [];
//   const imgRegex = /<img[^>]+src="([^">]+)"/g;
//   const matches = [...html.matchAll(imgRegex)];
//   return matches.map((m) => m[1]);
// }

// export default function ArticlePage() {
//   const params = useParams();
//   const router = useRouter();
//   const slugParam = decodeURIComponent(params.slug as string);

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
//   const [articlesOfCategory, setArticlesOfCategory] = useState<
//     ArticleSummary[]
//   >([]);
//   const [currentFullArticle, setCurrentFullArticle] =
//     useState<FullArticle | null>(null);
//   const [allSummaries, setAllSummaries] = useState<ArticleSummary[]>([]);
//   const [slugToIdMap, setSlugToIdMap] = useState<Map<string, string>>(
//     new Map(),
//   );

//   const [loadingCategories, setLoadingCategories] = useState(true);
//   const [loadingArticlesSlider, setLoadingArticlesSlider] = useState(false);
//   const [loadingMainContent, setLoadingMainContent] = useState(true);

//   const articleSliderRef = useRef<SwiperType | null>(null);
//   const [activeSlideIndex, setActiveSlideIndex] = useState(0);
//   const isProgrammaticChange = useRef(false);

//   // 1. دریافت دسته‌بندی‌ها و خلاصه مقالات + ساخت نقشه slug -> _id
//   useEffect(() => {
//     Promise.all([
//       fetch("https://barchasb-server-admin.liara.run/categories").then((res) =>
//         res.json(),
//       ),
//       fetch(
//         "https://barchasb-server-admin.liara.run/public/articles/summary",
//       ).then((res) => res.json()),
//     ])
//       .then(([catsData, summariesData]) => {
//         setCategories(catsData);
//         const summaries = summariesData as ArticleSummary[];
//         setAllSummaries(summaries);
//         const map = new Map<string, string>();
//         summaries.forEach((s) => {
//           const slug = s.slugArticle ? s.slugArticle : makeSlug(s.title);
//           map.set(slug, s._id);
//         });
//         setSlugToIdMap(map);
//         setLoadingCategories(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoadingCategories(false);
//       });
//   }, []);

//   // 2. تعیین articleId از slugParam (مستقیم id یا slug خوانا)
//   useEffect(() => {
//     if (!slugParam || allSummaries.length === 0) return;
//     let articleId: string | null = null;
//     if (isValidObjectId(slugParam)) {
//       articleId = slugParam;
//     } else {
//       articleId = slugToIdMap.get(slugParam) || null;
//     }
//     if (!articleId) {
//       router.push("/404");
//       return;
//     }
//     const summary = allSummaries.find((s) => s._id === articleId);
//     if (!summary) {
//       router.push("/404");
//       return;
//     }
//     setLoadingMainContent(true);
//     fetch(
//       `https://barchasb-server-admin.liara.run/articles/by-category?category=${summary.categoryId}`,
//     )
//       .then((res) => res.json())
//       .then((articles: FullArticle[]) => {
//         const full = articles.find((a) => a._id === articleId);
//         if (!full) throw new Error("Full article not found");
//         setCurrentFullArticle(full);
//         setSelectedCategoryId(summary.categoryId);
//         setLoadingMainContent(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoadingMainContent(false);
//         router.push("/404");
//       });
//   }, [slugParam, allSummaries, slugToIdMap, router]);

//   // 3. بارگذاری مقالات دسته انتخاب شده برای اسلایدر بالا
//   useEffect(() => {
//     if (!selectedCategoryId) return;
//     setLoadingArticlesSlider(true);
//     fetch(
//       `https://barchasb-server-admin.liara.run/articles/by-category?category=${selectedCategoryId}`,
//     )
//       .then((res) => res.json())
//       .then((data: FullArticle[]) => {
//         const sliderArticles: ArticleSummary[] = data.map((art) => ({
//           _id: art._id,
//           title: art.title,
//           slugArticle: art.slugArticle,
//           mainImageUrl: art.mainImageUrl,
//           summary: art.summary || art.text || "",
//           categoryId: art.categoryId,
//         }));
//         setArticlesOfCategory(sliderArticles);
//         setLoadingArticlesSlider(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setArticlesOfCategory([]);
//         setLoadingArticlesSlider(false);
//       });
//   }, [selectedCategoryId]);

//   // 4. همگام‌سازی اسلایدر بالا با مقاله جاری
//   useEffect(() => {
//     if (
//       !articleSliderRef.current ||
//       articlesOfCategory.length === 0 ||
//       !currentFullArticle
//     )
//       return;
//     const index = articlesOfCategory.findIndex(
//       (a) => a._id === currentFullArticle._id,
//     );
//     if (index !== -1 && index !== activeSlideIndex) {
//       isProgrammaticChange.current = true;
//       articleSliderRef.current.slideTo(index);
//       setActiveSlideIndex(index);
//       isProgrammaticChange.current = false;
//     }
//   }, [currentFullArticle, articlesOfCategory, activeSlideIndex]);

//   // بارگذاری مقاله جدید
//   const loadArticleById = (articleId: string) => {
//     const summary = allSummaries.find((s) => s._id === articleId);
//     if (summary) {
//       const newSlug = summary.slugArticle
//         ? summary.slugArticle
//         : makeSlug(summary.title);
//       if (newSlug === slugParam) return;
//       router.push(`/article/${newSlug}`);
//     } else {
//       console.error("Article not found for id", articleId);
//     }
//   };

//   const goToPrevArticle = () => {
//     if (!articleSliderRef.current || articlesOfCategory.length <= 1) return;
//     const currentIndex = articleSliderRef.current.realIndex;
//     const newIndex =
//       currentIndex === 0 ? articlesOfCategory.length - 1 : currentIndex - 1;
//     isProgrammaticChange.current = true;
//     articleSliderRef.current.slideTo(newIndex);
//     isProgrammaticChange.current = false;
//   };
//   const goToNextArticle = () => {
//     if (!articleSliderRef.current || articlesOfCategory.length <= 1) return;
//     const currentIndex = articleSliderRef.current.realIndex;
//     const newIndex =
//       currentIndex === articlesOfCategory.length - 1 ? 0 : currentIndex + 1;
//     isProgrammaticChange.current = true;
//     articleSliderRef.current.slideTo(newIndex);
//     isProgrammaticChange.current = false;
//   };

//   const handleCategoryClick = async (categoryId: string) => {
//     if (categoryId === selectedCategoryId) return;
//     try {
//       const res = await fetch(
//         `https://barchasb-server-admin.liara.run/articles/by-category?category=${categoryId}`,
//       );
//       const data: FullArticle[] = await res.json();
//       if (data.length > 0) loadArticleById(data[0]._id);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
//     e.currentTarget.scrollLeft += e.deltaY;
//     e.preventDefault();
//   };

//   if (loadingMainContent || loadingCategories) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-[#143A62]">در حال بارگذاری مقاله...</p>
//       </div>
//     );
//   }

//   if (!currentFullArticle) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">مقاله یافت نشد</p>
//       </div>
//     );
//   }

//   const mainImages: string[] = [];
//   if (currentFullArticle.mainImageUrl)
//     mainImages.push(currentFullArticle.mainImageUrl);
//   if (currentFullArticle.insideImageUrl)
//     mainImages.push(currentFullArticle.insideImageUrl);
//   const innerImages = extractImagesFromHtml(currentFullArticle.text || "");
//   mainImages.push(...innerImages);
//   const uniqueMainImages = [
//     ...new Set(mainImages.filter((img) => img && img.trim() !== "")),
//   ];

//   const hasMultipleArticles = articlesOfCategory.length > 1;

//   return (
//     <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
//         {/* ردیف دسته‌بندی‌ها با دکمه برگشت در سمت چپ */}
//         {!loadingCategories && categories.length > 0 && (
//           <div className="p-4 border-b border-gray-100">
//             <div className="flex items-center justify-between gap-3">
//               {/* کانتینر دسته‌بندی‌ها با اسکرول افقی */}
//               <div
//                 className="flex-1 flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide"
//                 style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//                 onWheel={handleWheelScroll}
//               >
//                 {categories.map((cat) => (
//                   <button
//                     key={cat._id}
//                     onClick={() => handleCategoryClick(cat._id)}
//                     className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
//                       selectedCategoryId === cat._id
//                         ? "bg-[#143A62] text-white font-medium shadow"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     {cat.name}
//                   </button>
//                 ))}
//               </div>
//               {/* دکمه برگشت (دایره با فلش سفید) */}
//               <button
//                 onClick={() => router.back()}
//                 className="flex-shrink-0 w-12 h-12 rounded-full border border-gray-300 bg-gray-500/50 flex items-center justify-center shadow-sm hover:bg-gray-400/50 transition-all cursor-pointer"
//                 aria-label="بازگشت"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2.5}
//                   stroke="white"
//                   className="w-6 h-6"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 19.5L8.25 12l7.5-7.5"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* اسلایدر مقالات دسته (بقیه کد بدون تغییر) */}
//         {!loadingArticlesSlider && articlesOfCategory.length > 0 && (
//           <div className="relative px-0 pt-4 pb-2">
//             {/* ... Swiper و بقیه اجزا ... */}
//             <Swiper
//               onSwiper={(swiper) => (articleSliderRef.current = swiper)}
//               modules={[Navigation]}
//               navigation={{
//                 nextEl: ".slider-next-btn",
//                 prevEl: ".slider-prev-btn",
//               }}
//               slidesPerView={1}
//               spaceBetween={0}
//               onSlideChange={(swiper) => {
//                 if (isProgrammaticChange.current) return;
//                 const realIndex = swiper.realIndex;
//                 setActiveSlideIndex(realIndex);
//                 const targetArticle = articlesOfCategory[realIndex];
//                 if (
//                   targetArticle &&
//                   targetArticle._id !== currentFullArticle._id
//                 )
//                   loadArticleById(targetArticle._id);
//               }}
//               className="w-full"
//             >
//               {articlesOfCategory.map((article) => (
//                 <SwiperSlide key={article._id}>
//                   <div
//                     className="cursor-pointer group relative rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02] mx-2"
//                     onClick={() => loadArticleById(article._id)}
//                   >
//                     <div className="relative w-full h-64 sm:h-72 md:h-80">
//                       <img
//                         src={
//                           article.mainImageUrl ||
//                           "/images/comingsoon_barchasb.svg"
//                         }
//                         alt={article.title}
//                         className="w-full h-full object-cover"
//                         onError={(e) =>
//                           ((e.target as HTMLImageElement).src =
//                             "/images/comingsoon_barchasb.svg")
//                         }
//                       />
//                     </div>
//                     <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black/60 p-3 text-white">
//                       <h3 className="font-bold text-base line-clamp-1">
//                         {article.title}
//                       </h3>
//                       <p className="text-sm text-gray-200 line-clamp-2">
//                         {truncateToTwoLines(article.summary, 90)}
//                       </p>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             <button className="slider-prev-btn absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all">
//               <Image
//                 src="/images/arrow_left_status.svg"
//                 width={22}
//                 height={55}
//                 alt="قبلی"
//               />
//             </button>
//             <button className="slider-next-btn absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all">
//               <Image
//                 src="/images/arrow_right_status.svg"
//                 width={22}
//                 height={55}
//                 alt="بعدی"
//               />
//             </button>

//             <div className="flex justify-center items-center gap-6 py-6 mt-2">
//               <button
//                 onClick={goToPrevArticle}
//                 disabled={!hasMultipleArticles}
//                 className={`w-8 h-8 rounded-full transition-all ${
//                   hasMultipleArticles
//                     ? "bg-gray-300 hover:bg-gray-400 cursor-pointer"
//                     : "bg-gray-100 cursor-not-allowed opacity-50"
//                 }`}
//                 aria-label="مقاله قبلی"
//               />
//               <div className="w-12 h-12 rounded-full bg-orange-500 shadow-lg scale-110" />
//               <button
//                 onClick={goToNextArticle}
//                 disabled={!hasMultipleArticles}
//                 className={`w-8 h-8 rounded-full transition-all ${
//                   hasMultipleArticles
//                     ? "bg-gray-300 hover:bg-gray-400 cursor-pointer"
//                     : "bg-gray-100 cursor-not-allowed opacity-50"
//                 }`}
//                 aria-label="مقاله بعدی"
//               />
//             </div>
//           </div>
//         )}

//         {/* محتوای اصلی مقاله (بدون تغییر) */}
//         <div className="p-6">
//           <h1 className="text-3xl font-bold text-[#143A62] mb-2">
//             {currentFullArticle.title}
//           </h1>
//           <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
//             <span>
//               نویسنده: {currentFullArticle.firstName || "ناشناس"}{" "}
//               {currentFullArticle.lastName || ""}
//             </span>
//             <span>•</span>
//             <span>
//               دسته: {currentFullArticle.category?.name || "بدون دسته"}
//             </span>
//           </div>

//           {uniqueMainImages.length > 0 && (
//             <div className="w-full h-96 bg-black rounded-lg mb-6">
//               <Swiper
//                 modules={[Autoplay]}
//                 autoplay={{ delay: 3000, disableOnInteraction: false }}
//                 loop={true}
//                 spaceBetween={0}
//                 slidesPerView={1}
//                 className="w-full h-full rounded-lg"
//               >
//                 {uniqueMainImages.map((src, idx) => (
//                   <SwiperSlide key={idx}>
//                     <div className="flex items-center justify-center w-full h-full bg-black">
//                       <img
//                         src={src}
//                         alt={`${currentFullArticle.title} - تصویر ${idx + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>
//           )}

//           <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
//             {currentFullArticle.text ? (
//               <div
//                 dangerouslySetInnerHTML={{ __html: currentFullArticle.text }}
//               />
//             ) : (
//               <div>{currentFullArticle.summary}</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// app/(landing)/article/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// تبدیل عنوان به slug خوانا (در صورت نبود slugArticle)
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

// بررسی شناسه معتبر ۲۴ کاراکتری
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

interface Category {
  _id: string;
  name: string;
}

interface ArticleSummary {
  _id: string;
  title: string;
  slugArticle?: string; // ممکن است وجود نداشته باشد
  mainImageUrl: string;
  summary: string;
  categoryId: string;
}

interface FullArticle extends ArticleSummary {
  text?: string;
  insideImageUrl?: string;
  firstName?: string;
  lastName?: string;
  category?: { name: string };
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

function truncateToTwoLines(text: string, maxLength = 90): string {
  const plain = stripHtml(text);
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + "...";
}

function extractImagesFromHtml(html: string): string[] {
  if (!html) return [];
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const matches = [...html.matchAll(imgRegex)];
  return matches.map((m) => m[1]);
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = decodeURIComponent(params.slug as string);
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const handleResumeClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard/plugins/resume");
    } else {
      router.push("/register");
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [articlesOfCategory, setArticlesOfCategory] = useState<
    ArticleSummary[]
  >([]);
  const [currentFullArticle, setCurrentFullArticle] =
    useState<FullArticle | null>(null);
  const [allSummaries, setAllSummaries] = useState<ArticleSummary[]>([]);
  const [slugToIdMap, setSlugToIdMap] = useState<Map<string, string>>(
    new Map(),
  );

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingArticlesSlider, setLoadingArticlesSlider] = useState(false);
  const [loadingMainContent, setLoadingMainContent] = useState(true);

  const articleSliderRef = useRef<SwiperType | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const isProgrammaticChange = useRef(false);

  // 1. دریافت دسته‌بندی‌ها و خلاصه مقالات + ساخت نقشه slug -> _id
  useEffect(() => {
    Promise.all([
      fetch("https://barchasb-server-admin.liara.run/categories").then((res) =>
        res.json(),
      ),
      fetch(
        "https://barchasb-server-admin.liara.run/public/articles/summary",
      ).then((res) => res.json()),
    ])
      .then(([catsData, summariesData]) => {
        setCategories(catsData);
        const summaries = summariesData as ArticleSummary[];
        setAllSummaries(summaries);
        const map = new Map<string, string>();
        summaries.forEach((s) => {
          const slug = s.slugArticle ? s.slugArticle : makeSlug(s.title);
          map.set(slug, s._id);
        });
        setSlugToIdMap(map);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingCategories(false);
      });
  }, []);

  // 2. تعیین articleId از slugParam (مستقیم id یا slug خوانا)
  useEffect(() => {
    if (!slugParam || allSummaries.length === 0) return;
    let articleId: string | null = null;
    if (isValidObjectId(slugParam)) {
      articleId = slugParam;
    } else {
      articleId = slugToIdMap.get(slugParam) || null;
    }
    if (!articleId) {
      router.push("/404");
      return;
    }
    const summary = allSummaries.find((s) => s._id === articleId);
    if (!summary) {
      router.push("/404");
      return;
    }
    setLoadingMainContent(true);
    fetch(
      `https://barchasb-server-admin.liara.run/articles/by-category?category=${summary.categoryId}`,
    )
      .then((res) => res.json())
      .then((articles: FullArticle[]) => {
        const full = articles.find((a) => a._id === articleId);
        if (!full) throw new Error("Full article not found");
        setCurrentFullArticle(full);
        setSelectedCategoryId(summary.categoryId);
        setLoadingMainContent(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingMainContent(false);
        router.push("/404");
      });
  }, [slugParam, allSummaries, slugToIdMap, router]);

  // 3. بارگذاری مقالات دسته انتخاب شده برای اسلایدر بالا
  useEffect(() => {
    if (!selectedCategoryId) return;
    setLoadingArticlesSlider(true);
    fetch(
      `https://barchasb-server-admin.liara.run/articles/by-category?category=${selectedCategoryId}`,
    )
      .then((res) => res.json())
      .then((data: FullArticle[]) => {
        const sliderArticles: ArticleSummary[] = data.map((art) => ({
          _id: art._id,
          title: art.title,
          slugArticle: art.slugArticle,
          mainImageUrl: art.mainImageUrl,
          summary: art.summary || art.text || "",
          categoryId: art.categoryId,
        }));
        setArticlesOfCategory(sliderArticles);
        setLoadingArticlesSlider(false);
      })
      .catch((err) => {
        console.error(err);
        setArticlesOfCategory([]);
        setLoadingArticlesSlider(false);
      });
  }, [selectedCategoryId]);

  // 4. همگام‌سازی اسلایدر بالا با مقاله جاری
  useEffect(() => {
    if (
      !articleSliderRef.current ||
      articlesOfCategory.length === 0 ||
      !currentFullArticle
    )
      return;
    const index = articlesOfCategory.findIndex(
      (a) => a._id === currentFullArticle._id,
    );
    if (index !== -1 && index !== activeSlideIndex) {
      isProgrammaticChange.current = true;
      articleSliderRef.current.slideTo(index);
      setActiveSlideIndex(index);
      isProgrammaticChange.current = false;
    }
  }, [currentFullArticle, articlesOfCategory, activeSlideIndex]);

  // بارگذاری مقاله جدید
  const loadArticleById = (articleId: string) => {
    const summary = allSummaries.find((s) => s._id === articleId);
    if (summary) {
      const newSlug = summary.slugArticle
        ? summary.slugArticle
        : makeSlug(summary.title);
      if (newSlug === slugParam) return;
      router.push(`/article/${newSlug}`);
    } else {
      console.error("Article not found for id", articleId);
    }
  };

  const goToPrevArticle = () => {
    if (!articleSliderRef.current || articlesOfCategory.length <= 1) return;
    const currentIndex = articleSliderRef.current.realIndex;
    const newIndex =
      currentIndex === 0 ? articlesOfCategory.length - 1 : currentIndex - 1;
    isProgrammaticChange.current = true;
    articleSliderRef.current.slideTo(newIndex);
    isProgrammaticChange.current = false;
  };
  const goToNextArticle = () => {
    if (!articleSliderRef.current || articlesOfCategory.length <= 1) return;
    const currentIndex = articleSliderRef.current.realIndex;
    const newIndex =
      currentIndex === articlesOfCategory.length - 1 ? 0 : currentIndex + 1;
    isProgrammaticChange.current = true;
    articleSliderRef.current.slideTo(newIndex);
    isProgrammaticChange.current = false;
  };

  const handleCategoryClick = async (categoryId: string) => {
    if (categoryId === selectedCategoryId) return;
    try {
      const res = await fetch(
        `https://barchasb-server-admin.liara.run/articles/by-category?category=${categoryId}`,
      );
      const data: FullArticle[] = await res.json();
      if (data.length > 0) loadArticleById(data[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.currentTarget.scrollLeft += e.deltaY;
    e.preventDefault();
  };

  if (loadingMainContent || loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#143A62]">در حال بارگذاری مقاله...</p>
      </div>
    );
  }

  if (!currentFullArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">مقاله یافت نشد</p>
      </div>
    );
  }

  const mainImages: string[] = [];
  if (currentFullArticle.mainImageUrl)
    mainImages.push(currentFullArticle.mainImageUrl);
  if (currentFullArticle.insideImageUrl)
    mainImages.push(currentFullArticle.insideImageUrl);
  const innerImages = extractImagesFromHtml(currentFullArticle.text || "");
  mainImages.push(...innerImages);
  const uniqueMainImages = [
    ...new Set(mainImages.filter((img) => img && img.trim() !== "")),
  ];

  const hasMultipleArticles = articlesOfCategory.length > 1;
  // ...................................................................................................................................................
  // پیشنهاد بازطراحی کامل بخش return در ArticlePage.tsx

  // بخش نهایی return در فایل app/(landing)/article/[slug]/page.tsx
  return (
    <div className="w-full relative">
      {/* ۱. هدر و دسته‌بندی‌ها */}
      <div className="px-6 md:px-8 pt-10 pb-6 border-b border-gray-100">
        <span className="text-[10px] md:text-xs bg-[#143A62]/10 text-[#143A62] px-3 py-1 rounded-full font-bold">
          مجله آموزشی برچسب
        </span>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#143A62] mt-4 mb-3">
          {currentFullArticle.category?.name || "مقالات و مطالب آموزشی"}
        </h1>

        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all duration-300
                  ${
                    selectedCategoryId === cat._id
                      ? "bg-[#143A62] text-white border-[#143A62] shadow-md scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#143A62] hover:text-[#143A62]"
                  }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ۲. اسلایدر مقالات مرتبط (بسیار مهم برای درگیری کاربر) */}
      {!loadingArticlesSlider && articlesOfCategory.length > 0 && (
        <div className="relative px-4 sm:px-6 py-8 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <h3 className="text-sm font-extrabold text-gray-800">
                مقالات مرتبط این دسته
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                پیشنهاد مطالعه برای شما
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#143A62] bg-[#143A62]/5 px-3 py-1.5 rounded-lg">
              {articlesOfCategory.length} مطلب
            </span>
          </div>

          <Swiper
            onSwiper={(swiper) => (articleSliderRef.current = swiper)}
            modules={[Navigation]}
            navigation={{
              nextEl: ".slider-next-btn",
              prevEl: ".slider-prev-btn",
            }}
            slidesPerView={1.2}
            spaceBetween={14}
            breakpoints={{
              640: { slidesPerView: 1.6 },
              768: { slidesPerView: 2.1 },
              1024: { slidesPerView: 2.4 },
            }}
            className="w-full !pb-4"
          >
            {articlesOfCategory.map((article) => {
              const isActive = currentFullArticle?._id === article._id;
              return (
                <SwiperSlide key={article._id}>
                  <div
                    onClick={() =>
                      article._id !== currentFullArticle?._id &&
                      loadArticleById(article._id)
                    }
                    className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-500 bg-white
                        ${
                          isActive
                            ? "border-[#143A62] shadow-lg ring-1 ring-[#143A62]/20"
                            : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1"
                        }`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={
                          article.mainImageUrl ||
                          "/images/comingsoon_barchasb.svg"
                        }
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#143A62]/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-white text-[#143A62] text-[10px] font-black px-3 py-1 rounded-full shadow-xl">
                            در حال مطالعه
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-xs text-gray-800 line-clamp-1 group-hover:text-[#143A62]">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* ۳. محتوای اصلی مقاله */}
      <div className="p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-[#143A62] leading-tight mb-6">
            {currentFullArticle.title}
          </h1>

          <div className="flex items-center gap-4 text-[11px] text-gray-400 bg-gray-50 w-fit px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#143A62] flex items-center justify-center text-white text-[10px]">
                {currentFullArticle.firstName?.[0] || "B"}
              </div>
              <span className="font-bold text-gray-700">
                {currentFullArticle.firstName} {currentFullArticle.lastName}
              </span>
            </div>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>زمان مطالعه: ۵ دقیقه</span>
          </div>
        </header>

        {/* تصویر شاخص با اسلایدر */}
        {uniqueMainImages.length > 0 && (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-2xl border-4 border-white">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 4000 }}
              loop={true}
              className="w-full h-full"
            >
              {uniqueMainImages.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt="تصویر مقاله"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* متن مقاله */}
        <article className="prose prose-blue max-w-none prose-p:text-gray-600 prose-p:leading-[2.2] prose-p:text-justify prose-p:mb-6">
          {currentFullArticle.text ? (
            <div className="relative">
              {/* تبلیغ میانی مدرن و مینیمال (به جای نارنجی) */}
              <div className="xl:hidden my-12 relative">
                <div className="absolute inset-0 bg-gray-50 rounded-3xl -rotate-1 scale-[1.02]"></div>
                <div className="relative border-2 border-dashed border-gray-200 p-8 rounded-3xl bg-white flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#143A62]/5 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl">📄</span>
                  </div>
                  <h4 className="text-[#143A62] font-black text-lg mb-2">
                    رزومه حرفه‌ای، کلید استخدام
                  </h4>
                  <p className="text-gray-500 text-xs leading-6 mb-6">
                    فرصت‌های شغلی برتر را با یک رزومه استاندارد از دست ندهید.
                  </p>
                  <button
                    onClick={handleResumeClick}
                    className="bg-[#143A62] text-white px-8 py-3 rounded-2xl text-[11px] font-bold hover:bg-[#1e538a] transition-all"
                  >
                    ساخت رزومه رایگان
                  </button>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: currentFullArticle.text }}
              />
            </div>
          ) : (
            <p className="text-lg text-gray-500 italic text-center py-10">
              {currentFullArticle.summary}
            </p>
          )}
        </article>
      </div>

      {/* ۴. تبلیغ شناور پایین صفحه (فقط موبایل) */}

      <div className="xl:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <div className="relative group">
          {/* افکت نورانی پشت بنر */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#143A62] to-[#4facfe] rounded-[2.5rem] blur opacity-25"></div>

          <div className="relative flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/60 p-3 pr-6 rounded-[2rem] shadow-2xl overflow-hidden">
            {/* دایره دکوراتیو پس‌زمینه */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#143A62]/5 rounded-full"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 bg-[#143A62] rounded-2xl flex items-center justify-center shadow-lg shadow-[#143A62]/30">
                  <span className="text-xl">✨</span>
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              </div>
              <div>
                <h5 className="text-[#143A62] font-black text-sm">
                  تبلیغ شما اینجا
                </h5>
                <p className="text-[10px] text-gray-500 font-bold">
                  کلیک کنید و سفارش دهید
                </p>
              </div>
            </div>

            <button className="bg-[#143A62] text-white px-6 py-3 rounded-[1.2rem] text-[11px] font-black shadow-lg shadow-[#143A62]/20 active:scale-95 transition-all relative z-10">
              شروع کنید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
