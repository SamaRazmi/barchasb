"use client";

const BASE_URL = "https://barchasb-server.liara.run/api/profile";

/* =======================
   GET PROFILE
======================= */
export const getProfile = async (userId: string) => {
  const res = await fetch(`${BASE_URL}?userId=${userId}`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();
  console.log("📥 PROFILE RECEIVED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch profile");
  }

  return result;
};

/* =======================
   UPDATE PROFILE
======================= */
export const updateProfile = async (
  userId: string,
  userData: any = {},
  profileData: any = {},
) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      userId,
      user: userData,
      profile: profileData,
    }),
  });

  const result = await res.json();
  console.log("🚀 PROFILE UPDATED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to update profile");
  }

  return result;
};

/* =======================
   UPLOAD PROFILE PHOTO
======================= */
export const uploadProfilePhoto = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  formData.append("userId", userId);

  const res = await fetch(`${BASE_URL}/upload-photo`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result = await res.json();
  console.log("📸 PROFILE PHOTO UPLOADED:", result);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to upload profile photo");
  }

  return result;
};
