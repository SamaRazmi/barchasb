"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "./_components/Input";
import FormWrapper from "./_components/FormWrapperL";
import Button from "./_components/Button";
import { useResetPassword } from "@/api/authApi";
import Link from "next/link";

interface ModalState {
  message: string;
  success: boolean;
}

const ForgotPasswordStep2: React.FC = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const resetPasswordMutation = useResetPassword();

  // بررسی وجود resetToken در sessionStorage
  useEffect(() => {
    const resetToken = sessionStorage.getItem("resetToken");
    if (!resetToken) {
      router.push("/forgotpassword1");
    }
  }, [router]);

  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => setModal(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  const handleResetPassword = async () => {
    let hasError = false;
    const newErrors = { newPassword: "", confirmPassword: "" };
    if (!newPassword.trim()) {
      newErrors.newPassword = "رمز عبور جدید الزامی است";
      hasError = true;
    } else if (newPassword.trim().length < 6) {
      newErrors.newPassword = "رمز عبور باید حداقل 6 کاراکتر باشد";
      hasError = true;
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "تکرار رمز عبور الزامی است";
      hasError = true;
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    setErrors({ newPassword: "", confirmPassword: "" });

    const resetToken = sessionStorage.getItem("resetToken");
    if (!resetToken) {
      setModal({
        success: false,
        message: "اطلاعات جلسه منقضی شده است. لطفا دوباره تلاش کنید.",
      });
      setTimeout(() => router.push("/forgotpassword1"), 2000);
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: newPassword.trim(),
      });
      sessionStorage.removeItem("resetToken");
      setModal({ success: true, message: "رمز عبور با موفقیت تغییر کرد ✅" });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      console.error(err);
      setModal({
        success: false,
        message: err.message || "خطا در ارتباط با سرور",
      });
    }
  };

  return (
    <FormWrapper backLinkDesktop="/" backLinkMobile="/forgotpassword1">
      <h2 className="text-[30px] font-bold mb-6 text-[#143A62] text-center">
        تغییر رمز عبور
      </h2>

      <Input
        type="password"
        placeholder="رمز عبور جدید"
        icon="/images/pass_icon.svg"
        className="mb-4 !w-[90%] mx-auto"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          if (errors.newPassword)
            setErrors((prev) => ({ ...prev, newPassword: "" }));
        }}
        error={errors.newPassword}
        touched={true}
      />

      <Input
        type="password"
        placeholder="تکرار رمز عبور"
        icon="/images/pass_icon.svg"
        className="mb-6 !w-[90%] mx-auto"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (errors.confirmPassword)
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }}
        error={errors.confirmPassword}
        touched={true}
      />

      <Button
        className="mb-4 !w-[90%] mx-auto"
        onClick={handleResetPassword}
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? "در حال تغییر رمز..." : "تایید"}
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

export default ForgotPasswordStep2;
