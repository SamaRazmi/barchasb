"use client";

import React, { useState, useEffect, useRef } from "react";
import { PersonProvider, usePerson } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import Button from "@mui/material/Button";
import { useFormStore, UserType } from "@/store/formStore";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { checkAuthorization, AuthorizeRequest } from "@/api/authorizeService";
import {
  submitDigitalAd,
  submitEmployerAd,
  submitJobSeekerAd,
  submitSellerAd,
} from "@/api/apiFormsAds";

const Form5: React.FC = () => {
  const { activeTab } = usePerson();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { getFormData, setUserType, setField } = useFormStore();

  const { user, loading: userLoading } = useUser();
  const submittedRef = useRef(false);

  const getFormType = (): UserType => {
    if (pathname.endsWith("adsform")) return "advertiser";
    if (pathname.endsWith("karfarmaform")) return "employer";
    if (pathname.endsWith("karjooform")) return "jobSeeker";
    if (pathname.endsWith("digitalprojectform")) return "digital";
    return "advertiser";
  };

  useEffect(() => {
    const t = getFormType();
    setUserType(t);

    const currentData = getFormData(t) as Record<string, any>;
    if (currentData && currentData.verify === undefined) {
      setField(t, "verify", 0);
    }

    console.log(`[Form5][${t}] Auto saved data:`, getFormData(t));
  }, [pathname, setField, getFormData, setUserType]);

  // تابع ارسال واقعی آگهی (بدون تغییر منطق قبلی)
  const performSubmit = async (t: UserType, data: any, userId: string) => {
    let result;
    if (t === "digital") {
      result = await submitDigitalAd(data, userId);
      console.log("✅ Digital Ad Saved Successfully:", result);
    } else if (t === "employer") {
      result = await submitEmployerAd(data, userId);
      console.log("✅ Employer Ad Saved Successfully:", result);
    } else if (t === "jobSeeker") {
      result = await submitJobSeekerAd(data, userId);
      console.log("✅ Job Seeker Ad Saved Successfully:", result);
    } else if (t === "advertiser") {
      result = await submitSellerAd(data, userId);
      console.log("✅ Advertiser Ad Saved Successfully:", result);
    }
    return result;
  };

  // تابع اصلی که ابتدا authorize و سپس submit می‌کند
  const handleAuthorizeAndSubmit = async () => {
    const t = getFormType();
    const formDataRaw = getFormData(t);
    // تبدیل به any برای دسترسی به خواص
    const data = formDataRaw as any;
    if (!data || !user) return;

    setIsAuthorizing(true);
    setAuthError(null);

    try {
      // 1) ساخت درخواست authorize بر اساس اطلاعات فرم
      const actions: ("CREATE_AD" | "SPECIAL_AD" | "LADDER")[] = ["CREATE_AD"];
      if (data.SPECIAL_AD === true) actions.push("SPECIAL_AD");
      if (data.LADDER === true) actions.push("LADDER");
      let adType = "";
      if (t === "advertiser") adType = "SELL";
      else if (t === "employer") adType = "EMPLOYER";
      else if (t === "digital") adType = "DIGITAL";
      else if (t === "jobSeeker") adType = "JOB_SEEKER";

      let categoryId = "";
      if (t === "advertiser") {
        categoryId = data.category || "";
      } else if (t === "employer") {
        const categories = data.categories;
        if (Array.isArray(categories) && categories.length > 0) {
          categoryId = categories[0].id || categories[0].name || "";
        }
      } else if (t === "digital") {
        categoryId = data.projectCategory || "";
      } else if (t === "jobSeeker") {
        const firstCat = data.category?.split(",")[0] || "";
        categoryId = firstCat;
      }

      const packageType =
        data.paymentMethod === "subscription" ? "premium-bundle" : "free";

      const authReq: AuthorizeRequest = {
        actions,
        adType,
        categoryId,
        meta: {
          source: "web-app",
          package: packageType,
        },
      };

      const authResult = await checkAuthorization(authReq);
      if (!authResult.success) {
        if (authResult.error.action === "SPECIAL_AD") {
          setAuthError(
            "سهمیه آگهی ویژه شما تمام شده است. لطفاً گزینه «ویژه» را غیرفعال کنید یا روش پرداخت دیگری انتخاب کنید.",
          );
        } else if (authResult.error.action === "LADDER") {
          setAuthError(
            "سهمیه آگهی نردبان (پله) شما تمام شده است. لطفاً گزینه «پله» را غیرفعال کنید.",
          );
        } else {
          setAuthError(
            "مجوز ثبت آگهی صادر نشد. لطفاً با پشتیبانی تماس بگیرید.",
          );
        }
        setIsAuthorizing(false);
        return;
      }

      // 2) در صورت موفقیت، آگهی را ارسال کن
      await performSubmit(t, data, user._id);
      // پس از موفقیت، داده‌های فرم پاک می‌شوند (در handleGoToDashboard)
    } catch (err: any) {
      console.error("❌ Error in authorization or submission:", err);
      setAuthError(err.message || "خطای ناشناخته در ثبت آگهی");
    } finally {
      setIsAuthorizing(false);
    }
  };

  // جایگزینی useEffect قبلی که مستقیماً submit می‌کرد
  useEffect(() => {
    if (submittedRef.current) return;
    if (userLoading || !user) return;

    submittedRef.current = true;
    handleAuthorizeAndSubmit();
  }, [userLoading, user]);

  const handleGoToDashboard = () => {
    setLoading(true);

    const t = getFormType();
    const formData = getFormData(t) as any;
    Object.keys(formData).forEach((key) => {
      setField(t, key, "");
    });

    console.log(`[Form5][${t}] Data cleared before dashboard`);
    router.push("/dashboard");
  };

  return (
    <PersonProvider>
      <div className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[90%] mt-4 px-3">
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

        <div className="flex flex-col justify-between h-[95%] p-4 relative z-20 w-[95%] sm:w-[80%] mx-auto">
          <StepProgress currentStep={5} />

          <div className="flex-1 flex justify-center items-center relative">
            <div className="absolute top-1/2 left-1/2 w-[85%] sm:w-[50%] h-[95%] bg-white rounded-xl flex flex-col justify-center items-center z-10 p-6 my-[1vh] transform -translate-x-1/2 -translate-y-1/2">
              {/* نمایش خطای مجوز در صورت وجود */}
              {authError ? (
                <>
                  <div className="text-red-600 text-[2vh] sm:text-[2.6vh] font-semibold mb-4 text-center">
                    خطا در ثبت آگهی
                  </div>
                  <div className="text-red-500 text-center text-[1.6vh] sm:text-[2vh] px-4">
                    {authError}
                  </div>
                  <div className="mt-6 text-gray-500 text-[1.4vh]">
                    لطفاً به فرم قبل برگشته و تنظیمات را اصلاح کنید.
                  </div>
                </>
              ) : isAuthorizing ? (
                <div className="text-blue-600 text-center">
                  در حال بررسی مجوز...
                </div>
              ) : (
                <>
                  <div className="text-[#FF8832] text-[2vh] sm:text-[2.6vh] font-semibold mb-8 text-center drop-shadow-lg">
                    در انتظار تایید...
                  </div>

                  <div className="relative w-[14vh] h-[14vh] flex justify-center items-center mb-8">
                    <div className="absolute w-full h-full animate-spin-slow">
                      {[2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                        const size = 4 + i * 1;
                        const angle = (i * 360) / 8;
                        return (
                          <div
                            key={i}
                            className="absolute rounded-full bg-orange-400"
                            style={{
                              width: `${size}px`,
                              height: `${size}px`,
                              top: "50%",
                              left: "50%",
                              transform: `rotate(${angle}deg) translate(5vh) rotate(-${angle}deg)`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-gray-600 text-[1.2vh] sm:text-[1.6vh] text-center px-4">
                    جزئیات آگهی به پشتیبانی فرستاده شد و در حال بررسی است
                    <br />
                    لطفا صبور باشید
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 items-center w-full justify-center mt-4 text-[2vh] sm:text-[2.4vh] md:text-[2.6vh] ">
            <Button
              onClick={handleGoToDashboard}
              className="w-[35%] sm:w-[25%] h-[6vh] sm:h-[7.5vh] rounded-[10px]"
              style={{
                backgroundColor: "rgba(20,58,98,0.85)",
                color: "#FFFFFF",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              برو به میز کار
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </PersonProvider>
  );
};

export default Form5;
