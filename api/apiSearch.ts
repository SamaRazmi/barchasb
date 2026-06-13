const BASE_URL = "https://barchasb-server-admin.liara.run";
export interface SearchFilters {
  q?: string;
  state?: string;
  type?: string;
}

export interface AdItem {
  _id: string;
  type: string;
  title: string;
  category: string;
  state: string;
  city: string;
  images: string[];
  adStatus: string;
  createdAt: string;
  owner: string;
}

export const searchAds = async (
  filters: SearchFilters = {},
): Promise<AdItem[]> => {
  const params = new URLSearchParams();
  if (filters.q) params.append("q", filters.q);
  if (filters.state) params.append("state", filters.state);
  if (filters.type) params.append("type", filters.type);

  // ✅ مسیر درست: /public/ads
  const url = `${BASE_URL}/public/ads?${params.toString()}`;

  console.log("🌐 Fetching URL:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("📡 Response Status:", res.status, res.statusText);

  if (!res.ok) {
    console.error(`❌ Search error! status: ${res.status}`);
    throw new Error(`Search error! status: ${res.status}`);
  }

  const data = await res.json();
  console.log("✅ Raw API Response:", data);

  // مستندات گفته خروجی مستقیم آرایه است
  return data as AdItem[];
};
