const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// دریافت توکن از localStorage (بدون Bearer اضافی)
const getToken = () => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("token") || "";
    if (token.startsWith("Bearer ")) token = token.slice(7);
    return token;
  }
  return "";
};

// درخواست با توکن (برای متدهای POST با JSON)
const fetchWithToken = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers, credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
};

export async function createOrUpdateResume(payload) {
  return fetchWithToken("/api/resume", {
    method: "POST",
    body: JSON.stringify(payload),
  }); // ✅ fetchWithToken already parses JSON via .json()
}

export async function fetchResumeById(resumeId) {
  const token = getToken();
  const res = await fetch(`${basePath}/api/resume/${resumeId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch resume");
  return data;
}

export async function uploadResumePDF(resumeId, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("resumeFile", file);
  const res = await fetch(`/api/resume/upload/${resumeId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error("Upload failed with empty response");
    return {};
  }
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data?.message || "Failed to upload PDF");
    return data;
  } catch (e) {
    throw new Error("Invalid response from server");
  }
}

export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return res;
};
