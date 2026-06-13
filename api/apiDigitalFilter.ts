// /api/apiDigitalFilter.ts

const BASE_URL = "https://barchasb-server-admin.liara.run";

export interface DigitalFilters {
  q?: string; // کلمه کلیدی در عنوان/توضیحات
  minBudget?: number; // حداقل بودجه (تومان)
  maxBudget?: number; // حداکثر بودجه (تومان)
  timeFilter?: string; // today, thisWeek, thisMonth, thisYear
  state?: string; // نام استان (تک یا چندتایی با کاما)
  city?: string; // نام شهر (تک یا چندتایی با کاما)
  category?: string; // دسته‌بندی (اختیاری)
}

/**
 * دریافت آگهی‌های دیجیتال با فیلترهای سمت سرور
 * @param filters فیلترهای انتخاب‌شده در فرانت‌اند
 * @returns لیست آگهی‌های تأییدشده
 */
export async function fetchDigitalAds(filters: DigitalFilters) {
  const params = new URLSearchParams();

  if (filters.q) params.append("q", filters.q);
  if (filters.minBudget !== undefined && !isNaN(filters.minBudget))
    params.append("minBudget", filters.minBudget.toString());
  if (filters.maxBudget !== undefined && !isNaN(filters.maxBudget))
    params.append("maxBudget", filters.maxBudget.toString());
  if (filters.timeFilter) params.append("timeFilter", filters.timeFilter);
  if (filters.state) params.append("state", filters.state);
  if (filters.city) params.append("city", filters.city);
  if (filters.category) params.append("category", filters.category);

  const url = `${BASE_URL}/public/ads/digital?${params.toString()}`;
  console.log("🔍 درخواست آگهی‌های دیجیتال:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log("📦 داده خام دیجیتال از سرور:", data);
    return (data || []).filter((item: any) => item.adStatus === "approved");
    // فقط آگهی‌های تأییدشده برگردانده شوند (سرور معمولاً همین کار را می‌کند)
    return (data || []).filter((item: any) => item.adStatus === "approved");
  } catch (error) {
    console.error("❌ خطا در دریافت آگهی‌های دیجیتال:", error);
    return [];
  }
}
