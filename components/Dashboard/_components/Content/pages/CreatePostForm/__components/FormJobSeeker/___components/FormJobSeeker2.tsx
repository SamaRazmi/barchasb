"use client";
import React, { useState, useRef, useEffect } from "react";
import { PersonProvider } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import FloatingSelect from "@/components/common/FloatingSelect";
import FloatingInput from "@/components/common/FloatingInput";
import Button from "@mui/material/Button";
import { useFormStore } from "@/store/formStore";
import FormJobSeeker1 from "./FormJobSeeker1";
import Form3 from "../../CommonForms/Form3";
import { useProvinces, useCities } from "@/api/apiClient";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import AddRelatedDescriptionModal from "@/components/common/AddRelatedDescriptionModal";
import AdditionalInfoModal from "./AdditionalInfoModal";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";

// ---------------------- API functions ----------------------
const API_BASE = "https://barchasb-server.liara.run/api";

const fetchMainCategories = async () => {
  const res = await fetch(`${API_BASE}/job-categories/main`);
  if (!res.ok) throw new Error("Failed to fetch main categories");
  return res.json();
};

const fetchSubCategories = async (parentId: string) => {
  const res = await fetch(
    `${API_BASE}/job-categories/sub?parentId=${parentId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch sub categories");
  return res.json();
};

// ---------------------- Helper ----------------------
const toArray = (value: string | number | (string | number)[]): any[] =>
  Array.isArray(value) ? value : value ? [value] : [];

const FormJobSeeker2: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { setField, getFormData } = useFormStore();
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [additionalInfoOpen, setAdditionalInfoOpen] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const jobSeekerData = getFormData("jobSeeker") as Record<string, any>;
  const { user, loading } = useUser();
  const activeTab = jobSeekerData.person || "khodam";

  // ---------- state اصلی فرم ----------
  const [state, setState] = useState({
    skills: toArray(jobSeekerData?.skills || []),
    resumeFile: jobSeekerData?.resumeFile || null,
    phoneNumber:
      jobSeekerData?.phoneNumber ||
      (activeTab === "khodam" ? user?.phone || "" : ""),
    province:
      jobSeekerData?.province ||
      (activeTab === "khodam" ? user?.province || "" : ""),
    city:
      jobSeekerData?.city || (activeTab === "khodam" ? user?.city || "" : ""),
    experienceDetails: jobSeekerData?.experienceDetails || "",
    otherDetails: jobSeekerData?.otherDetails || "",
    jobCategory: toArray(jobSeekerData?.jobCategory || []), // داخل state همچنان _id نگهداری می‌شود (برای ارتباط با API)
    portfolioFile: jobSeekerData?.portfolioFile || null,
  });

  const [selectedProvince, setSelectedProvince] = useState(
    state.province || "",
  );
  const [selectedCity, setSelectedCity] = useState(state.city || "");

  // ---------- مپ‌های تبدیل id → name ----------
  const [mainCategoryIdToName, setMainCategoryIdToName] = useState<
    Map<string, string>
  >(new Map());
  const [skillIdToName, setSkillIdToName] = useState<Map<string, string>>(
    new Map(),
  );

  // ---------- کوئری گرفتن دسته‌های اصلی ----------
  const { data: mainData, isLoading: mainLoading } = useQuery({
    queryKey: ["main-categories"],
    queryFn: fetchMainCategories,
  });
  const mainCategories = mainData?.categories || [];

  // پر کردن مپ دسته‌های اصلی
  useEffect(() => {
    if (mainCategories.length) {
      const map = new Map();
      mainCategories.forEach((cat: any) => map.set(cat._id, cat.name));
      setMainCategoryIdToName(map);
    }
  }, [mainCategories]);

  // گزینه‌های دسته شغلی (دسته‌های اصلی) – مقدار همان _id است
  const jobCategoryOptions = mainCategories.map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  }));

  // ---------- مدیریت دریافت زیردسته‌ها (مهارت‌ها) برای دسته‌های انتخاب شده ----------
  const [skillsOptions, setSkillsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isFetchingSkills, setIsFetchingSkills] = useState(false);

  // هر بار که jobCategory تغییر کند (تغییر در دسته‌های اصلی انتخاب شده)، زیردسته‌ها را واکشی می‌کنیم
  useEffect(() => {
    const fetchAllSubCategories = async () => {
      if (!state.jobCategory.length) {
        setSkillsOptions([]);
        setSkillIdToName(new Map());
        return;
      }
      setIsFetchingSkills(true);
      try {
        const promises = state.jobCategory.map((parentId: string) =>
          fetchSubCategories(parentId).then((res) => res.categories || []),
        );
        const results = await Promise.all(promises);
        const allSubs = results.flat();
        const uniqueMap = new Map(); // برای حذف تکراری بر اساس name
        const idToNameMap = new Map();
        allSubs.forEach((sub: any) => {
          if (!uniqueMap.has(sub.name)) {
            uniqueMap.set(sub.name, { label: sub.name, value: sub._id });
            idToNameMap.set(sub._id, sub.name);
          }
        });
        setSkillsOptions(Array.from(uniqueMap.values()));
        setSkillIdToName(idToNameMap);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSkillsOptions([]);
        setSkillIdToName(new Map());
      } finally {
        setIsFetchingSkills(false);
      }
    };

    fetchAllSubCategories();
  }, [state.jobCategory]);

  // در صورت تغییر دسته‌های اصلی، مهارت‌های قبلی را پاک می‌کنیم (چون دیگر معتبر نیستند)
  useEffect(() => {
    setState((prev) => ({ ...prev, skills: [] }));
  }, [state.jobCategory]);

  // ---------- استان و شهر ----------
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: citiesData } = useCities(selectedProvince);
  const provinceOptions =
    provincesData?.map((p: { id: number; name: string }) => ({
      label: p.name,
      value: p.name,
    })) || [];
  const cityOptions =
    citiesData?.map((c: string) => ({ label: c, value: c })) || [];

  // ---------- اعتبارسنجی و رفتن به مرحله بعد ----------
  const errorMessageDefault = "";
  const [errorMessage, setErrorMessage] = useState(errorMessageDefault);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleNext = () => {
    const errors: string[] = [];
    if (!state.skills || state.skills.length === 0) errors.push("مهارت‌ها");
    if (!state.phoneNumber) errors.push("شماره تماس");
    if (!state.experienceDetails) errors.push("جزئیات سابقه کار");
    if (!state.otherDetails) errors.push("سایر توضیحات");
    if (!state.jobCategory || state.jobCategory.length === 0)
      errors.push("دسته شغلی");
    if (!state.province) errors.push("استان");
    if (!state.city) errors.push("شهر");

    if (errors.length > 0) {
      setErrorMessage("لطفاً فیلدهای زیر را پر کنید: " + errors.join("، "));
      return;
    }

    // ✅ تبدیل _id دسته‌های اصلی به name
    const categoryNames = state.jobCategory.map(
      (id: string) => mainCategoryIdToName.get(id) || id,
    );
    // ✅ تبدیل _id مهارت‌ها به name
    const skillNames = state.skills.map(
      (id: string) => skillIdToName.get(id) || id,
    );

    // ذخیره در store (نام‌ها به جای id)
    setField("jobSeeker", "jobCategory", categoryNames);
    setField("jobSeeker", "skills", skillNames);
    // سایر فیلدها بدون تغییر
    setField("jobSeeker", "resumeFile", state.resumeFile);
    setField("jobSeeker", "phoneNumber", state.phoneNumber);
    setField("jobSeeker", "province", state.province);
    setField("jobSeeker", "city", state.city);
    setField("jobSeeker", "experienceDetails", state.experienceDetails);
    setField("jobSeeker", "otherDetails", state.otherDetails);
    setField("jobSeeker", "portfolioFile", state.portfolioFile);

    console.log(
      "💾 همه داده‌های ذخیره‌شده در jobSeeker (نام دسته‌ها و مهارت‌ها):",
      getFormData("jobSeeker"),
    );
    setErrorMessage("");
    setShowNext(true);
  };

  const handleExperienceSave = (newValue: string) => {
    setState((prev) => ({ ...prev, experienceDetails: newValue }));
    setExperienceModalOpen(false);
  };

  if (showPrev) return <FormJobSeeker1 />;
  if (showNext) return <Form3 />;

  return (
    <PersonProvider>
      <div
        className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] mt-4 px-3"
        ref={parentRef}
      >
        <div
          className="absolute inset-0 w-full h-full rounded-[20px]"
          style={{ backgroundColor: "rgba(247, 247, 247, 0.98)", zIndex: 0 }}
        />
        <img
          src="/images/bg_support_formik_desk.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          style={{ zIndex: 1 }}
          loading="lazy"
        />
        <div className="flex flex-col justify-start h-[95%] p-4 relative z-20 w-[77%] mx-auto">
          <StepProgress currentStep={2} />

          {errorMessage && (
            <div className="w-full text-center text-red-600 text-[1.6vh] mt-2">
              {errorMessage}
            </div>
          )}

          <div className="relative z-20 flex flex-col sm:flex-row gap-4 w-[95%] mt-[5vh] mr-[8%]">
            {/* ستون اول */}
            <div className="flex flex-col gap-4 flex-1">
              <FloatingSelect
                placeholder={
                  mainLoading ? "در حال بارگذاری دسته‌ها..." : "دسته شغلی"
                }
                options={jobCategoryOptions}
                value={state.jobCategory}
                onChange={(v) => {
                  const selected = toArray(v);
                  setState({ ...state, jobCategory: selected });
                }}
                multiSelect
              />

              <ModalTriggerInput
                placeholder="بارگذاری فایل رزومه (اختیاری)"
                value={state.resumeFile ? state.resumeFile.name : ""}
                type="file"
                onClick={() => resumeInputRef.current?.click()}
              />
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "application/pdf") {
                    alert("فقط فایل PDF مجاز است");
                    return;
                  }
                  if (file.size > MAX_FILE_SIZE) {
                    alert("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
                    return;
                  }
                  setState((prev) => ({ ...prev, resumeFile: file }));
                  setField("jobSeeker", "resumeFile", file);
                }}
              />
              <FloatingInput
                placeholder="شماره تلفن"
                inputType="number"
                value={state.phoneNumber}
                onChange={(v) => setState({ ...state, phoneNumber: v })}
              />
              <ModalTriggerInput
                placeholder="سوابق شغلی"
                value={state.experienceDetails}
                onClick={() => setExperienceModalOpen(true)}
              />
              <ModalTriggerInput
                placeholder="سایر مشخصات"
                value={
                  jobSeekerData?.marital ||
                  jobSeekerData?.gender ||
                  jobSeekerData?.militaryStatus
                    ? "ثبت شده"
                    : ""
                }
                onClick={() => setAdditionalInfoOpen(true)}
              />
            </div>

            {/* ستون دوم */}
            <div className="flex flex-col gap-4 flex-1">
              <FloatingSelect
                placeholder={
                  isFetchingSkills ? "در حال بارگذاری مهارت‌ها..." : "مهارت‌ها"
                }
                options={skillsOptions}
                value={state.skills}
                onChange={(v) => setState({ ...state, skills: toArray(v) })}
                multiSelect
              />

              <ModalTriggerInput
                placeholder="بارگذاری نمونه کارها (PDF) (اختیاری)"
                value={state.portfolioFile ? state.portfolioFile.name : ""}
                type="file"
                onClick={() => portfolioInputRef.current?.click()}
              />
              <input
                ref={portfolioInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "application/pdf") {
                    alert("فقط فایل PDF مجاز است");
                    return;
                  }
                  if (file.size > MAX_FILE_SIZE) {
                    alert("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
                    return;
                  }
                  setState((prev) => ({ ...prev, portfolioFile: file }));
                  setField("jobSeeker", "portfolioFile", file);
                }}
              />
              <FloatingSelect
                placeholder={provincesLoading ? "در حال بارگذاری..." : "استان"}
                options={provinceOptions}
                value={state.province}
                onChange={(val) => {
                  const province = val as string;
                  setSelectedProvince(province);
                  setState({ ...state, province, city: "" });
                  setSelectedCity("");
                }}
              />
              <FloatingSelect
                placeholder="شهر / منطقه"
                options={cityOptions}
                value={state.city}
                onChange={(val) => setState({ ...state, city: val as string })}
              />

              <div className="flex gap-4 w-[75%] mt-[-1vh]">
                <Button
                  onClick={() => setShowPrev(true)}
                  className="w-[50%] h-[7vh] rounded-[10px]"
                  style={{
                    backgroundColor: "#00B6FF",
                    color: "#FFFFFF",
                    fontSize: "2.4vh",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  مرحله قبل
                </Button>

                <Button
                  onClick={handleNext}
                  className="w-[50%] h-[7vh] rounded-[10px]"
                  style={{
                    backgroundColor: "rgba(20,58,98,0.85)",
                    color: "#FFFFFF",
                    fontSize: "2.4vh",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  مرحله بعد
                </Button>
              </div>
            </div>
          </div>

          <AddRelatedDescriptionModal
            isOpen={experienceModalOpen}
            onClose={() => setExperienceModalOpen(false)}
            parentRef={parentRef}
            titleModal="سوابق شغلی"
            titleAdd="شرح سوابق"
            titleAddHolder="موقعیت شغلی"
            titleDescription="درباره من:"
            userType="jobSeeker"
            onSave={handleExperienceSave}
          />

          {additionalInfoOpen && (
            <AdditionalInfoModal
              onClose={() => setAdditionalInfoOpen(false)}
              parentRef={parentRef}
              onSave={(value: string) => {
                setState((prev) => ({ ...prev, otherDetails: value }));
                setAdditionalInfoOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </PersonProvider>
  );
};

export default FormJobSeeker2;
