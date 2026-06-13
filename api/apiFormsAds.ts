"use client";

/* =======================
   DIGITAL AD - FRONTEND
======================= */

const BASE_URL = "https://barchasb-server.liara.run/api";

// 🔹 گرفتن توکن از localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

// 🔹 fetch wrapper با توکن
// 🔹 fetch wrapper با توکن (اصلاح شده برای جلوگیری از تکرار Bearer)
const fetchWithToken = async (url: string, options: any = {}) => {
  let token = getToken();
  // حذف عبارت "Bearer " اضافی از ابتدای توکن (در صورت وجود)
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // حذف "Bearer " (7 کاراکتر)
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
    console.error("❌ API ERROR status:", res.status, res.statusText);
    console.error("❌ API ERROR body:", data);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
};

/* =======================
   DIGITAL AD
======================= */
export const submitDigitalAd = async (formData: any, ownerId: string) => {
  const form = new FormData();

  form.append("owner", ownerId);
  form.append("title", formData.title || "");
  form.append("description", formData.description || "");
  form.append("digitalTotalDesc", formData.additionalInfo || "");

  (formData.projectName || []).forEach((name: string) =>
    form.append("projectNames[]", name),
  );
  (formData.projectDescription || []).forEach((desc: string) =>
    form.append("projectDescriptions[]", desc),
  );

  form.append("minBudget", formData.minBudget || "");
  form.append("maxBudget", formData.maxBudget || "");

  if (Array.isArray(formData.skills)) {
    form.append(
      "requiredSkills",
      JSON.stringify(formData.skills.map((s: string) => ({ name: s }))),
    );
  }

  form.append("person", formData.person === "khodam" ? "self" : "other");
  form.append("remote", String(formData.remote === "true"));
  form.append("thursdayHalf", String(formData.thursdayHalf === "true"));
  form.append("verifyCode", formData.verifyCode || "");

  form.append(
    "paymentMethod",
    formData.paymentMethod === "subscription"
      ? "Subscription"
      : formData.paymentMethod === "wallet"
        ? "Wallet"
        : "Bank card",
  );

  (formData.images || []).forEach((file: File, index: number) => {
    form.append("images", file);
    if (index === 0) form.append("mainImageIndex", "0");
  });

  // ========== افزودن فیلدهای جدید بدون تغییر کد قبلی ==========
  form.append("requestType", formData.requestType || "");
  form.append("durationUnit", formData.durationUnit || "");
  form.append("durationAmount", formData.durationAmount || "");

  console.log("🚀 DIGITAL FORM DATA SENT:", form);
  return fetchWithToken(`${BASE_URL}/ads/digital`, {
    method: "POST",
    body: form,
  });
};

/* =======================
   EMPLOYER AD – ✅ اصلاح شده برای ساختار categories
======================= */
export const submitEmployerAd = async (formData: any, ownerId: string) => {
  console.log("🧠 ZUSTAND RAW formData:", formData);
  console.log("🔍 categories value:", formData.categories);

  const form = new FormData();
  form.append("owner", ownerId);
  form.append("name", formData.name || "");
  form.append("title", formData.title || "");

  // ✅ ارسال categories به صورت JSON string (آرایه‌ای از اشیاء با name و subCategories)
  if (formData.categories && Array.isArray(formData.categories)) {
    form.append("categories", JSON.stringify(formData.categories));
  } else {
    form.append("categories", JSON.stringify([]));
  }

  form.append("person", formData.person === "khodam" ? "self" : "other");
  form.append(
    "adPaymentMethod",
    formData.paymentMethod === "subscription"
      ? "Subscription"
      : formData.paymentMethod === "wallet"
        ? "Wallet"
        : "Bank card",
  );
  form.append("cooperationType", formData.cooperationType?.join(", ") || "");
  form.append("gender", formData.gender || "");
  form.append("militaryStatus", formData.militaryStatus || "None");
  form.append("experience", formData.experience || "");
  form.append("isRemote", String(formData.remote === "true"));
  form.append("thursdayUntilNoon", String(formData.thursdayHalf === "true"));
  form.append("startTime", formData.startTime?.[0] || "");
  form.append("endTime", formData.endTime?.[0] || "");
  form.append("minSalary", formData.minSalary?.[0] || "");
  form.append("maxSalary", formData.maxSalary?.[0] || "");
  form.append("companyName", formData.companyName || "");
  form.append("companyType", formData.companyType || "");
  form.append("benefits", formData.benefits || "");
  form.append("insurance", formData.insurance || "");
  form.append("education", formData.education || "");
  form.append("companyDescription", formData.additionalInfo || "");
  form.append("state", formData.stateProvince || "");
  form.append("city", formData.city || "");

  if (Array.isArray(formData.positionName)) {
    formData.positionName.forEach((name: string, index: number) => {
      form.append(`jobDetails[${index}][title]`, name || "");
      form.append(
        `jobDetails[${index}][description]`,
        formData.positionDescription?.[index] || "",
      );
    });
  }

  (formData.images || []).forEach((file: File, index: number) => {
    form.append("images", file);
    if (index === 0) form.append("mainImageIndex", "0");
  });

  console.log("📤 FINAL FormData entries:", Array.from(form.entries()));

  return fetchWithToken(`${BASE_URL}/ads/employer`, {
    method: "POST",
    body: form,
  });
};

