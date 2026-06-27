export interface SuggestionItem {
  id: string;
  title: string;
  name?: string;
  adType: "EmployerAd" | "JobSeekerAd" | "SellerAd" | "DigitalAd";
  rating?: number;
  skills?: string[];
  image?: string;
  createdAt: string;
}

export interface SuggestionResponse {
  suggestions: SuggestionItem[];
  used: number;
  remaining: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchSuggestions(
  search: string,
  count: number,
  adTypes?: string, // پارامتر جدید برای فیلتر نوع آگهی
): Promise<SuggestionResponse> {
  const params = new URLSearchParams({
    search,
    count: count.toString(),
  });
  if (adTypes) {
    params.append("adTypes", adTypes);
  }

  const response = await fetch(`${BASE_URL}/suggestions?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "خطا در دریافت پیشنهادات");
  }

  return response.json();
}

export async function getSuggestionStats(): Promise<{
  used: number;
  remaining: number;
  total: number;
}> {
  const response = await fetch(`${BASE_URL}/suggestion-stats`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("خطا در دریافت آمار");
  return response.json();
}

export async function getSuggestionPreference() {
  const response = await fetch(`${BASE_URL}/suggestion-preference`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("خطا در دریافت تنظیمات");
  return response.json();
}

export async function updateSuggestionPreference(data: any) {
  const response = await fetch(`${BASE_URL}/suggestion-preference`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("خطا در به‌روزرسانی تنظیمات");
  return response.json();
}
