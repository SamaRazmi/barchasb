// /api/apiJobSeeker.ts

const BASE_URL = "https://barchasb-server-admin.liara.run";

export interface JobSeekerFilters {
  searchText?: string;
  selectedTime?: string[]; // آرایه‌ای از رشته‌های "امروز", "این هفته", "این ماه", "امسال"
  selectedCities?: string[]; // آرایه‌ای از نام شهرها
  selectedStates?: string[]; // (جدید) آرایه‌ای از نام استان‌ها
  hasWorkExperience?: boolean; // (جدید) سابقه کاری (true/false)
  // فیلترهای اضافی
  jobCategory?: string[];
  minAge?: number;
  maxAge?: number;
  gender?: "male" | "female";
  maritalStatus?: "single" | "married";
}

/**
 * دریافت آگهی‌های کارجو با فیلترهای سمت سرور (مطابق با مستندات API)
 * @param filters فیلترهای انتخاب‌شده در فرانت‌اند
 */
export async function fetchJobSeekerAds(filters: JobSeekerFilters) {
  const params = new URLSearchParams();

  // 1. جستجوی متن (q)
  if (filters.searchText) {
    params.append("q", filters.searchText);
  }

  // 2. فیلتر زمانی (timeFilter)
  if (filters.selectedTime && filters.selectedTime.length > 0) {
    const timeMap: Record<string, string> = {
      امروز: "today",
      "این هفته": "thisWeek",
      "این ماه": "thisMonth",
      امسال: "thisYear",
    };
    // معمولاً کاربر فقط یک گزینه انتخاب می‌کند --> آخرین مقدار
    const lastTime = filters.selectedTime[filters.selectedTime.length - 1];
    const mappedTime = timeMap[lastTime];
    if (mappedTime) params.append("timeFilter", mappedTime);
  }

  // 3. شهر (city) - چندتایی با کاما
  if (filters.selectedCities && filters.selectedCities.length > 0) {
    params.append("city", filters.selectedCities.join(","));
  }

  // 4. استان (state) - جدید
  if (filters.selectedStates && filters.selectedStates.length > 0) {
    params.append("state", filters.selectedStates.join(","));
  }

  // 5. سابقه کاری (hasWorkExperience) - جدید
  if (filters.hasWorkExperience !== undefined) {
    params.append(
      "hasWorkExperience",
      filters.hasWorkExperience ? "true" : "false",
    );
  }

  // 6. دسته‌بندی شغلی (jobCategory)
  if (filters.jobCategory && filters.jobCategory.length > 0) {
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
  if (filters.gender) {
    params.append("gender", filters.gender);
  }

  // 9. وضعیت تأهل
  if (filters.maritalStatus) {
    params.append("maritalStatus", filters.maritalStatus);
  }

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

    const data = await response.json();
    // در صورت نیاز، فقط آگهی‌های تأییدشده برگردانده شوند (معمولاً سمت سرور همین کار را می‌کند)
    return (data || []).filter((item: any) => item.adStatus === "approved");
  } catch (error) {
    console.error("❌ خطا در دریافت آگهی‌های کارجو:", error);
    return [];
  }
}