/* =======================
   JOB SEEKER AD (بدون تغییر)
======================= */
export const submitJobSeekerAd = async (formData: any, ownerId: string) => {
  const form = new FormData();
  form.append("owner", ownerId || "");
  form.append("name", formData.name || "");
  form.append("phoneNumber", formData.phoneNumber || "");
  form.append(
    "category",
    Array.isArray(formData.jobCategory)
      ? formData.jobCategory.join(",")
      : formData.jobCategory || "",
  );
  form.append("state", formData.province || "");
  form.append("city", formData.city || "");
  form.append("age", formData.age || "");
  form.append("gender", formData.gender || "");
  form.append("maritalStatus", formData.maritalStatus || "");
  form.append("militaryStatus", formData.militaryStatus || "");
  form.append("education", formData.education || "");
  form.append("suggestedSalaryIRT", formData.salary || "");
  form.append("aboutMe", formData.otherDetails || "");
  form.append("person", formData.person === "khodam" ? "self" : "other");
  form.append(
    "paymentMethod",
    formData.paymentMethod === "subscription"
      ? "Subscription"
      : formData.paymentMethod === "wallet"
        ? "Wallet"
        : "Bank card",
  );
  form.append("remote", String(formData.remote === "true"));
  form.append("thursdayHalf", String(formData.thursdayHalf === "true"));
  form.append("isVerified", String(formData.verify === 1));
  form.append("verifyCode", formData.verifyCode || "");

  (formData.skills || []).forEach((skill: string) =>
    form.append("skills[]", skill),
  );
  (formData.experiencePosition || []).forEach((title: string, i: number) => {
    form.append(`careerHistory[${i}][title]`, title);
    form.append(
      `careerHistory[${i}][description]`,
      formData.experienceDescription?.[i] || "",
    );
  });
  form.append("userDesc", formData.userDesc || "");
  (formData.images || []).forEach((file: File) => form.append("images", file));
  if (formData.resumeFile) {
    console.log(
      "📄 Resume file:",
      formData.resumeFile.name,
      formData.resumeFile.size,
    );
  }
  if (formData.portfolioFile) {
    console.log(
      "🖼️ Portfolio file:",
      formData.portfolioFile.name,
      formData.portfolioFile.size,
    );
  }
  const adResult = await fetchWithToken(`${BASE_URL}/ads/jobseeker`, {
    method: "POST",
    body: form,
  });
  const adId = adResult?._id || adResult?.id;
  if (!adId) throw new Error("❌ JobSeeker Ad ID not returned");

  if (formData.resumeFile) {
    const resumeForm = new FormData();
    resumeForm.append("resumeFile", formData.resumeFile);
    await fetchWithToken(`${BASE_URL}/ads/jobseeker/${adId}/resume`, {
      method: "POST",
      body: resumeForm,
    });
  }

  if (formData.portfolioFile) {
    const workForm = new FormData();
    workForm.append("workSampleFile", formData.portfolioFile);
    await fetchWithToken(`${BASE_URL}/ads/jobseeker/${adId}/work-sample`, {
      method: "POST",
      body: workForm,
    });
  }

  return adResult;
};

/* =======================
   SELLER AD (بدون تغییر)
======================= */
export const submitSellerAd = async (formData: any, ownerId: string) => {
  const form = new FormData();
  form.append("owner", ownerId);
  form.append("title", formData.title || "");
  form.append("category", formData.category || "");
  form.append("state", formData.province || "");
  form.append("city", formData.city || "");
  form.append("person", formData.person === "khodam" ? "self" : "other");
  form.append("priceIRT", String(formData.price || 0));
  form.append("isFixedPrice", String(formData.isFixedPrice || false));
  form.append("isNegotiable", String(formData.isNegotiable || false));
  form.append("hasWarranty", String(formData.warranty === "true"));
  form.append("isShippable", String(formData.shipping === "true"));
  form.append(
    "extraFeatures",
    JSON.stringify({
      ...JSON.parse(formData.attributes || "{}"),
      ...JSON.parse(formData.additionalOptions || "{}"),
    }),
  );

  if (formData.images && formData.images.length > 0) {
    formData.images.forEach((file: File, idx: number) => {
      form.append("images", file);
      if (idx === 0) form.append("mainImageIndex", "0");
    });
  } else if (formData.mainImage) {
    form.append("imagesUrls", formData.mainImage);
    form.append("mainImageIndex", "0");
  }

  return fetchWithToken(`${BASE_URL}/ads/seller`, {
    method: "POST",
    body: form,
  });
};
