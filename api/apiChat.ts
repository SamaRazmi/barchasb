const BASE_URL = "https://barchasb-server.liara.run/api";

export const getAdDetails = async (adId: string, adType: string) => {
  let url = "";
  if (adType === "SellerAd") url = `${BASE_URL}/ads/seller/${adId}`;
  else if (adType === "EmployerAd") url = `${BASE_URL}/ads/employer/${adId}`;
  else if (adType === "JobSeekerAd") url = `${BASE_URL}/ads/jobseeker/${adId}`;
  else throw new Error("Invalid adType");

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    console.warn(`Failed to fetch ad: ${res.status} ${res.statusText}`);
    return null;
  }
  return res.json();
};

export const getChatHistory = async (
  adType: string,
  adId: string,
  currentUserId: string,
  receiverId: string,
) => {
  const res = await fetch(
    `${BASE_URL}/chat/history/${adType}/${adId}/${currentUserId}/${receiverId}`,
    { credentials: "include" },
  );
  return res.json();
};

export const sendMessage = async (
  from: string,
  to: string,
  adId: string,
  adType: string,
  content: string,
  type: string = "text",
) => {
  const res = await fetch(`${BASE_URL}/chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ from, to, adId, adType, content, type }),
  });
  return res.json();
};

export const markRead = async (userId: string, conversationId: string) => {
  const res = await fetch(`${BASE_URL}/chat/mark-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, conversationId }),
  });
  const contentType = res.headers.get("content-type");
  if (res.ok && contentType?.includes("application/json")) {
    return res.json();
  }
  return null;
};
