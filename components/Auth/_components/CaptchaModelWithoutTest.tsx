"use client";

import React, { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import { RegisterFormValues } from "../Register";

interface CaptchaModalProps {
  handleCaptchaConfirm: (
    values: RegisterFormValues,
    helpers: FormikHelpers<RegisterFormValues>
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
  /* ---------------- CAPTCHA ---------------- */
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    setCaptcha(code);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  /* ---------------- SMS ---------------- */
  const [smsCode, setSmsCode] = useState("");
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  /* ----------- SEND SMS ----------- */
  const sendSms = async () => {
    if (!values.phone || values.phone.toString().length < 10) {
      setMessage("شماره تلفن معتبر نیست");
      return;
    }

    try {
      setSending(true);
      setMessage("در حال ارسال کد...");

      console.log("📤 SEND SMS | phone =", values.phone);

      const res = await fetch(
        "https://barchasb-server.liara.run/api/otp/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: values.phone.toString() }),
        }
      );

      const data = await res.json();
      console.log("📥 SEND SMS | response =", data);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.msg || "خطا در ارسال کد");
      }

      setMessage("کد پیامک ارسال شد ✅");
    } catch (e: any) {
      console.error("❌ SEND SMS ERROR =", e);
      setMessage(e.message || "ارسال کد موفق نبود");
    } finally {
      setSending(false);
    }
  };

  /* ----------- VERIFY SMS ----------- */
  const verifySms = async () => {
    try {
      if (!smsCode) {
        setMessage("لطفا کد پیامک را وارد کنید");
        return;
      }

      console.log("📤 VERIFY SMS | phone =", values.phone);
      console.log("📤 VERIFY SMS | code =", smsCode);

      const res = await fetch(
        "https://barchasb-server.liara.run/api/otp/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: values.phone.toString(),
            code: smsCode,
          }),
        }
      );

      const data = await res.json();
      console.log("📥 VERIFY SMS | response =", data);

      if (data?.msg !== "کد صحیح است، وارد شدید") {
        throw new Error(data?.msg || "کد پیامک اشتباه است");
      }

      // ✅ موفقیت کامل
      setCaptchaVerified(true);
      handleCaptchaConfirm(values, helpers);
      setCaptchaModalOpen(false);
    } catch (e: any) {
      console.error("❌ VERIFY SMS ERROR =", e);
      setMessage(e.message || "تایید کد موفق نبود");
    }
  };

  /* ----------- CAPTCHA CONFIRM ----------- */
  const confirmCaptcha = () => {
    if (captchaInput !== captcha) {
      alert("عدد کپچا اشتباه است");
      generateCaptcha();
      return;
    }
    setCaptchaPassed(true);
    setMessage("کپچا تایید شد، حالا کد پیامک را ارسال کنید");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded p-4 flex flex-col gap-3 relative">
        <h2 className="text-center font-bold text-lg">تایید امنیتی</h2>

        {/* PHONE */}
        <p className="text-center text-sm text-gray-600">
          کد تایید به شماره زیر ارسال می‌شود
        </p>
        <div className="border rounded-md py-2 px-3 text-center font-semibold bg-gray-100">
          {values.phone}
        </div>

        {/* CAPTCHA */}
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
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder="عدد کپچا"
          className="border rounded px-3 py-2 text-center"
        />

        <button
          onClick={confirmCaptcha}
          disabled={captchaInput.length !== 5}
          className="bg-blue-600 text-white rounded py-2"
        >
          تایید کپچا
        </button>

        {/* SMS */}
        {captchaPassed && (
          <>
            <input
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              placeholder="کد پیامک"
              className="border rounded px-3 py-2 text-center"
            />

            <div className="flex gap-2">
              <button
                onClick={sendSms}
                disabled={sending}
                className="flex-1 bg-gray-700 text-white rounded py-2"
              >
                {sending ? "در حال ارسال..." : "ارسال کد"}
              </button>
              <button
                onClick={verifySms}
                className="flex-1 bg-green-600 text-white rounded py-2"
              >
                بررسی کد
              </button>
            </div>
          </>
        )}

        {message && (
          <p className="text-center text-sm text-gray-700">{message}</p>
        )}

        {/* CLOSE */}
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
