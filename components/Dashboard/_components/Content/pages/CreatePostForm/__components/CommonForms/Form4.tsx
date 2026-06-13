"use client";

import React, { useEffect, useState } from "react";
import { PersonProvider } from "@/context/PersonContext";
import StepProgress from "@/components/common/StepProgress";
import Button from "@mui/material/Button";
import { useFormStore, UserType } from "@/store/formStore";
import { usePathname } from "next/navigation";
import Form5 from "./Form5";
import Form3 from "./Form3";
import FormDigitalProjects2 from "../DigitalProjects/___components/FormDigitalProjects2";

/* ---------------- Types ---------------- */
type PaymentType = "subscription" | "wallet" | "card";

/* ---------------- Custom Radio Option ---------------- */
type RadioOptionProps = {
  label: string;
  value: PaymentType;
  selectedValue: PaymentType | null;
  onChange: (value: PaymentType) => void;
};

const CustomRadioOption: React.FC<RadioOptionProps> = ({
  label,
  value,
  selectedValue,
  onChange,
}) => {
  const isChecked = selectedValue === value;

  return (
    <label className="flex justify-between items-center bg-gray-200 rounded-lg p-3 cursor-pointer min-h-[70px]">
      <span className="text-[#143A62] text-[1.8vh] sm:text-[2vh]">{label}</span>

      <span className="relative flex items-center justify-center">
        <input
          type="radio"
          name="payment"
          checked={isChecked}
          onChange={() => onChange(value)}
          className="
            appearance-none
            w-[18px] h-[18px]
            rounded-full
            border
            border-[#143A62]
            bg-transparent
            cursor-pointer
          "
        />

        {isChecked && (
          <span className="absolute text-[#143A62] text-[14px] leading-none select-none">
            ✓
          </span>
        )}
      </span>
    </label>
  );
};

/* ---------------- Ad Type Card ---------------- */
type AdOptionCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

const AdOptionCard: React.FC<AdOptionCardProps> = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <label className="flex justify-between items-start bg-gray-200 rounded-lg p-3 cursor-pointer flex-1 h-full">
      <div className="flex flex-col items-start text-right">
        <span className="text-[#143A62] font-bold text-[2.8vh]">{title}</span>

        <span className="text-[#143A62] text-[1.8vh] mt-2 leading-[3vh]">
          {description}
        </span>
      </div>

      <span className="relative flex items-center justify-center mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="
            appearance-none
            w-[18px] h-[18px]
            rounded-full
            border
            border-[#143A62]
            bg-transparent
            cursor-pointer
          "
        />

        {checked && (
          <span className="absolute text-[#143A62] text-[14px] leading-none select-none">
            ✓
          </span>
        )}
      </span>
    </label>
  );
};

