// src/services/apiAdsDetails.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/**
 * دریافت اطلاعات یک آگهی jobseeker بر اساس ID
 */
export const fetchJobSeekerAd = async (id: string) => {
  const response = await fetch(`${BASE_URL}/ads/jobseeker/${id}`);
  if (!response.ok) throw new Error(`خطا در دریافت آگهی: ${response.status}`);
  return response.json();
};

/**
 * دریافت اطلاعات یک آگهی employer بر اساس ID
 */
export const fetchEmployerAd = async (id: string) => {
  const response = await fetch(`${BASE_URL}/ads/employer/${id}`);
  if (!response.ok) throw new Error(`خطا در دریافت آگهی: ${response.status}`);
  return response.json();
};

/**
 * دریافت اطلاعات یک کاربر (برای گرفتن شماره تماس)
 */
export const fetchUserById = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/get-one-user/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error(`خطا در دریافت کاربر: ${response.status}`);
  const result = await response.json();
  return result.data;
};

/**
 * دریافت اطلاعات یک آگهی seller بر اساس ID
 */
export const fetchSellerAd = async (id: string) => {
  const response = await fetch(`${BASE_URL}/ads/seller/${id}`);
  if (!response.ok) throw new Error(`خطا در دریافت آگهی: ${response.status}`);
  return response.json();
};
