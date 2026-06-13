export interface Plan {
  _id: string;
  planType: "basic" | "silver" | "gold";
  durationMonths: 1 | 3 | 6;
  price: number;

  limits: {
    maxAds?: number;
    specialAds?: number;
    ladder?: number;
    tests?: number;
    digitalAds?: number;
    specialDisplay?: number;
  };

  isActive: boolean;
}

// ---------- Subscription related interfaces ----------
export interface SubscriptionUsage {
  maxAdsUsed: number;
  specialAdsUsed: number;
  ladderUsed: number;
  digitalAdsUsed: number;
  testsUsed: number;
  specialDisplayUsed: number;
  _id?: string;
}

export interface PlanSnapshot {
  limits: {
    maxAds: number;
    ladder: number;
    digitalAds: number;
    tests: number;
    specialDisplay: number;
    specialAds: number;
  };
  planType: string;
  durationMonths: number;
  price: number;
  _id: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  planSnapshot: PlanSnapshot;
  startDate: string;
  endDate: string;
  usage: SubscriptionUsage;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ---------------- TOKEN HELPERS ----------------
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// ---------------- FETCH WITH TOKEN ----------------
const fetchWithToken = async (url: string, options: any = {}) => {
  let token = getToken();

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = res.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    return Promise.reject({
      message: data?.message || data?.error || "خطا در ارتباط با سرور",
    });
  }

  return data;
};

// ---------------- GET PLANS ----------------
export const getPlans = async (): Promise<Plan[]> => {
  const response = await fetch(
    "https://barchasb-server-admin.liara.run/plans",
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت پلن‌ها");
  }

  return response.json();
};

// ---------------- BUY SUBSCRIPTION ----------------
export const buySubscription = async (planId: string) => {
  return fetchWithToken(
    `https://barchasb-server-admin.liara.run/subscriptions/buy/${planId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

// ---------------- GET CURRENT USER'S SUBSCRIPTION ----------------
export const getMySubscription = async (): Promise<Subscription> => {
  return fetchWithToken(
    "https://barchasb-server-admin.liara.run/subscriptions/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
