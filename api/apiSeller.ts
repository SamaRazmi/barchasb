const BASE_URL = process.env.NEXT_PUBLIC_Admin_URL;

export type TimeFilter = "today" | "thisWeek" | "thisMonth" | "thisYear";

export interface GetSellerAdsParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  timeFilter?: TimeFilter;
  state?: string | string[];
  city?: string | string[];
  page?: number;
  limit?: number;
}

export interface SellerAd {
  _id: string;
  type: "seller";
  title: string;
  category: string;
  priceIRT: number;
  state: string;
  city: string;
  images: {
    url: string;
    isMain: boolean;
    _id: string;
  }[];
  adStatus?: "approved" | "pending" | "rejected";
  createdAt: string;
  owner: string;
}

export interface SellerAdsResponse {
  data: SellerAd[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getSellerAds(
  params: GetSellerAdsParams = {},
): Promise<SellerAdsResponse> {
  const queryParams = new URLSearchParams();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      if (!value.length) return;
      queryParams.append(key, value.join(","));
    } else {
      queryParams.append(key, String(value));
    }
  };

  append("q", params.q);
  append("category", params.category);
  append("minPrice", params.minPrice);
  append("maxPrice", params.maxPrice);
  append("timeFilter", params.timeFilter);
  append("state", params.state);
  append("city", params.city);

  append("page", params.page ?? 1);
  append("limit", params.limit ?? 12);

  const url = `${BASE_URL}/public/ads/seller?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const err = await response.json();
      errorMessage = err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const result = await response.json();

  const rawData: SellerAd[] = Array.isArray(result)
    ? result
    : (result.data ?? []);

  const safeData = rawData.filter((item) => {
    if ("adStatus" in item && item.adStatus) {
      return item.adStatus === "approved";
    }
    return true;
  });

  return {
    data: safeData,
    total: result.total ?? safeData.length,
    page: result.page ?? params.page ?? 1,
    totalPages: result.totalPages ?? 1,
  };
}
