const BASE_URL =
  process.env.NEXT_PUBLIC_Admin_URL ||
  "https://barchasb-server-admin.liara.run";

/**
 * دریافت توکن خالص از localStorage (حذف "Bearer " در صورت وجود)
 */
const getToken = (): string => {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem("token") || "";
  if (token.startsWith("Bearer ")) token = token.slice(7);
  return token;
};

/**
 * درخواست fetch با هدر Authorization خودکار و غیرفعال کردن کش
 */
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 🔧 غیرفعال کردن کش مرورگر با cache: 'no-store'
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store", // جلوگیری از کش شدن پاسخ GET
  });

  // دریافت پاسخ خام برای خطایابی
  const textResponse = await res.text();

  if (!res.ok) {
    let errorMessage = "";
    try {
      const errorJson = JSON.parse(textResponse);
      errorMessage = errorJson?.error || JSON.stringify(errorJson);
    } catch {
      errorMessage = textResponse;
    }
    if (res.status === 401) {
      throw new Error(
        "Unauthorized: توکن نامعتبر یا منقضی شده. لطفاً دوباره وارد شوید.",
      );
    }
    throw new Error(errorMessage || "درخواست ناموفق");
  }

  // پارس JSON
  try {
    return JSON.parse(textResponse);
  } catch {
    return textResponse;
  }
};

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

/**
 * دریافت تمام نوتیفیکیشن‌های in-app کاربر جاری (بدون کش)
 */
export async function fetchInAppNotifications(): Promise<InAppNotification[]> {
  const data = await fetchWithToken(`${BASE_URL}/user/notifications/in-app`);
  return data.items || [];
}

/**
 * علامت‌گذاری یک نوتیفیکیشن به عنوان خوانده شده (PATCH)
 * @param id شناسه نوتیفیکیشن
 * @returns پیام موفقیت
 */
export async function markNotificationAsRead(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const url = `${BASE_URL}/user/notifications/in-app/${id}/read`;
  try {
    const data = await fetchWithToken(url, { method: "PATCH" });
    return data; // در صورت موفقیت واقعی (status 2xx) به اینجا می‌رسد
  } catch (error: any) {
    // فقط خطایی که نشان می‌دهد قبلاً خوانده شده را نادیده می‌گیریم
    if (error?.message?.includes("already read")) {
      console.warn(
        `Notification ${id} already read on server, treating as success.`,
      );
      return { success: true, message: "Notification already marked as read" };
    }
    // سایر خطاها (مثل 404، 500، قطعی شبکه) را propagate می‌کنیم
    throw error;
  }
}