/* ---------------- Form4 ---------------- */
const Form4: React.FC = () => {
  const pathname = usePathname();
  const { setField, getFormData, userType, setUserType } = useFormStore();

  const [showNextForm, setShowNextForm] = useState(false);
  const [showPreviousForm, setShowPreviousForm] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentType | null>(null);

  const [ladderChecked, setLadderChecked] = useState(true);
  const [specialAdChecked, setSpecialAdChecked] = useState(true);

  /* ---------- Detect user type ---------- */
  useEffect(() => {
    if (pathname.endsWith("adsform")) setUserType("advertiser");
    else if (pathname.endsWith("karfarmaform")) setUserType("employer");
    else if (pathname.endsWith("karjooform")) setUserType("jobSeeker");
    else if (pathname.endsWith("digitalprojectform")) setUserType("digital");
  }, [pathname, setUserType]);

  const type: UserType = userType || "advertiser";

  /* ---------- Init data from store ---------- */
  const formData = getFormData(type) as Record<string, any>;

  useEffect(() => {
    if (!paymentMethod) {
      setPaymentMethod(formData?.paymentMethod || "subscription");
    }

    if (formData?.LADDER !== undefined) {
      setLadderChecked(formData.LADDER);
    }

    if (formData?.SPECIAL_AD !== undefined) {
      setSpecialAdChecked(formData.SPECIAL_AD);
    }
  }, [type, formData, paymentMethod]);

  /* ---------- Auto save ---------- */
  useEffect(() => {
    if (!paymentMethod) return;

    setField(type, "paymentMethod", paymentMethod);

    setField(type, "LADDER", ladderChecked);

    setField(type, "SPECIAL_AD", specialAdChecked);

    console.log(`[Form4][${type}] current stored data:`, getFormData(type));
  }, [
    paymentMethod,
    ladderChecked,
    specialAdChecked,
    setField,
    type,
    getFormData,
  ]);

  /* ---------- Navigation ---------- */
  if (showPreviousForm) {
    if (pathname.endsWith("digitalprojectform"))
      return <FormDigitalProjects2 />;

    return <Form3 />;
  }

  if (showNextForm) return <Form5 />;

  return (
    <PersonProvider>
      <div className="relative z-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-start h-[95%] sm:h-[90%] sm:mt-4 px-3">
        {/* بک‌گراند رنگی */}
        <div
          className="absolute inset-0 w-full h-full rounded-[20px]"
          style={{
            backgroundColor: "rgba(247, 247, 247, 0.98)",
            zIndex: 0,
          }}
        />

        {/* بک‌گراند تصویر */}
        <img
          src="/images/bg_support_formik_desk.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
          style={{ zIndex: 1 }}
          loading="lazy"
        />

        <div className="flex flex-col justify-between h-[65%] sm:h-[85%] p-4 relative z-20 w-[94%] sm:w-[55%] mx-auto">
          <StepProgress currentStep={4} />

          <div className="flex-1 flex flex-col justify-center items-center gap-4 w-full mt-[2vh]">
            {/* Info boxes */}
            <div className="w-fit rounded-lg p-1 text-[#143A62] bg-gray-200 text-[1.2vh] sm:text-[1.6vh] text-center">
              تعداد امتیاز اشتراک: 3
            </div>

            <div className="w-fit rounded-lg p-1 text-[#143A62] bg-gray-200 text-[1.8vh] sm:text-[2.2vh] text-center">
              موجودی کیف پول: 100.000 تومان
            </div>

            {/* Main Section */}
            <div className="flex flex-col md:flex-row-reverse w-[90%] md:w-[80%] gap-4 items-stretch">
              {/* Payment selection */}
              <div className="flex flex-col md:w-1/2 gap-4">
                <CustomRadioOption
                  label="پرداخت از طریق اشتراک"
                  value="subscription"
                  selectedValue={paymentMethod}
                  onChange={setPaymentMethod}
                />

                <CustomRadioOption
                  label="پرداخت از طریق کیف پول"
                  value="wallet"
                  selectedValue={paymentMethod}
                  onChange={setPaymentMethod}
                />

                <CustomRadioOption
                  label="پرداخت با کارت بانکی"
                  value="card"
                  selectedValue={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>

              {/* Ad options */}
              <div className="flex flex-col md:w-1/2 gap-4">
                <AdOptionCard
                  title="پله"
                  description="آگهی شما در صدر آگهی ها قرار خواهد گرفت"
                  checked={ladderChecked}
                  onChange={() => setLadderChecked((prev) => !prev)}
                />

                <AdOptionCard
                  title="ویژه"
                  description="آگهی شما با رنگ متمایز نشان داده می شود"
                  checked={specialAdChecked}
                  onChange={() => setSpecialAdChecked((prev) => !prev)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-1 text-gray-400 text-[1.6vh] text-center">
              {paymentMethod === "subscription" && (
                <span>معادل 1 امتیاز اشتراک و یا 100.000 تومان پول</span>
              )}

              {paymentMethod === "wallet" && (
                <span>معادل 100.000 تومان پول</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 items-center w-full justify-center mt-[1vh] sm:mt-1">
            <Button
              onClick={() => setShowPreviousForm(true)}
              className="w-[40%] sm:w-[18%] h-[7vh] rounded-[10px] text-[1.8vh] sm:text-[2.6vh]"
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
              onClick={() => setShowNextForm(true)}
              className="w-[40%] sm:w-[18%] h-[7vh] rounded-[10px] text-[1.8vh] sm:text-[2.6vh]"
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
    </PersonProvider>
  );
};

export default Form4;
