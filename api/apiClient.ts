// apiClient.ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://barchasb-server.liara.run/api";

export const get = async <T>(
  endpoint: string,
  withCredentials = true,
): Promise<T> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      credentials: withCredentials ? "include" : "omit",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API GET error:", err);
    throw err;
  }
};

// api/apiClient.tsx
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// دریافت استان‌ها
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/provinces`);
      return res.data;
    },
  });
};

// دریافت شهرها بر اساس استان
export const useCities = (provinceName: string | undefined) => {
  return useQuery({
    queryKey: ["cities", provinceName],
    queryFn: async () => {
      if (!provinceName) return [];
      const res = await axios.get(`${BASE_URL}/cities/${provinceName}`);
      return res.data; // آرایه شهرها
    },
    enabled: !!provinceName, // فقط وقتی provinceName موجود باشه فعال بشه
  });
};
