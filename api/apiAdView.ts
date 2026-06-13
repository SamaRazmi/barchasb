const BASE_URL = "https://barchasb-server.liara.run/api";

const getToken = (): string => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("token") || "";
    if (token.startsWith("Bearer ")) token = token.slice(7);
    console.log("📦 توکن خالص:", token ? "دارد" : "ندارد");
    return token;
  }
  return "";
};

const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log("🚀 ارسال درخواست به:", url);
  console.log(
    "🔐 هدر Authorization:",
    token ? `Bearer ${token.substring(0, 20)}...` : "بدون توکن",
  );
  const res = await fetch(url, { ...options, headers, credentials: "include" });
  console.log("📡 وضعیت پاسخ:", res.status);

  // دریافت متن پاسخ خام
  const textResponse = await res.text();
  console.log("📄 پاسخ خام از سرور:", textResponse);

  if (!res.ok) {
    let errorMessage = "";
    try {
      const errorJson = JSON.parse(textResponse);
      errorMessage = errorJson?.error || JSON.stringify(errorJson);
    } catch {
      errorMessage = textResponse;
    }
    if (res.status === 401)
      throw new Error("Unauthorized: توکن نامعتبر یا منقضی شده");
    throw new Error(errorMessage || "درخواست ناموفق");
  }

  // اگر پاسخ JSON معتبر است، آن را برگردانید
  try {
    const jsonData = JSON.parse(textResponse);
    console.log("✅ داده‌های JSON دریافتی:", jsonData);
    return jsonData;
  } catch (e) {
    console.warn("⚠️ پاسخ JSON معتبر نیست:", textResponse);
    return textResponse;
  }
};

export const trackAdView = async (adId: string, adType: string) => {
  const res = await fetch(`${BASE_URL}/track-view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adId, adType }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Failed to track view");
  }
  return res.json();
};

export const getUserViewStats = async (
  period: "weekly" | "monthly" = "weekly",
  adType: string = "all",
) => {
  return fetchWithToken(
    `${BASE_URL}/user-views?period=${period}&adType=${adType}`,
  );
};
export const getAdViewStats = async (
  adId: string,
  adType: string,
  period: "weekly" | "monthly" = "weekly",
) => {
  return fetchWithToken(
    `${BASE_URL}/ad-views/${adId}?adType=${adType}&period=${period}`,
  );
};
export const getAdViewSummaryStats = async (adId: string, adType: string) => {
  return fetchWithToken(`${BASE_URL}/ad-view-summary/${adId}?adType=${adType}`);
};
