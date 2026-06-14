// src/api/authorizeService.ts

const getRawToken = (): string => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("token") || "";
    if (token.startsWith("Bearer ")) token = token.slice(7);
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

// ⭐ نوع موفقیت – حتماً شامل reservationId باشد
export type AuthorizeSuccess = {
  success: true;
  reservationId: string;
  status: string;
  expiresAt: string;
  decisions: any[];
};

const AUTHORIZE_URL =
  "https://barchasb-server-admin.liara.run/orchestrator/authorize";

export async function checkAuthorization(
  req: AuthorizeRequest,
): Promise<AuthorizeSuccess | { success: false; error: AuthorizeError }> {
  const token = getRawToken();
  const response = await fetch(AUTHORIZE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });

  let responseBody: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }

  if (response.status === 201) {
    // پاسخ موفق: شامل reservationId و بقیه موارد است
    return { success: true, ...responseBody };
  }

  if (response.status === 409) {
    return { success: false, error: responseBody as AuthorizeError };
  }

  const errorMessage =
    typeof responseBody === "object"
      ? JSON.stringify(responseBody)
      : responseBody || "بدون توضیحات";
  throw new Error(
    `Authorization failed with status ${response.status}: ${errorMessage}`,
  );
}

// ==================== چسباندن آگهی به رزرو ====================
const ATTACH_AD_URL =
  "https://barchasb-server-admin.liara.run/ad-action-reservation/attach-ad";

export async function attachAdToReservation(
  reservationId: string,
  adId: string,
): Promise<any> {
  const token = getRawToken();
  const response = await fetch(ATTACH_AD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reservationId, adId }),
  });

  let responseBody: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    responseBody = await response.json();
  } else {
    responseBody = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      typeof responseBody === "object"
        ? JSON.stringify(responseBody)
        : responseBody || "بدون توضیحات";
    throw new Error(
      `Attach failed with status ${response.status}: ${errorMessage}`,
    );
  }
  return responseBody;
}
