// api/apiWallet.ts

// ---------- Types for Wallet Transactions ----------
export interface WalletTransaction {
  id: string;
  type: "deposit" | "withdraw"; // بر اساس داکیومنت
  amount: number;
  status: "success" | "pending" | "failed";
  refId: string;
  description: string;
  persianCreatedAt: string;
  persianUpdatedAt: string;
}

export interface WalletTransactionsResponse {
  items: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Types for Subscription (موجود قبلی) ----------
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

// ---------------- GET WALLET BALANCE (جدید) ----------------
export const getWalletBalance = async (): Promise<{ balance: number }> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_Admin_URL}/wallet/balance`;
  return fetchWithToken(apiUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

// ---------------- GET WALLET TRANSACTIONS (جدید) ----------------
export const getWalletTransactions = async (
  page: number = 1,
  limit: number = 20,
): Promise<WalletTransactionsResponse> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_Admin_URL}/wallet/transactions?page=${page}&limit=${limit}`;
  return fetchWithToken(apiUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

// ---------------- GET PLANS (موجود) ----------------
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

// ---------------- BUY SUBSCRIPTION (موجود) ----------------
export const buySubscription = async (planId: string) => {
  return fetchWithToken(
    `https://barchasb-server-admin.liara.run/subscriptions/buy/${planId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  );
};

// ---------------- GET CURRENT USER'S SUBSCRIPTION (موجود) ----------------
export const getMySubscription = async (): Promise<Subscription> => {
  return fetchWithToken(
    "https://barchasb-server-admin.liara.run/subscriptions/me",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
};
