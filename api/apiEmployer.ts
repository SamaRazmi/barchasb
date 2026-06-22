const BASE_URL = process.env.NEXT_PUBLIC_Admin_URL;

export async function fetchEmployerAds(filters: {
  searchText?: string | null;
  selectedCategory?: string[];
  selectedTypeWork?: string[];
  selectedCities?: string[];
  selectedTime?: string | null;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();

  // 1. متن جستجو
  if (filters.searchText) params.append("q", filters.searchText);

  // 2. دسته بندی شغلی (چندتایی)
  if (filters.selectedCategory?.length) {
    params.append("jobCategory", filters.selectedCategory.join(","));
  }

  // 3. نوع همکاری (تبدیل فارسی به انگلیسی)
  if (filters.selectedTypeWork?.length) {
    const typeMap: Record<string, string> = {
      "تمام وقت": "full_time",
      "پاره وقت": "part_time",
      دورکاری: "remote",
      کارآموزی: "internship",
    };
    const englishTypes = filters.selectedTypeWork
      .map((label) => typeMap[label])
      .filter(Boolean);
    if (englishTypes.length) {
      params.append("cooperationType", englishTypes.join(","));
    }
  }

  // 4. فیلتر زمانی
  if (filters.selectedTime) {
    const timeMap: Record<string, string> = {
      امروز: "today",
      "این هفته": "thisWeek",
      "این ماه": "thisMonth",
      "سال اخیر": "thisYear",
    };
    const mappedTime = timeMap[filters.selectedTime];
    if (mappedTime) params.append("timeFilter", mappedTime);
  }

  // 5. شهرها
  if (filters.selectedCities?.length) {
    params.append("city", filters.selectedCities.join(","));
  }

  // 6. صفحه‌بندی
  params.append("page", (filters.page ?? 1).toString());
  params.append("limit", (filters.limit ?? 12).toString());

  const url = `${BASE_URL}/public/ads/employer?${params.toString()}`;
  console.log("🔍 درخواست آگهی‌های کارفرما:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // پاسخ استاندارد: { data: [], total, page, totalPages }
    let items: any[] = [];

    if (Array.isArray(result.data)) {
      items = result.data;
    } else if (Array.isArray(result)) {
      items = result;
    } else {
      items = [];
    }

    // فقط آگهی‌های تایید شده (approved) را برگردان
    const approvedItems = items.filter(
      (item: any) => item.adStatus === "approved",
    );

    return {
      data: approvedItems,
      total: result.total ?? approvedItems.length,
      page: result.page ?? filters.page ?? 1,
      totalPages:
        result.totalPages ??
        Math.ceil(
          (result.total ?? approvedItems.length) / (filters.limit ?? 12),
        ),
    };
  } catch (error) {
    console.error("❌ خطا در دریافت آگهی‌های کارفرما:", error);
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }
}
