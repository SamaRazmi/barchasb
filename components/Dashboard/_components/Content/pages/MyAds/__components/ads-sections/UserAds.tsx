"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export type AdType = "employer" | "seeker" | "ad";

export interface Ad {
  id: string;
  title: string;
  description: string;
}

interface UseUserAdsProps {
  active: AdType;
}

export const useUserAds = ({ active }: UseUserAdsProps) => {
  const [userId, setUserId] = useState<string | null>(null);

  // گرفتن userId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://barchasb-server.liara.run/api/auth/me",
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("🚀 /auth/me response:", data);

        if (data?.user?._id) {
          setUserId(data.user._id);
          console.log("🚀 userId set to:", data.user._id);
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
      }
    };
    fetchUser();
  }, []);

  const endpointMap: Record<AdType, string> = {
    employer: "/ads/employer",
    seeker: "/ads/jobseeker",
    ad: "/ads/seller",
  };

  const query = useQuery<Ad[], Error>({
    queryKey: ["userAds", active, userId],
    queryFn: async () => {
      if (!userId) return [];

      const url = `https://barchasb-server.liara.run/api${endpointMap[active]}/${userId}`;
      console.log("🚀 fetching ads from:", url);

      const res = await fetch(url, { credentials: "include" });

      if (res.status === 404) {
        console.warn("هیچ آگهی‌ای یافت نشد (404)");
        return []; // مهم: ارایه خالی
      }

      if (!res.ok) {
        console.error("خطا در دریافت آگهی‌ها:", res.status, res.statusText);
        throw new Error("خطا در دریافت آگهی‌ها");
      }

      const data = await res.json();
      console.log("🚀 ads data:", data);
      return data;
    },
    enabled: !!userId,
  });

  return query; // فقط داده‌ها و وضعیت‌ها
};
