
/* =======================
   GET ADS - FRONTEND
======================= */

const BASE_URL = "https://barchasb-server.liara.run/api";

/* =======================
   EMPLOYER ADS (GET)
======================= */
export const getEmployerAds = async () => {
  const res = await fetch(`${BASE_URL}/ads/employer`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log("📥 EMPLOYER ADS RECEIVED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch employer ads");
  }

  // مرتب سازی از جدید به قدیم
  return result.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/* =======================
   JOB SEEKER ADS (GET)
======================= */
export const getJobSeekerAds = async () => {
  const res = await fetch(`${BASE_URL}/ads/jobseeker`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log("📥 JOB SEEKER ADS RECEIVED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch job seeker ads");
  }

  return result.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/* =======================
   SELLER ADS (GET)
======================= */
export const getSellerAds = async () => {
  const res = await fetch(`${BASE_URL}/ads/seller`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log("📥 SELLER ADS RECEIVED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch seller ads");
  }

  return result.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/* =======================
   DIGITAL ADS (GET)
======================= */
export const getDigitalAds = async () => {
  const res = await fetch(`${BASE_URL}/ads/digital`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  console.log("📥 DIGITAL ADS RECEIVED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch digital ads");
  }

  return result.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
