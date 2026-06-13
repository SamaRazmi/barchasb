const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://barchasb-server.liara.run/api";

// 🔐 گرفتن توکن
const getToken = (): string => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("token") || "";
    if (token.startsWith("Bearer ")) token = token.slice(7);

    console.log("📦 توکن خالص:", token ? "دارد" : "ندارد");
    return token;
  }
  return "";
};

// 🚀 fetch عمومی با لاگ کامل
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

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  console.log("📡 وضعیت پاسخ:", res.status);

  const textResponse = await res.text();
  console.log("📄 پاسخ خام از سرور:", textResponse);

  if (!res.ok) {
    let errorMessage = "";

    try {
      const errorJson = JSON.parse(textResponse);
      errorMessage =
        errorJson?.message || errorJson?.error || JSON.stringify(errorJson);
    } catch {
      errorMessage = textResponse;
    }

    if (res.status === 401) {
      throw new Error("Unauthorized: توکن نامعتبر یا منقضی شده");
    }

    throw new Error(errorMessage || "درخواست ناموفق");
  }

  try {
    const jsonData = JSON.parse(textResponse);
    console.log("✅ داده‌های JSON دریافتی:", jsonData);
    return jsonData;
  } catch {
    console.warn("⚠️ پاسخ JSON معتبر نیست:", textResponse);
    return textResponse;
  }
};

//
// 📱 DEVICE APIs
//

// 📌 گرفتن لیست دستگاه‌ها
export const getDevices = async () => {
  return fetchWithToken(`${BASE_URL}/sessions`, {
    method: "GET",
  });
};

// ❌ حذف یک دستگاه (logout از یک session)
export const deleteDevice = async (sessionId: string) => {
  return fetchWithToken(`${BASE_URL}/sessions/${sessionId}`, {
    method: "DELETE",
  });
};

// 🚪 خروج از همه دستگاه‌ها
export const logoutAllDevices = async () => {
  return fetchWithToken(`${BASE_URL}/sessions/logout-all`, {
    method: "POST",
  });
};
