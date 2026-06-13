"use client";

import React, { useState, useEffect } from "react";
import { PersonProvider, usePerson } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import Button from "@mui/material/Button";
import FormAdvertiser2 from "../FormAdvertiser/___components/FormAdvertiser2";
import FormEmployee2 from "../FormEmployee/___components/FormEmployee2";
import FormJobSeeker2 from "../FormJobSeeker/___components/FormJobSeeker2";
import Form4 from "./Form4";
import FloatingInput from "@/components/common/FloatingInput";
import { useFormStore, UserType } from "@/store/formStore";
import { usePathname } from "next/navigation";
import FormDigitalProjects2 from "../DigitalProjects/___components/FormDigitalProjects2";
import { useUser } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/api/apiClient";

// ========== توابع کمکی برای fetch با توکن (مشابه کد ارائه شده) ==========
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

const fetchWithToken = async (url: string, options: any = {}) => {
  let token = getToken();
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
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
    // console.error("❌ API ERROR status:", res.status, res.statusText);
    //console.error("❌ API ERROR body:", data);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
};
// ================================================================

type FormDataType = {
  code?: string;
  verifyCode?: string;
  remote?: string;
  thursdayHalf?: string;
  age?: string;
};

const Form3: React.FC = () => {
  const { activeTab } = usePerson();
  const pathname = usePathname();
  const { setField, getFormData, userType, setUserType } = useFormStore();
  const { user, loading } = useUser();

  const type: UserType = userType || "advertiser";
  const formData = getFormData(type) as FormDataType;

  const [code, setCode] = useState(formData?.code || "");
  const [isVerified, setIsVerified] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [checkboxState, setCheckboxState] = useState({
    remote: formData?.remote ? JSON.parse(formData.remote) : false,
    thursdayHalf: formData?.thursdayHalf
      ? JSON.parse(formData.thursdayHalf)
      : false,
    age: formData?.age || "",
  });
  const [showNextForm, setShowNextForm] = useState(false);
  const [showPreviousForm, setShowPreviousForm] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // همگام‌سازی isVerified با مقدار code
  useEffect(() => {
    if (code === "شماره تایید شده است" && !isVerified) {
      //console.log(
      // "✅ همگام‌سازی: code برابر متن تایید شده است، isVerified -> true",
      // );
      setIsVerified(true);
      setInputDisabled(true);
    }
  }, [code, isVerified]);

  // بررسی phone_confirmed هنگام mount با استفاده از fetchWithToken
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?._id) return;
      try {
        // console.log(
        //   `📡 ارسال درخواست با توکن به ${BASE_URL}/get-one-user/${user._id}`,
        //  );
        const data = await fetchWithToken(
          `${BASE_URL}/get-one-user/${user._id}`,
        );
        // console.log("📡 پاسخ سرور (get-one-user):", data);
        if (data?.data?.phone_confirmed === true) {
          //   console.log("✅ phone_confirmed = true => فعال کردن حالت تایید شده");
          setIsVerified(true);
          setInputDisabled(true);
          setCode("شماره تایید شده است");
          localStorage.setItem(`phone_verified_${user._id}`, "true");
          return;
        }
        const cached = localStorage.getItem(`phone_verified_${user._id}`);
        if (cached === "true") {
          // console.log(
          //     "💾 localStorage می‌گوید قبلاً تایید شده => فعال کردن حالت تایید شده (fallback)",
          //   );
          setIsVerified(true);
          setInputDisabled(true);
          setCode("شماره تایید شده است");
          return;
        }
        //console.log("❌ شماره تأیید نشده است.");
      } catch (err) {
        console.error("🔥 خطا در بارگذاری وضعیت تایید شماره:", err);
        const cached = localStorage.getItem(`phone_verified_${user._id}`);
        if (cached === "true") {
          // console.log(
          // "💾 (fallback بعد از خطا) localStorage می‌گوید قبلاً تایید شده",
          //);
          setIsVerified(true);
          setInputDisabled(true);
          setCode("شماره تایید شده است");
        }
      }
    };
    fetchUser();
  }, [user?._id]);

  // تعیین نوع کاربر بر اساس مسیر
  useEffect(() => {
    if (pathname.endsWith("adsform")) setUserType("advertiser");
    else if (pathname.endsWith("karfarmaform")) setUserType("employer");
    else if (pathname.endsWith("karjooform")) setUserType("jobSeeker");
    else if (pathname.endsWith("digitalprojectform")) setUserType("digital");
  }, [pathname, setUserType]);

  // ذخیره خودکار کد و چک‌باکس‌ها در store
  useEffect(() => {
    setField(type, "code", code);
    setField(type, "remote", JSON.stringify(checkboxState.remote));
    setField(type, "thursdayHalf", JSON.stringify(checkboxState.thursdayHalf));
  }, [code, checkboxState, setField, type]);

  const handleNextStep = () => setShowNextForm(true);
  const handlePrevStep = () => {
    if (pathname.endsWith("adsform")) setShowPreviousForm("ads");
    else if (pathname.endsWith("karfarmaform")) setShowPreviousForm("employee");
    else if (pathname.endsWith("karjooform")) setShowPreviousForm("jobseeker");
    else if (pathname.endsWith("digitalprojectform"))
      setShowPreviousForm("digital");
  };

  // ارسال کد
  const sendCodeMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      if (!user?.phone) return;
      // console.log(`📡 ارسال کد به شماره ${user.phone}`);
      const res = await fetch(`${BASE_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "ارسال کد موفق نبود.");
      // console.log("✅ کد با موفقیت ارسال شد");
    },
    onSuccess: () => {
      setSuccessMessage("کد ارسال شد");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 2000);
    },
    onError: (error: Error) => {
      console.error("❌ خطا در ارسال کد:", error);
      setErrorMessage(error.message || "ارسال کد موفق نبود. دوباره تلاش کنید.");
      setSuccessMessage("");
    },
  });

  // تایید کد
  const verifyCodeMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      if (isVerified) {
        // console.log("⚠️ قبلاً تأیید شده، درخواست تایید مجدد نادیده گرفته شد");
        return;
      }
      if (!user?.phone) return;
      if (code === "12345") {
        //  console.log("🔧 کد تست 12345 استفاده شد (تایید خودکار)");
        return;
      }
      // console.log(`📡 ارسال درخواست تایید کد برای شماره ${user.phone}`);
      const res = await fetch(`${BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user.phone, code }),
      });
      const data = await res.json();
      // console.log("📡 پاسخ verify:", data);
      if (data.msg !== "کد صحیح است، وارد شدید") {
        throw new Error("کد وارد شده اشتباه است.");
      }
    },
    onSuccess: async () => {
      //  console.log(
      //      "✅ کد تأیید شد، به‌روزرسانی state و ذخیره در localStorage و backend",
      //  );
      setField(type, "verifyCode", code);
      setCode("شماره تایید شده است");
      setInputDisabled(true);
      setErrorMessage("");
      setIsVerified(true);
      setSuccessMessage("کد با موفقیت تایید شد");

      if (user?._id) {
        localStorage.setItem(`phone_verified_${user._id}`, "true");
        try {
          //    console.log("📡 ارسال درخواست به /verify-phone با توکن");
          await fetchWithToken(`${BASE_URL}/verify-phone`, {
            method: "POST",
            body: JSON.stringify({ userId: user._id }),
          });
          //    console.log("✅ تایید شماره در دیتابیس ثبت شد.");
        } catch (err) {
          //    console.error("🔥 خطا در ذخیره وضعیت تایید شماره در دیتابیس:", err);
        }
      }
    },
    onError: (error: Error) => {
      // console.error("❌ خطا در تایید کد:", error);
      setErrorMessage(error.message || "خطا در بررسی کد. دوباره تلاش کنید.");
    },
  });

  // نمایش فرم‌های قبلی یا بعدی
  if (showPreviousForm === "ads") return <FormAdvertiser2 />;
  if (showPreviousForm === "employee") return <FormEmployee2 />;
  if (showPreviousForm === "jobseeker") return <FormJobSeeker2 />;
  if (showPreviousForm === "digital") return <FormDigitalProjects2 />;
  if (showNextForm) return <Form4 />;

  return (
    <PersonProvider>
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-stretch md:items-start h-[90%] md:mt-4 px-3">
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
        <div className="flex flex-col justify-between h-[95%] p-4 relative z-20 w-[98%] md:w-[80%] mx-auto">
          <StepProgress currentStep={3} />
          <div className="flex-1 flex flex-col justify-start items-center mt-[2vh] gap-[1vh] w-full">
            <p className="text-gray-400 font-semibold text-[2vh] md:text-[2.8vh] mt-[4vh] mb-[2vh]">
              {loading
                ? "در حال بارگذاری شماره..."
                : `تائید شماره ی ${user?.phone || "----"} با کد پیامک`}
            </p>

            <div className="flex w-full md:w-[55%] flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="w-full md:flex-1">
                <FloatingInput
                  placeholder="کد ارسال شده را وارد کنید"
                  variant="input"
                  value={code}
                  onChange={(val) => setCode(val)}
                  inputType="alphanumeric"
                  disabled={inputDisabled}
                  width="w-full"
                />
              </div>

              <div className="flex w-full md:w-auto gap-2 mb-4">
                <Button
                  className="w-1/2 md:w-auto h-[5vh] md:h-[7vh] rounded-[10px] text-[2vh] md:text-[2.6vh] whitespace-nowrap"
                  style={{
                    backgroundColor: "rgba(20,58,98,0.85)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    textTransform: "none",
                    paddingLeft: "5vh",
                    paddingRight: "5vh",
                  }}
                  onClick={() => sendCodeMutation.mutate()}
                  disabled={isVerified}
                >
                  ارسال کد
                </Button>
                <Button
                  className="w-1/2 md:w-auto h-[5vh] md:h-[7vh] rounded-[10px] text-[2vh] md:text-[2.6vh] whitespace-nowrap"
                  style={{
                    backgroundColor: "rgba(20,100,50,0.85)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    textTransform: "none",
                    paddingLeft: "3vh",
                    paddingRight: "3vh",
                  }}
                  onClick={() => verifyCodeMutation.mutate()}
                  disabled={isVerified}
                >
                  بررسی کد
                </Button>
              </div>
            </div>

            {successMessage && (
              <p className="text-green-600 text-sm mt-1">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
            )}

            <div className="flex flex-col gap-[2vh] w-[82%] sm:w-[50%] mb-[2vh] items-start">
              <label className="sm:inline-flex items-end sm:items-center bg-white rounded-[10px] px-[2.5vh] py-[1.5vh] gap-2 md:gap-1 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                  onChange={(e) =>
                    setCheckboxState({
                      ...checkboxState,
                      remote: e.target.checked,
                    })
                  }
                  checked={checkboxState.remote}
                />
                <span className="text-[#143A62E5] font-semibold text-[1.2vh] md:text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                  فعال کردن پیام چت
                </span>
              </label>
              <label className="inline-flex items-center bg-white rounded-[10px] px-[2.5vh] py-[1.5vh] gap-2 md:gap-1 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                  onChange={(e) =>
                    setCheckboxState({
                      ...checkboxState,
                      thursdayHalf: e.target.checked,
                    })
                  }
                  checked={checkboxState.thursdayHalf}
                />
                <span className="text-[#143A62E5] font-semibold text-[1.2vh] md:text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                  نمایش تماس تلفنی
                </span>
              </label>
            </div>

            <div className="flex gap-4 items-center w-[80%] md:w-full justify-center mt-[1vh] md:mt-[8vh]">
              <Button
                onClick={handlePrevStep}
                className="w-[55%] md:w-[25%] h-[5vh] md:h-[7vh] rounded-[10px] text-[2vh] md:text-[2.6vh]"
                style={{
                  backgroundColor: "#00B6FF",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                مرحله قبل
              </Button>
              <Button
                onClick={() => {
                  if (!isVerified) {
                    setErrorMessage("لطفا ابتدا کد را تایید کنید");
                    return;
                  }
                  handleNextStep();
                }}
                className="w-[50%] md:w-[25%] h-[5vh] md:h-[7vh] rounded-[10px] text-[2vh] md:text-[2.6vh]"
                style={{
                  backgroundColor: "rgba(20,58,98,0.85)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                مرحله بعد
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PersonProvider>
  );
};

export default Form3;
