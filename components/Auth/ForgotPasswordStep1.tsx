"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/api/apiClient";
import Input from "./_components/Input";
import FormWrapper from "./_components/FormWrapperL";
import Button from "./_components/Button";

interface ModalState {
  message: string;
  success: boolean;
}

const ForgotPasswordStep1: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [errors, setErrors] = useState({ phone: "", code: "" });

  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => setModal(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  const handleSendCode = async () => {
    if (!phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "شماره تلفن الزامی است" }));
      return;
    }
    if (phone.trim().length < 10) {
      setErrors((prev) => ({ ...prev, phone: "شماره تلفن معتبر نیست" }));
      return;
    }
    setErrors((prev) => ({ ...prev, phone: "" }));
    setLoadingSend(true);
    try {
      const res = await fetch(`${BASE_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), purpose: "reset" }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.msg || "خطا در ارسال کد");
      }
      setModal({ success: true, message: "کد تایید ارسال شد ✅" });
    } catch (err: any) {
      // اگر خطا مربوط به "یافت نشد" باشد فقط مدال نمایش داده شود (بدون لاگ کنسول)
      if (err.message?.includes("یافت نشد")) {
        setModal({ success: false, message: err.message });
      } else {
        console.error(err);
        setModal({
          success: false,
          message: err.message || "ارسال کد موفق نبود",
        });
      }
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setErrors((prev) => ({ ...prev, code: "کد تایید الزامی است" }));
      return;
    }
    if (code.trim().length !== 5) {
      setErrors((prev) => ({ ...prev, code: "کد تایید باید 5 رقمی باشد" }));
      return;
    }
    setErrors((prev) => ({ ...prev, code: "" }));
    setLoadingVerify(true);
    try {
      const res = await fetch(`${BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          code: code.trim(),
          purpose: "reset",
        }),
      });
      const data = await res.json();

      if (!res.ok || data?.success === false || data?.error) {
        throw new Error(data?.msg || data?.message || "کد اشتباه است");
      }

      if (data.resetToken) {
        sessionStorage.setItem("resetToken", data.resetToken);
      } else {
        throw new Error("توکن ریست دریافت نشد");
      }

      router.push("/forgotpassword2");
    } catch (err: any) {
      // اگر خطا مربوط به "یافت نشد" باشد فقط مدال نمایش داده شود (بدون لاگ کنسول)
      if (err.message?.includes("یافت نشد")) {
        setModal({ success: false, message: err.message });
      } else {
        console.error(err);
        setModal({
          success: false,
          message: err.message || "تایید کد موفق نبود",
        });
      }
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <FormWrapper backLinkDesktop="/" backLinkMobile="/">
      <h2 className="text-[30px] font-bold mb-6 text-[#143A62] text-center">
        تغییر رمز عبور
      </h2>

      <div className="flex items-center gap-2 w-[90%] mx-auto mb-4">
        <div className="flex-1">
          <Input
            type="tel"
            placeholder="شماره تلفن"
            icon="/images/tel_icon.svg"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            error={errors.phone}
            touched={true}
            className="!w-full"
          />
        </div>
        <Button
          onClick={handleSendCode}
          disabled={loadingSend}
          className="bg-[#143A62] text-white whitespace-nowrap px-4 h-[42px] !text-[1.8vh] md:!text-[2.6vh] !w-[25%] md:!w-[30%]"
        >
          {loadingSend ? "در حال ارسال..." : "ارسال کد"}
        </Button>
      </div>

      <Input
        type="text"
        placeholder="کد تایید"
        icon="/images/tel_icon.svg"
        className="mb-6 !w-[90%] mx-auto"
        value={code}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "").slice(0, 5);
          setCode(val);
          if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
        }}
        error={errors.code}
        touched={true}
      />

      <Button
        className="mb-4 !w-[90%] mx-auto"
        onClick={handleVerifyCode}
        disabled={loadingVerify}
      >
        {loadingVerify ? "در حال تایید..." : "تایید"}
      </Button>

      <div className="!w-[90%] max-w-[500px] flex justify-start mx-auto mt-2">
        <Link
          href="/"
          className="cursor-pointer font-medium text-[15px] text-[#143A62] sm:text-[20px]"
        ></Link>
      </div>

      {modal && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg text-white z-50"
          style={{ backgroundColor: modal.success ? "#38a169" : "#e53e3e" }}
        >
          <p className="font-bold text-center">{modal.message}</p>
          <button
            type="button"
            onClick={() => setModal(null)}
            className="absolute top-2 right-2 text-gray-200 hover:text-white font-bold"
          >
            ×
          </button>
        </div>
      )}
    </FormWrapper>
  );
};

export default ForgotPasswordStep1;
