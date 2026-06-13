const API_BASE = "https://barchasb-server.liara.run/api";

export interface Category {
  _id: string;
  name: string;
}

// interface جداگانه برای زیردسته‌ها (مهارت‌ها) که ممکن است parent هم داشته باشند
export interface SubCategory extends Category {
  parent?: string; // اختیاری
}

// interface برای آگهی شغلی (نمونه ساده)
export interface Job {
  _id: string;
  title: string;
  subCategory: string | SubCategory;
  // ... سایر فیلدها
}

export const fetchMainCategories = async (): Promise<{
  categories: Category[];
}> => {
  const res = await fetch(`${API_BASE}/job-categories/main`);
  if (!res.ok) throw new Error("Failed to fetch main categories");
  return res.json();
};

export const fetchSubCategories = async (
  parentId: string,
): Promise<{ categories: Category[] }> => {
  const res = await fetch(
    `${API_BASE}/job-categories/sub?parentId=${parentId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch sub categories");
  return res.json();
};

// تابع جدید: دریافت همه زیردسته‌ها (مهارت‌ها) بدون نیاز به parentId
export const fetchAllSubCategories = async (): Promise<{
  categories: SubCategory[];
}> => {
  const res = await fetch(`${API_BASE}/job-categories/sub/all`);
  if (!res.ok) throw new Error("Failed to fetch all sub categories");
  return res.json();
};

// تابع جدید: دریافت آگهی‌های شغلی بر اساس دسته اصلی (فیلتر سمت سرور)
export const fetchJobsByMainCategory = async (
  mainCategoryId: string,
): Promise<{ status: string; jobs: Job[] }> => {
  const res = await fetch(
    `${API_BASE}/job-categories/main/${mainCategoryId}/jobs`,
  );
  if (!res.ok) throw new Error("Failed to fetch jobs by main category");
  return res.json();
};
