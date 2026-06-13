"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// ========== تعریف تابع searchAds و نوع AdItem در همین فایل ==========
const BASE_URL = "https://barchasb-server-admin.liara.run";

interface AdItem {
  _id: string;
  type: string;
  title: string;
  category: string;
  state: string;
  city: string;
  images: { url: string; isMain?: boolean }[];
  adStatus: string;
  createdAt: string;
  owner: string;
  priceIRT?: number;
}

const searchAds = async (filters: { q?: string }): Promise<AdItem[]> => {
  const params = new URLSearchParams();
  if (filters.q) params.append("q", filters.q);
  const url = `${BASE_URL}/public/ads?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search error! status: ${res.status}`);
  const data = await res.json();
  return data as AdItem[];
};
// ================================================================

// کامپوننت موقت برای کارت آگهی (می‌توانید بعداً KioskContent را جایگزین کنید)
const SimpleAdCard = ({ title, city, price, imageSrc }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={imageSrc || "/images/kioskimg_card.svg"}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-3 text-right">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{city}</p>
        {price && <p className="text-blue-600 font-bold mt-1">{price} تومان</p>}
      </div>
    </div>
  );
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchAds({ q: q.trim() });
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت نتایج");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!q) {
    return (
      <div className="p-8 text-center text-gray-500">
        عبارت جستجو را وارد کنید
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-lg font-medium">نتیجه‌ای یافت نشد</p>
        <p className="text-sm text-gray-500 mt-2">برای عبارت "{q}"</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">
        نتایج جستجو برای: {q}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((item) => (
          <SimpleAdCard
            key={item._id}
            title={item.title}
            city={item.city}
            price={item.priceIRT ? item.priceIRT.toLocaleString() : ""}
            imageSrc={
              item.images?.find((img) => img.isMain)?.url ||
              item.images?.[0]?.url ||
              "/images/kioskimg_card.svg"
            }
          />
        ))}
      </div>
    </div>
  );
}
