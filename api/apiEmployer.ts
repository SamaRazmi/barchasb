// /api/apiEmployer.ts

const BASE_URL = "https://barchasb-server-admin.liara.run";

/**
 * دریافت آگهی‌های کارفرما با فیلترهای سمت سرور
 * @param filters فیلترهای انتخاب‌شده در فرانت‌اند (منطبق با کامپوننت Karfarma)
 */
export async function fetchEmployerAds(filters: {
  searchText?: string | null;
  selectedCategory?: string[];
  selectedTypeWork?: string[]; // تغییر: آرایه‌ای از رشته‌ها (چندتا قابل انتخاب)
  selectedCities?: string[];
  selectedTime?: string | null;
}) {
  const params = new URLSearchParams();

  // 1. جستجوی متن (q)
  if (filters.searchText) {
    params.append("q", filters.searchText);
  }

  // 2. دسته‌بندی شغلی (jobCategory) - چندتایی با کاما
  if (filters.selectedCategory && filters.selectedCategory.length > 0) {
    params.append("jobCategory", filters.selectedCategory.join(","));
  }

  // 3. نوع همکاری (cooperationType) - چندتایی با کاما (پشتیبانی از همه ترکیب‌ها)
  if (filters.selectedTypeWork && filters.selectedTypeWork.length > 0) {
    const typeMap: Record<string, string> = {
      "تمام وقت": "full_time",
      "پاره وقت": "part_time",
      دورکاری: "remote",
      کارآموزی: "internship",
      // "پروژه": "project",   // در صورت نیاز
    };
    // تبدیل هر گزینه فارسی به مقدار انگلیسی و حذف موارد نامعتبر
    const englishTypes = filters.selectedTypeWork
      .map((label) => typeMap[label])
      .filter(Boolean); // رشته‌های معتبر را نگه می‌دارد

    if (englishTypes.length > 0) {
      params.append("cooperationType", englishTypes.join(","));
    }
    // توجه: پارامتر isRemote اینجا استفاده نمی‌شود چون فیلتر جداگانه‌ای است.
    // اگر بعداً نیاز به «فقط دورکاری» داشتید، یک فیلتر جدا به اسم isRemote: boolean اضافه کنید.
  }

  // 4. فیلتر زمانی (timeFilter)
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

  // 5. شهر (city) - چندتایی با کاما
  if (filters.selectedCities && filters.selectedCities.length > 0) {
    params.append("city", filters.selectedCities.join(","));
  }

  const url = `${BASE_URL}/public/ads/employer?${params.toString()}`;
  console.log("🔍 درخواست ارسال شد به:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // فقط آگهی‌های تأییدشده برگردانده شوند
    return (data || []).filter((item: any) => item.adStatus === "approved");
  } catch (error) {
    console.error("❌ خطا در دریافت آگهی‌های کارفرما:", error);
    return [];
  }
}
