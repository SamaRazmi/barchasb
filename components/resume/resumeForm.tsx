"use client";

import { Formik, Form, FormikHelpers } from "formik";
import initialValues from "@/utils/resumeInitialValues";
import validationSchema from "@/utils/validationSchema";
import DynamicTable from "@/components/table/dynamicTable";
import Dropdown from "@/components/inputs/dropdown";
import { useRouter } from "next/navigation";
import TxtInput from "@/components/inputs/txtInput";
import UploadInput from "@/components/inputs/uploadInput";
import CheckBox from "@/components/inputs/checkBox";
import { motion } from "framer-motion";
import { createOrUpdateResume } from "@/lib/api";
import Image from "next/image";
import BackButton from "../tests/backButton";
import SubmitButton from "../button/submitButton";

// --- Types ---
type FormValues = any; // می‌توانید در آینده این را دقیق‌تر تعریف کنید

// --- Helper Functions ---
function cleanArray(arr: any[], keys: string[]) {
  if (!Array.isArray(arr)) return [];
  return arr.filter((item) =>
    keys.some((key) => (item?.[key] || "").toString().trim() !== ""),
  );
}

function removeEmptyFields(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

function mapFormValuesToPayload(values: FormValues) {
  const personal = values.personal || {};

  const cooperationType =
    Array.isArray(values.cooperate) && values.cooperate.length > 0
      ? values.cooperate[0]
      : null;

  const hasInsuranceHistory = values.insurance === "iAm";
  const willingToGoOnMission = values.transfer === "do";

  const skills =
    typeof personal.skills === "string" && personal.skills.trim().length > 0
      ? personal.skills
          .split(/[،,]/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  const education = cleanArray(values.educationHistory, [
    "degree",
    "school",
    "gpa",
  ]).map((item) => ({
    major: item.degree || "",
    university: item.school || "",
    gpa: item.gpa || "",
  }));

  const workExperience = cleanArray(values.workHistory, [
    "place",
    "companyName",
    "duration",
  ]).map((item) => ({
    jobTitle: item.place || "",
    companyName: item.companyName || "",
    duration: item.duration || "",
  }));

  const certificates = cleanArray(values.honors, [
    "title",
    "Provider",
    "ProviderDate",
  ]).map((item) => ({
    title: item.title || "",
    provider: item.Provider || "",
    date: item.ProviderDate || "",
  }));

  const payload = {
    fullName: personal.fullName || "",
    phoneNumber: personal.phone || "",
    birthDate: personal.birthDate || "",
    gender: personal.gender || "",
    maritalStatus: personal.maritalStatus || "",
    address: personal.address || "",
    expectedSalary: personal.salary || "",
    cooperationType,
    hasInsuranceHistory,
    willingToGoOnMission,
    skills,
    education,
    workExperience,
    certificates,
  };

  return removeEmptyFields(payload);
}

export default function ResumeForm() {
  const router = useRouter();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      const payload = mapFormValuesToPayload(values);

      const result = await createOrUpdateResume(payload);
      const resumeId = result?.resumeId;

      localStorage.setItem("resumeData", JSON.stringify(values));

      if (resumeId) {
        router.push(`/resume/preview/${resumeId}`);
      } else {
        const params = new URLSearchParams({ data: JSON.stringify(values) });
        router.push(`/resume/preview?${params.toString()}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("خطا در ذخیره رزومه، لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="w-full min-h-screen">
        {/* HEADER */}
        <div className="bg-[#ff9532] h-30 relative">
          <div className="px-35 flex justify-between">
            <div className="flex items-center gap-10 max-w-7xl mx-auto w-full justify-between">
              <div className="flex items-center gap-5">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.1)] w-15 h-15 rounded-full p-[45px] mt-3 flex items-center justify-center"
                >
                  <Image
                    src="/images/Logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <div>
                  <p className="text-white font-bold text-2xl">رزومه‌ساز</p>
                  <p className="text-[rgba(255,255,255,0.7)] text-xl">
                    ساخت رزومه حرفه‌ای
                  </p>
                </div>
              </div>
              <div className="flex gap-14 mb-5">
                <BackButton
                  label="داشبورد"
                  ImgSrc="/images/homeicon.svg"
                  onClick={() => router.push("/dashboard")}
                />
                <BackButton
                  label="بازگشت"
                  ImgSrc="/images/back_arrow.svg"
                  onClick={() => router.back()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="max-w-8xl mx-auto px-12 py-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] lg:gap-10">
          <div className="bg-[#102e4e] rounded-t-[150px] rounded-b-[40px] p-10 h-full">
            <UploadInput />
          </div>

          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 -mt-[65px] justify-center lg:flex hidden"
            >
              <div className="relative bg-white shadow-2xl rounded-2xl px-8 py-7">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-2xl md:text-3xl font-bold text-[#102e4e] text-center"
                >
                  رزومه حرفه‌ای خود را بسازید
                </motion.h1>
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(255,149,50,0.25)",
                      "0 0 20px rgba(255,149,50,0.45)",
                      "0 0 0px rgba(255,149,50,0.25)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              <Dropdown
                name="personal.salary"
                lable="حقوق درخواستی"
                options={[
                  { tag: "5 تا 10 میلیون", value: "5-10" },
                  { tag: "10 تا 20 میلیون", value: "10-20" },
                  { tag: "20 تا 30 میلیون", value: "20-30" },
                  { tag: "30 تا 40 میلیون", value: "30-40" },
                  { tag: "40 تا 50 میلیون", value: "40-50" },
                  { tag: "+ 50 میلیون", value: "+50" },
                  { tag: "توافقی", value: "agreement" },
                  { tag: "پروژه ای", value: "project" },
                ]}
              />
              <TxtInput name="personal.skills" lable="مهارت ها و توانایی ها" />
            </div>
            <TxtInput name="personal.address" lable="آدرس محل سکونت" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-bold text-[#2D3E48] mb-3">نحوه همکاری :</p>
                <div className="flex gap-6 flex-wrap">
                  <CheckBox
                    name="cooperate"
                    value="fullTime"
                    label="تمام وقت"
                  />
                  <CheckBox
                    name="cooperate"
                    value="partTime"
                    label="پاره وقت"
                  />
                </div>
              </div>
              <div>
                <p className="font-bold text-[#2D3E48] mb-3">
                  دارای سابقه بیمه هستید؟
                </p>
                <div className="flex gap-6 flex-wrap">
                  <CheckBox name="insurance" value="true" label="هستم" />
                  <CheckBox name="insurance" value="iAmNot" label="نیستم" />
                </div>
              </div>
            </div>

            <DynamicTable
              lable="سوابق تحصیلی"
              name="educationHistory"
              columns={[
                { key: "degree", label: "رشته تحصیلی", placeholder: "..." },
                { key: "school", label: "دانشگاه", placeholder: "..." },
                { key: "gpa", label: "معدل", placeholder: "..." },
              ]}
            />
            <DynamicTable
              lable="سوابق شغلی"
              name="workHistory"
              columns={[
                { key: "place", label: "عنوان شغلی", placeholder: "..." },
                { key: "companyName", label: "نام شرکت", placeholder: "..." },
                { key: "duration", label: "مدت زمان", placeholder: "..." },
              ]}
            />
            <DynamicTable
              lable="گواهینامه ها و افتخارات"
              name="honors"
              columns={[
                { key: "title", label: "عنوان", placeholder: "..." },
                { key: "Provider", label: "ارائه دهنده", placeholder: "..." },
                { key: "ProviderDate", label: "تاریخ", placeholder: "..." },
              ]}
            />

            <div className="flex justify-center pt-6">
              <SubmitButton />{" "}
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
}
