"use client";
import React, { useState, useRef } from "react";
import { PersonProvider } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import FloatingSelect from "@/components/common/FloatingSelect";
import Button from "@mui/material/Button";
import { useFormStore } from "@/store/formStore";
import FormEmployee1 from "./FormEmployee1";
import Form3 from "../../CommonForms/Form3";
import ModalTriggerInput from "@/components/common/ModalTriggerInput";
import AdAttributesModal from "./OtherFeaturesModal";
import { useUser } from "@/context/UserContext";
import { useProvinces, useCities } from "@/api/apiClient";

// تابع کمکی برای تبدیل مقدار به آرایه
const toArray = (value: string | number | (string | number)[]): any[] =>
  Array.isArray(value) ? value : value ? [value] : [];

const FormEmployee2: React.FC = () => {
  const { user, loading } = useUser();
  const { setField, getFormData } = useFormStore();
  const parentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const employerData = getFormData("employer") as Record<string, any>;
  const workOptionsInitial = employerData?.workOptions
    ? JSON.parse(employerData.workOptions)
    : { remote: false, thursdayHalf: false };
  const [workOptions, setWorkOptions] = useState<{
    remote: boolean;
    thursdayHalf: boolean;
  }>(workOptionsInitial);

  const person = employerData?.person;

  const [state, setState] = useState(() => {
    // فقط بررسی داده‌های قبلی در zustand
    const hasStoredData =
      employerData &&
      Object.keys(employerData).some(
        (key) =>
          employerData[key] !== undefined &&
          employerData[key] !== null &&
          employerData[key] !== "",
      );

    if (hasStoredData) {
      return {
        cooperationType: toArray(employerData?.cooperationType),
        militaryStatus: employerData?.militaryStatus || "",
        paymentMethod: toArray(employerData?.paymentMethod),
        minSalary: toArray(employerData?.minSalary),
        startTime: toArray(employerData?.startTime),
        otherFeatures: employerData?.otherFeatures || "",
        gender: employerData?.gender || "",
        experience: employerData?.experience || "",
        maxSalary: toArray(employerData?.maxSalary),
        endTime: toArray(employerData?.endTime),
        stateProvince: employerData?.state || "",
        city: employerData?.city || "",
      };
    }

    // اگر هیچ داده‌ای نیست → مقادیر اولیه خالی
    return {
      cooperationType: [],
      militaryStatus: "",
      paymentMethod: [],
      minSalary: [],
      startTime: [],
      otherFeatures: "",
      gender: "",
      experience: "",
      maxSalary: [],
      endTime: [],
      stateProvince: "",
      city: "",
    };
  });

  React.useEffect(() => {
    if (user && person === "khodam") {
      setSelectedProvince((prev: string) => prev || user.province || "");
      setSelectedCity((prev: string) => prev || user.city || "");
      setState((prev) => ({
        ...prev,
        gender: prev.gender || user.gender || "",
        stateProvince: prev.stateProvince || user.province || "",
        city: prev.city || user.city || "",
      }));
    }
  }, [user, person]);

  const [selectedProvince, setSelectedProvince] = useState(state.stateProvince);
  const [selectedCity, setSelectedCity] = useState(state.city);
  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: citiesData } = useCities(selectedProvince);

  const provinceOptions =
    provincesData?.map((p: { id: number; name: string }) => ({
      label: p.name,
      value: p.name,
    })) || [];

  const cityOptions =
    citiesData?.map((c: string) => ({ label: c, value: c })) || [];

  const [errorMessage, setErrorMessage] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const attributesSaved = Boolean(
    employerData?.companyName ||
    employerData?.companyType ||
    employerData?.benefits ||
    employerData?.insurance ||
    employerData?.education,
  );

  const genderOptions = [
    { label: "زن", value: "female" },
    { label: "مرد", value: "male" },
  ];
  const cooperationTypeOptions = [
    { label: "تمام‌وقت", value: "full_time" },
    { label: "پاره‌وقت", value: "part_time" },
    { label: "پروژه‌ای", value: "contract" },
    { label: "کارآموزی", value: "internship" },
  ];
  const militaryStatusOptions = [
    { label: "پایان خدمت", value: "completed" },
    { label: "معافیت دائم", value: "exempt" },
    { label: "در حال خدمت", value: "serving" },
    { label: "مشمول", value: "subject" },
  ];
  const paymentMethodOptions = [
    { label: "ماهانه", value: "monthly" },
    { label: "ساعتی", value: "hourly" },
    { label: "پورسانتی", value: "commission" },
  ];
  const minSalaryOptions = [
    { label: "۱۰ تا ۱۵ میلیون", value: "10-15" },
    { label: "۱۵ تا ۲۰ میلیون", value: "15-20" },
    { label: "۲۰ تا ۳۰ میلیون", value: "20-30" },
  ];
  const startTimeOptions = [
    { label: "۸ صبح", value: "08:00" },
    { label: "۹ صبح", value: "09:00" },
    { label: "۱۰ صبح", value: "10:00" },
  ];
  const otherFeaturesOptions = [
    { label: "بیمه", value: "insurance" },
    { label: "پاداش", value: "bonus" },
    { label: "ناهار", value: "lunch" },
  ];
  const experienceOptions = [
    { label: "بدون سابقه", value: "none" },
    { label: "۱ تا ۳ سال", value: "1-3" },
    { label: "۳ تا ۵ سال", value: "3-5" },
    { label: "بیش از ۵ سال", value: "5+" },
  ];
  const maxSalaryOptions = [
    { label: "۲۰ میلیون", value: "20" },
    { label: "۳۰ میلیون", value: "30" },
    { label: "۴۰ میلیون+", value: "40+" },
  ];
  const endTimeOptions = [
    { label: "۱۲", value: "12:00" },
    { label: "۱۴", value: "14:00" },
    { label: "۱۶", value: "16:00" },
    { label: "۱۷", value: "17:00" },
    { label: "۱۸", value: "18:00" },
  ];

  const handleNext = () => {
    // آرایه‌ای برای ذخیره پیام خطاهای هر فیلد
    const errors: string[] = [];

    // بررسی هر فیلد
    if (state.cooperationType.length === 0) errors.push("نوع همکاری");
    if (state.gender === "") errors.push("جنسیت");
    if (state.gender !== "female" && state.militaryStatus === "")
      errors.push("وضعیت سربازی");
    if (state.paymentMethod.length === 0) errors.push("شیوه پرداخت");
    if (state.minSalary.length === 0) errors.push("حداقل حقوق");
    if (state.startTime.length === 0) errors.push("ساعت شروع کار");
    if (state.experience === "") errors.push("سابقه");
    if (state.maxSalary.length === 0) errors.push("حداکثر حقوق");
    if (state.endTime.length === 0) errors.push("ساعت پایان کار");
    if (state.stateProvince === "") errors.push("استان");
    if (state.city === "") errors.push("شهر");

    // اگر خطایی بود، پیام خطا را نشان بده و ادامه نده
    if (errors.length > 0) {
      setErrorMessage("لطفاً فیلدهای زیر را پر کنید: " + errors.join("، "));
      return;
    }

    // ذخیره فیلدهای استان و شهر در zustand
    setField("employer", "state", state.stateProvince);
    setField("employer", "city", state.city);

    // ذخیره بقیه فیلدها
    Object.entries(state).forEach(([key, value]) => {
      setField("employer", key, value);
    });

    setField("employer", "workOptions", JSON.stringify(workOptions));

    // پاک کردن پیام خطا و رفتن به مرحله بعد
    setErrorMessage("");
    setShowNext(true);
  };

  if (showPrev) return <FormEmployee1 />;
  if (showNext) return <Form3 />;

  return (
    <PersonProvider>
      <div
        className="relative z-10 flex flex-col sm:flex-row justify-center items-start h-[98%] sm:h-[90%] mt-2 sm:mt-4 sm:px-3"
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
        <div className="flex flex-col justify-start h-[95%] sm:p-4 relative z-20 w-[99%] sm:w-[77%] mx-auto">
          <StepProgress currentStep={2} />

          {errorMessage && (
            <div className="w-full text-center text-red-600 text-[1.6vh] mt-2">
              {errorMessage}
            </div>
          )}

          <div className="relative z-20 flex flex-row gap-0 sm:gap-4 w-full sm:w-[95%] mt-[1vh] sm:mt-[2vh] mr-[4%] sm:mr-[8%]">
            {/* ستون اول */}
            <div className="flex flex-col sm:gap-[0.000001vh] flex-1">
              <FloatingSelect
                placeholder={provincesLoading ? "در حال بارگذاری..." : "استان"}
                options={provinceOptions}
                value={state.stateProvince}
                onChange={(val) => {
                  const province = val as string;
                  setSelectedProvince(province);
                  setState({ ...state, stateProvince: province, city: "" });
                  setSelectedCity("");
                }}
              />
              <FloatingSelect
                placeholder="نوع همکاری"
                options={cooperationTypeOptions}
                value={state.cooperationType}
                onChange={(v) =>
                  setState({ ...state, cooperationType: toArray(v) })
                }
                multiSelect
              />
              <FloatingSelect
                placeholder="وضعیت سربازی"
                options={militaryStatusOptions}
                value={state.militaryStatus}
                onChange={(v) => setState({ ...state, militaryStatus: v })}
                disabled={state.gender === "female"} // ← این خط اضافه شد
              />

              <FloatingSelect
                placeholder="شیوه پرداخت"
                options={paymentMethodOptions}
                value={state.paymentMethod}
                onChange={(v) =>
                  setState({ ...state, paymentMethod: toArray(v) })
                }
                multiSelect
              />
              <FloatingSelect
                placeholder="حداقل حقوق"
                options={minSalaryOptions}
                value={state.minSalary}
                onChange={(v) => setState({ ...state, minSalary: toArray(v) })}
                multiSelect
              />
              <FloatingSelect
                placeholder="ساعت شروع کار"
                options={startTimeOptions}
                value={state.startTime}
                onChange={(v) => setState({ ...state, startTime: toArray(v) })}
                multiSelect
              />
              <ModalTriggerInput
                placeholder="ویژگی‌ها و امکانات"
                value={attributesSaved ? "مشخصات ثبت شد" : ""}
                onClick={() => setIsModalOpen(true)}
              />
            </div>

            {/* ستون دوم */}
            <div className="flex flex-col sm:gap-[0.000001vh] flex-1 w-[50%] sm:w-full">
              <FloatingSelect
                placeholder="شهر / منطقه"
                options={cityOptions}
                value={state.city}
                onChange={(val) => setState({ ...state, city: val as string })}
              />
              <FloatingSelect
                placeholder="جنسیت"
                options={genderOptions}
                value={state.gender}
                onChange={(v) => setState({ ...state, gender: v })}
              />
              <FloatingSelect
                placeholder="سابقه"
                options={experienceOptions}
                value={state.experience} // ← سابقه ساده
                onChange={(v) => setState({ ...state, experience: v })}
              />

              <div className="flex gap-[1vh] mb-[2vh]">
                <label className="inline-flex items-center bg-white rounded-[10px] px-[0.5vh] py-[0.5vh] gap-0 sm:px-[1.5vh] sm:py-[1.5vh] sm:gap-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                    checked={workOptions.remote}
                    onChange={(e) =>
                      setWorkOptions({
                        ...workOptions,
                        remote: e.target.checked,
                      })
                    }
                  />
                  <span className="text-[#143A62E5] font-semibold text-[1.1vh] sm:text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                    دورکاری
                  </span>
                </label>
                <label className="inline-flex items-center bg-white rounded-[10px] px-[0.5vh] py-[0.5vh] gap-0 sm:px-[1.5vh] sm:py-[1.5vh] sm:gap-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-[2.4vh] h-[2.4vh] rounded-[5px] bg-[#DEDEDE] checked:bg-blue-900 appearance-none cursor-pointer"
                    checked={workOptions.thursdayHalf}
                    onChange={(e) =>
                      setWorkOptions({
                        ...workOptions,
                        thursdayHalf: e.target.checked,
                      })
                    }
                  />
                  <span className="text-[#143A62E5] font-semibold text-[1.1vh] sm:text-[1.4vh] md:text-[1.8vh] lg:text-[2.2vh]">
                    پنج‌شنبه‌ها تا ظهر
                  </span>
                </label>
              </div>

              <FloatingSelect
                placeholder="حداکثر حقوق"
                options={maxSalaryOptions}
                value={state.maxSalary}
                onChange={(v) => setState({ ...state, maxSalary: toArray(v) })}
                multiSelect
              />
              <FloatingSelect
                placeholder="ساعت پایان کار"
                options={endTimeOptions}
                value={state.endTime}
                onChange={(v) => setState({ ...state, endTime: toArray(v) })}
                multiSelect
              />

              <div className="flex gap-4 mt-[1vh] w-[75%] text-[1.6vh] sm:text-[2.4vh] whitespace-nowrap ">
                <Button
                  onClick={() => setShowPrev(true)}
                  className="w-[50%] h-[7vh] rounded-[10px]"
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
                  onClick={handleNext}
                  className="w-[55%] sm:w-[50%] h-[7vh] rounded-[10px]  text-[1.5vh] sm:text-[2.4vh] whitespace-nowrap"
                  style={{
                    backgroundColor: "rgba(20,58,98,0.85)",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  مرحله بعد
                </Button>
                {isModalOpen && (
                  <AdAttributesModal
                    parentRef={parentRef}
                    onClose={() => setIsModalOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PersonProvider>
  );
};

export default FormEmployee2;
