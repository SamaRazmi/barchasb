"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormWrapper from "./_components/FormWrapperL";
import Input from "./_components/Input";
import Button from "./_components/Button";
import { useDispatch, useSelector } from "react-redux";
import { userLogedTrue } from "@/store/slices/logedSlice";
import type { RootState } from "@/store/store";
import { useLogin } from "@/api/authApi";
import CaptchaModal from "./_components/CaptchaModal";

interface ModalState {
  message: string;
  success: boolean;
}

interface CaptchaFormValues {
  phone: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const logedVal = useSelector((state: RootState) => state.loged.value);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState({ phone: "", password: "" });
  const [previousPath, setPreviousPath] = useState("/");

  const loginMutation = useLogin();

  // گرفتن مسیر قبلی از referrer در اولین رندر
  useEffect(() => {
    if (typeof window !== "undefined" && document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        if (
          referrerUrl.origin === window.location.origin &&
          !referrerUrl.pathname.includes("/login") &&
          !referrerUrl.pathname.includes("/register")
        ) {
          setPreviousPath(referrerUrl.pathname + referrerUrl.search);
        }
      } catch (e) {
        console.warn("خطا در پردازش referrer", e);
      }
    }
  }, []);

  // اگر قبلاً لاگین است به داشبورد برود
  useEffect(() => {
    if (logedVal === 1) {
      router.push("/dashboard");
    }
  }, [logedVal, router]);

  // تابع اصلی لاگین
  const performLogin = async () => {
    try {
      const data = await loginMutation.mutateAsync({ phone, password });

      let token = null;
      if (data.token) token = data.token;
      else if (data.accessToken) token = data.accessToken;
      else if (data.access_token) token = data.access_token;
      else if (data.data?.token) token = data.data.token;

      if (!token) {
        console.error("❌ توکن در پاسخ یافت نشد!");
        setModal({ success: false, message: "خطا: توکن دریافت نشد" });
        return false;
      }

      localStorage.setItem("token", token);
      dispatch(
        userLogedTrue({
          name: data.user?.name || "",
          lastName: data.user?.lastName || "",
        }),
      );

      setModal({ success: true, message: "ورود موفق ✅" });
      router.push("/dashboard");
      return true;
    } catch (err: any) {
      console.error("❌ خطای ورود:", err);
      setModal({
        success: false,
        message: err.message || "خطا در اتصال به سرور",
      });
      return false;
    }
  };

  const handleCaptchaConfirm = useCallback(
    async (values: CaptchaFormValues, helpers: any) => {
      await performLogin();
      helpers.setSubmitting(false);
    },
    [phone, password],
  );

  const handleLoginClick = () => {
    const newErrors = { phone: "", password: "" };
    if (!phone.trim()) newErrors.phone = "شماره تلفن الزامی است";
    if (!password.trim()) newErrors.password = "رمز عبور الزامی است";

    setErrors(newErrors);
    if (newErrors.phone || newErrors.password) return;

    setCaptchaModalOpen(true);
  };

  const fakeValues: CaptchaFormValues = { phone };
  const dummyHelpers = {
    setSubmitting: (val: boolean) => {},
    setFieldValue: () => {},
    setFieldTouched: () => {},
    setErrors: () => {},
    resetForm: () => {},
  };

  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => setModal(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  return (
    <FormWrapper backLinkDesktop={previousPath} backLinkMobile={previousPath}>
      <h2 className="text-[30px] font-bold mb-6 text-[#143A62] text-center">
        ورود
      </h2>

      <Input
        type="tel"
        placeholder="شماره تلفن"
        icon="/images/tel_icon.svg"
        className="mb-4 !w-[90%] mx-auto"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
        }}
        error={errors.phone}
        touched={true}
      />

      <Input
        type="password"
        placeholder="رمز عبور"
        icon="/images/pass_icon.svg"
        className="mb-6 !w-[90%] mx-auto"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
        }}
        error={errors.password}
        touched={true}
      />

      <Button
        className="mb-2 !w-[90%] mx-auto"
        onClick={handleLoginClick}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "در حال ورود..." : "ورود"}
      </Button>

      <div className="!w-[90%] max-w-[500px] flex justify-between mx-auto m-1">
        <Link
          href="/forgotpassword1"
          className="cursor-pointer font-medium text-[15px] text-[#143A62] sm:text-[20px]"
        >
          فراموشی رمز عبور
        </Link>
        <span className="cursor-pointer font-medium text-[15px] text-[#143A62] sm:text-[20px]">
          <Link href="/register">ثبت نام</Link>
        </span>
      </div>

      {captchaModalOpen && (
        <CaptchaModal
          handleCaptchaConfirm={handleCaptchaConfirm as any}
          setCaptchaModalOpen={setCaptchaModalOpen}
          setCaptchaVerified={setCaptchaVerified}
          helpers={dummyHelpers as any}
          values={fakeValues as any}
        />
      )}

      {modal && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     p-4 rounded-lg text-white z-50"
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

export default Login;
