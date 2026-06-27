"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "./_components/Input";
import FormWrapper from "./_components/FormWrapperL";
import Button from "./_components/Button";
import { useSendOtp, useVerifyOtp } from "@/api/authApi";

interface ModalState {
  message: string;
  success: boolean;
}

const ForgotPasswordStep1: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [errors, setErrors] = useState({ phone: "", code: "" });

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

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

    try {
      await sendOtpMutation.mutateAsync({
        phone: phone.trim(),
        purpose: "reset",
      });
      setModal({ success: true, message: "کد تایید ارسال شد ✅" });
    } catch (err: any) {
      if (err.message?.includes("یافت نشد")) {
        setModal({ success: false, message: err.message });
      } else {
        console.error(err);
        setModal({
          success: false,
          message: err.message || "ارسال کد موفق نبود",
        });
      }
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

    try {
      const data = await verifyOtpMutation.mutateAsync({
        phone: phone.trim(),
        code: code.trim(),
        purpose: "reset",
      });

      if (data.resetToken) {
        sessionStorage.setItem("resetToken", data.resetToken);
      } else {
        throw new Error("توکن ریست دریافت نشد");
      }

      router.push("/forgotpassword2");
    } catch (err: any) {
      if (err.message?.includes("یافت نشد")) {
        setModal({ success: false, message: err.message });
      } else {
        console.error(err);
        setModal({
          success: false,
          message: err.message || "تایید کد موفق نبود",
        });
      }
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
          disabled={sendOtpMutation.isPending}
          className="bg-[#143A62] text-white whitespace-nowrap px-4 h-[42px] !text-[1.8vh] md:!text-[2.6vh] !w-[25%] md:!w-[30%]"
        >
          {sendOtpMutation.isPending ? "در حال ارسال..." : "ارسال کد"}
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
        disabled={verifyOtpMutation.isPending}
      >
        {verifyOtpMutation.isPending ? "در حال تایید..." : "تایید"}
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
