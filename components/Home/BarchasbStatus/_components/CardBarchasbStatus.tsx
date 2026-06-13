"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import ContentBarchasbStatus from "./ContentBarchasbStatus";
import { fetchArticlesSummary } from "@/api/apiArticleSummary";
import type { Article } from "@/types/article";

import "swiper/css";
import "swiper/css/navigation";

export default function CardBarchasbStatus() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticlesSummary()
      .then((data) => {
        const validArticles = data.filter((article) => article && article._id);
        // چرخاندن آرایه به طوری که مقاله دوم (index=1) به اول بیاید
        if (validArticles.length >= 2) {
          const rotated = [
            ...validArticles.slice(1),
            ...validArticles.slice(0, 1),
          ];
          setArticles(rotated);
        } else {
          setArticles(validArticles);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطا در دریافت مقالات:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[78vh] bg-white rounded-[20px]">
        <p className="text-[#143A62]">در حال بارگذاری مقالات...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full flex justify-center items-center h-[78vh] bg-white rounded-[20px]">
        <p className="text-[#143A62]">هیچ مقاله‌ای یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex justify-center py-6">
      <button
        className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer hidden sm:block"
        style={{ left: "calc(50% - 250px)" }}
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <Image
          src="/images/arrow_left_status.svg"
          width={22}
          height={55}
          alt="prev"
        />
      </button>

      <button
        className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer hidden sm:block"
        style={{ left: "calc(50% + 220px)" }}
        onClick={() => swiperRef.current?.slideNext()}
      >
        <Image
          src="/images/arrow_right_status.svg"
          width={22}
          height={55}
          alt="next"
        />
      </button>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
        modules={[Navigation]}
        loop={true}
        centeredSlides={true}
        // بدون initialSlide (یا مقدار 0)
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        breakpoints={{
          0: { slidesPerView: 1.4, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 120 },
        }}
        className="w-full max-w-[95%]"
      >
        {articles.map((article, idx) => {
          const isActive = idx === activeIndex;
          const total = articles.length;
          const isPrev = idx === (activeIndex - 1 + total) % total;
          const isNext = idx === (activeIndex + 1) % total;

          const baseClasses =
            "bg-white h-[78vh] max-w-[360px] mx-auto flex items-center justify-center transition-all duration-300";
          const boxShadowStyle = {
            boxShadow: "0px 0px 20px 0px #0000004D",
            borderRadius: "20px",
          };
          const activeClasses = "opacity-100 pointer-events-auto scale-100";
          const inactiveClasses = "opacity-40 pointer-events-none scale-90";

          const finalClass = isActive
            ? `${baseClasses} ${activeClasses}`
            : isPrev || isNext
              ? `${baseClasses} ${inactiveClasses}`
              : "hidden sm:flex";

          return (
            <SwiperSlide key={article._id}>
              <div style={boxShadowStyle} className={finalClass}>
                <ContentBarchasbStatus
                  isActive={isActive}
                  title={article.title || "بدون عنوان"}
                  description={article.summary || "مطلبی وجود ندارد"}
                  imageUrl={article.mainImageUrl}
                  slug={article.slugArticle}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
