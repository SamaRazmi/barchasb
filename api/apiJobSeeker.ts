const BASE_URL = process.env.NEXT_PUBLIC_Admin_URL;

export interface JobSeekerFilters {
  searchText?: string;
  selectedTime?: string[]; // ["امروز", "این هفته", ...]
  selectedCities?: string[];
  selectedStates?: string[];
  hasWorkExperience?: boolean;
  jobCategory?: string[];
  minAge?: number;
  maxAge?: number;
  gender?: "male" | "female";
  maritalStatus?: "single" | "married";
  page?: number;
  limit?: number;
}

export async function fetchJobSeekerAds(filters: JobSeekerFilters = {}) {
  const params = new URLSearchParams();

  // 1. متن جستجو
  if (filters.searchText) params.append("q", filters.searchText);

  // 2. فیلتر زمانی
  if (filters.selectedTime && filters.selectedTime.length > 0) {
    const timeMap: Record<string, string> = {
      امروز: "today",
      "این هفته": "thisWeek",
      "این ماه": "thisMonth",
      امسال: "thisYear",
    };
    const lastTime = filters.selectedTime[filters.selectedTime.length - 1];
    const mappedTime = timeMap[lastTime];
    if (mappedTime) params.append("timeFilter", mappedTime);
  }

  // 3. شهرها
  if (filters.selectedCities?.length) {
    params.append("city", filters.selectedCities.join(","));
  }

  // 4. استان‌ها
  if (filters.selectedStates?.length) {
    params.append("state", filters.selectedStates.join(","));
  }

  // 5. سابقه کار
  if (filters.hasWorkExperience !== undefined) {
    params.append(
      "hasWorkExperience",
      filters.hasWorkExperience ? "true" : "false",
    );
  }

  // 6. دسته شغلی
  if (filters.jobCategory?.length) {
    params.append("jobCategory", filters.jobCategory.join(","));
  }

  // 7. محدوده سنی
  if (filters.minAge !== undefined && !isNaN(filters.minAge)) {
    params.append("minAge", filters.minAge.toString());
  }
  if (filters.maxAge !== undefined && !isNaN(filters.maxAge)) {
    params.append("maxAge", filters.maxAge.toString());
  }

  // 8. جنسیت
  if (filters.gender) params.append("gender", filters.gender);

  // 9. وضعیت تأهل
  if (filters.maritalStatus)
    params.append("maritalStatus", filters.maritalStatus);

  // 10. صفحه‌بندی
  params.append("page", (filters.page ?? 1).toString());
  params.append("limit", (filters.limit ?? 12).toString());

  const url = `${BASE_URL}/public/ads/job-seeker?${params.toString()}`;
  console.log("🔍 درخواست آگهی‌های کارجو:", url);

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
    console.error("❌ خطا در دریافت آگهی‌های کارجو:", error);
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }
}
