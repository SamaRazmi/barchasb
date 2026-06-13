// src/services/authorizeService.ts

// توکن را از localStorage می‌گیرد (بدون عبارت "Bearer ")
const getRawToken = (): string => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("token") || "";
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    return token;
  }
  return "";
};

export type AuthorizeRequest = {
  actions: ("CREATE_AD" | "SPECIAL_AD" | "LADDER")[];
  adType: string;
  categoryId: string;
  meta: {
    adId?: string;
    source: string;
    package: "premium-bundle" | "free";
  };
};

export type AuthorizeError = {
  action: string;
  reason: string;
};

const AUTHORIZE_URL =
  "https://barchasb-server-admin.liara.run/orchestrator/authorize";

export async function checkAuthorization(
  req: AuthorizeRequest,
): Promise<{ success: true } | { success: false; error: AuthorizeError }> {
  const token = getRawToken();

  const response = await fetch(AUTHORIZE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });

  // خواندن بدنه پاسخ (حتی در صورت خطا)
  let responseBody: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }

  // موفقیت
  if (response.status === 201) {
    return { success: true };
  }

  // محدودیت ویژه یا نردبان
  if (response.status === 409) {
    return { success: false, error: responseBody as AuthorizeError };
  }

  // سایر خطاها (400، 401، 403، 500 و ...) – پیام کامل سرور را در خطا قرار بده
  const errorMessage =
    typeof responseBody === "object"
      ? JSON.stringify(responseBody)
      : responseBody || "بدون توضیحات اضافی";

  throw new Error(
    `Authorization failed with status ${response.status}: ${errorMessage}`,
  );
}
