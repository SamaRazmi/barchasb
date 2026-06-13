"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContentBarchasbStatusProps {
  isActive?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
  slug?: string; // این slug در واقع همان _id مقاله است
}

function stripHtml(html: string): string {
  if (!html) return "";
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  return html.replace(/<[^>]*>/g, "");
}

export default function ContentBarchasbStatus({
  isActive = true,
  title = "برچسب در راه است...",
  description = "افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، لورم ایپسوم متن ساخت الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد ...",
  imageUrl,
  slug,
}: ContentBarchasbStatusProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const cleanDescription = stripHtml(description);
  const finalImageUrl =
    imageUrl && imageUrl.trim() !== ""
      ? imageUrl
      : "/images/comingsoon_barchasb.svg";

  const handleMoreInfo = async () => {
    // اگر slug مستقیماً وجود داشت
    if (slug) {
      console.group("🔍 کلیک روی دکمه «بیشتر بدانید» - با شناسه مستقیم");
      // console.log(`📌 عنوان مقاله: ${title}`);
      // console.log(`📌 مقدار slug (شناسه مقاله): ${slug}`);
      // console.log(`🌐 آدرس مقصد: /article/${slug}`);
      console.groupEnd();
      router.push(`/article/${slug}`);
      return;
    }

    // در غیر این صورت، با استفاده از عنوان مقاله، شناسه را پیدا کن
    console.warn(
      `⚠️ مقاله "${title}" بدون slug دریافت شد. در حال جستجوی شناسه...`,
    );
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://barchasb-server-admin.liara.run/public/articles/summary",
      );
      if (!res.ok) throw new Error("خطا در دریافت خلاصه مقالات");
      const articles: Array<{ _id: string; title: string }> = await res.json();
      const found = articles.find((art) => art.title === title);
      if (found) {
        console.log(`✅ شناسه مقاله برای "${title}" پیدا شد: ${found._id}`);
        router.push(`/article/${found._id}`);
      } else {
        console.error(`❌ هیچ مقاله‌ای با عنوان "${title}" یافت نشد.`);
        alert(`متأسفانه مقاله "${title}" یافت نشد.`);
      }
    } catch (err) {
      console.error("خطا در جستجوی شناسه مقاله:", err);
      alert("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[74vh] w-full">
      <div className="px-5 pt-5">
        <div className="overflow-hidden rounded-[10px]">
          <img
            src={finalImageUrl}
            alt={title}
            className="w-full h-[40vh] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/comingsoon_barchasb.svg";
            }}
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 px-5 mt-4 relative">
        <div className="mb-4">
          <h2 className="font-bold text-[1.8vh] md:text-[2.2vh] text-[#143A62] sm:mr-[1.5vh]">
            {title}
          </h2>
          <p
            className={`mt-4 font-semibold text-[1.5vh] text-[#143A62] opacity-80 text-justify overflow-hidden`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: isActive ? 4 : 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {cleanDescription}
          </p>
        </div>

        <div className="absolute left-0 right-0 bottom-5 px-5">
          <button
            className={`w-full bg-[#143A62] rounded-[10px] flex items-center justify-between px-5 py-2 transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handleMoreInfo}
            disabled={isLoading}
          >
            <span className="text-white font-medium text-[20px]">
              {isLoading ? "در حال پیدا کردن..." : "بیشتر بدانید"}
            </span>
            <Image
              src="/images/more_arrow_card.svg"
              alt="Arrow"
              width={5}
              height={13}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
