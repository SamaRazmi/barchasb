// Client-side function to call GET /public/ads/seller - works in Next.js frontend (no 'use client' needed in this file)

const BASE_URL = "https://barchasb-server-admin.liara.run";

export type TimeFilter = "today" | "thisWeek" | "thisMonth" | "thisYear";

export interface GetSellerAdsParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  timeFilter?: TimeFilter;
  state?: string | string[];
  city?: string | string[];
}

export interface SellerAd {
  _id: string;
  type: "seller";
  title: string;
  category: string;
  priceIRT: number;
  state: string;
  city: string;
  images: string[];
  adStatus: "approved";
  createdAt: string;
  owner: string;
}

/**
 * Fetch approved seller ads with advanced filters.
 * All filters are optional.
 */
export async function getSellerAds(
  params: GetSellerAdsParams = {},
): Promise<SellerAd[]> {
  console.group("🔍 [getSellerAds] شروع درخواست");
  console.log("1️⃣ پارامترهای ورودی (params):", JSON.stringify(params, null, 2));

  const queryParams = new URLSearchParams();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") {
      console.log(`   ⏭️ رد شد: ${key} =`, value);
      return;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        console.log(`   ⏭️ رد شد (آرایه خالی): ${key} = []`);
        return;
      }
      const joined = value.join(",");
      console.log(`   ✅ افزودن پارامتر آرایه‌ای: ${key} = ${joined}`);
      queryParams.append(key, joined);
    } else {
      console.log(`   ✅ افزودن پارامتر: ${key} = ${String(value)}`);
      queryParams.append(key, String(value));
    }
  };

  append("q", params.q);
  append("category", params.category);
  append("minPrice", params.minPrice);
  append("maxPrice", params.maxPrice);
  append("timeFilter", params.timeFilter);
  append("state", params.state);
  append("city", params.city);

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/public/ads/seller${queryString ? `?${queryString}` : ""}`;
  console.log("2️⃣ آدرس نهایی (URL):", url);
  console.log("3️⃣ متد درخواست: GET");
  console.log("4️⃣ هدرهای ارسالی: { Accept: 'application/json' }");

  console.time("⏱️ زمان درخواست");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  console.timeEnd("⏱️ زمان درخواست");

  console.log("5️⃣ وضعیت پاسخ (status):", response.status, response.statusText);
  console.log("6️⃣ هدرهای پاسخ (مهم):", {
    "content-type": response.headers.get("content-type"),
    "content-length": response.headers.get("content-length"),
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      console.error("❌ بدنه خطا (error body):", errorBody);
    } catch {
      console.error("❌ Unable to parse error body as JSON");
    }
    console.groupEnd();
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log(
    "7️⃣ نوع داده برگشتی:",
    Array.isArray(data) ? "آرایه" : typeof data,
  );
  console.log(
    "8️⃣ نمونه خروجی (حداکثر 3 آیتم اول):",
    Array.isArray(data) ? data.slice(0, 3) : data,
  );
  console.log(
    `9️⃣ تعداد کل آیتم‌ها: ${Array.isArray(data) ? data.length : "N/A"}`,
  );

  console.groupEnd();
  return data;
}
