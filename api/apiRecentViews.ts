"use client";

/* =======================
   RECENT VIEWS - FRONTEND
======================= */

const BASE_URL = "https://barchasb-server.liara.run/api";

// GET RECENT VIEWS
export const getRecentViews = async (
  ownerId: string,
  time: string = "all",
  adType: string = "all",
) => {
  if (!ownerId) throw new Error("ownerId is required");

  const url = `${BASE_URL}/users/${ownerId}/recent-views?time=${time}&adType=${adType}`;
  const res = await fetch(url, { method: "GET", credentials: "include" });
  const result = await res.json();

  if (!res.ok)
    throw new Error(result?.message || "Failed to fetch recent views");

  return result.sort(
    (a: any, b: any) =>
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
  );
};

// ADD / UPDATE RECENT VIEW
export const addRecentView = async (
  ownerId: string,
  adId: string,
  adType: string,
) => {
  if (!ownerId || !adId || !adType)
    throw new Error("ownerId, adId and adType are required");

  const url = `${BASE_URL}/ads/${adType}/${ownerId}/${adId}/view`;
  const res = await fetch(url, { method: "POST", credentials: "include" });
  const result = await res.json();

  if (!res.ok) throw new Error(result?.message || "Failed to add recent view");

  return result;
};
