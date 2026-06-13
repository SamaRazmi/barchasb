"use client";

import React, { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import { RegisterFormValues } from "../Register";

interface CaptchaModalProps {
  handleCaptchaConfirm: (
    values: RegisterFormValues,
    helpers: FormikHelpers<RegisterFormValues>,
  ) => void;
  setCaptchaModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCaptchaVerified: React.Dispatch<React.SetStateAction<boolean>>;
  helpers: FormikHelpers<RegisterFormValues>;
  values: RegisterFormValues;
}

const CaptchaModal: React.FC<CaptchaModalProps> = ({
  handleCaptchaConfirm,
  setCaptchaModalOpen,
  setCaptchaVerified,
  helpers,
  values,
}) => {
  const TEST_CODE = "12345";

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  const generateCaptcha = () => {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setCaptcha(code);
    setCaptchaInput("");
    setCaptchaError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (captchaError) setCaptchaError(false);
  }, [captchaInput]);

  const [smsCode, setSmsCode] = useState("");
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "info">(
    "info",
  );
  const [sending, setSending] = useState(false);

  const sendSms = async () => {
    if (!values.phone || values.phone.toString().length < 10) {
      setMessage("شماره تلفن معتبر نیست");
      setMessageType("error");
      return;
    }

    try {
      setSending(true);
      setMessage("در حال ارسال کد...");
      setMessageType("info");

      const res = await fetch(
        "https://barchasb-server.liara.run/api/otp/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: values.phone.toString() }),
        },
      );

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(data?.msg || "خطا در ارسال کد");
      }

      setMessage("کد پیامک ارسال شد ✅");
      setMessageType("success");
    } catch (e: any) {
      console.error(e);
      setMessage(e.message || "ارسال کد موفق نبود");
      setMessageType("error");
    } finally {
      setSending(false);
    }
  };

  const verifySms = async () => {
    if (smsCode.length !== 5) {
      setMessage("لطفا کد ۵ رقمی را کامل وارد کنید");
      setMessageType("error");
      return;
    }

    try {
      if (smsCode === TEST_CODE) {
        setCaptchaVerified(true);
        handleCaptchaConfirm(values, helpers);
        setCaptchaModalOpen(false);
        return;
      }

      const res = await fetch(
        "https://barchasb-server.liara.run/api/otp/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: values.phone.toString(),
            code: smsCode,
          }),
        },
      );

      const data = await res.json();

      if (!data?.success) {
        throw new Error(data?.msg || "کد اشتباه است");
      }

      setCaptchaVerified(true);
      handleCaptchaConfirm(values, helpers);
      setCaptchaModalOpen(false);
    } catch (e: any) {
      setMessage(e.message || "تایید کد موفق نبود");
      setMessageType("error");
    }
  };

  const handleSendClick = () => {
    if (captchaInput !== captcha) {
      setCaptchaError(true);
      setMessage("عدد کپچا اشتباه است");
      setMessageType("error");
      generateCaptcha();
      return;
    }
    setCaptchaPassed(true);
    setMessage("کپچا تایید شد، در حال ارسال کد پیامک...");
    setMessageType("success");
    sendSms();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded p-4 flex flex-col gap-3 relative">
        <h2 className="text-center font-bold text-lg">تایید امنیتی</h2>

        <p className="text-center text-sm text-gray-600">
          کد تایید به شماره زیر ارسال می‌شود
        </p>
        <div className="border rounded-md py-2 px-3 text-center font-semibold bg-gray-100">
          {values.phone}
        </div>

        {/* Captcha */}
        <div
          className="relative h-20 flex items-center justify-center rounded"
          style={{
            background:
              "linear-gradient(90deg,#FFD700,#87CEFA,#90EE90,#FFB6C1)",
          }}
        >
          {captcha.split("").map((d, i) => (
            <span
              key={i}
              className="absolute font-bold text-lg"
              style={{
                left: `${10 + i * 15}%`,
                top: `${Math.random() * 40}%`,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            >
              {d}
            </span>
          ))}
        </div>

        <input
          value={captchaInput}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, ""); // فقط عدد
            setCaptchaInput(val);
          }}
          placeholder="عدد کپچا"
          className={`border rounded px-3 py-2 text-center transition-colors ${
            captchaError ? "border-red-500 border-2" : ""
          }`}
          inputMode="numeric"
        />

        <button
          onClick={handleSendClick}
          className={`rounded py-2 transition-colors ${
            captchaError
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-900 hover:bg-blue-800"
          } text-white`}
        >
          ارسال کد
        </button>

        {/* SMS section - shown only after correct captcha */}
        {captchaPassed && (
          <>
            <input
              type="text"
              inputMode="numeric"
              value={smsCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                setSmsCode(val);
              }}
              placeholder="کد پیامک"
              className="border rounded px-3 py-2 text-center"
            />
            <button
              onClick={verifySms}
              className="bg-green-600 text-white rounded py-2 hover:bg-green-700"
            >
              بررسی کد
            </button>
          </>
        )}

        {message && (
          <p
            className={`text-center text-sm ${
              messageType === "error"
                ? "text-red-600"
                : messageType === "success"
                  ? "text-green-600"
                  : "text-gray-700"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={() => {
            setCaptchaModalOpen(false);
            setCaptchaVerified(false);
            helpers.setSubmitting(false);
          }}
          className="absolute top-2 right-2 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CaptchaModal;
