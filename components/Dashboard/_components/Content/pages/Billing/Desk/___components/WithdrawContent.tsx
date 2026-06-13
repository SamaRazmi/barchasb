// components/WithdrawContent.tsx
import React, { useState } from "react";

interface WithdrawContentProps {
  onBack: () => void; // بازگشت به کیف پول
}

const WithdrawContent: React.FC<WithdrawContentProps> = ({ onBack }) => {
  const [amount, setAmount] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendCode = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("لطفاً ابتدا مبلغ معتبر وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("لطفاً وارد شوید.");

      // درخواست ارسال کد تایید (API فرضی)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Admin_URL}/wallet/withdraw/send-code`,
        {
          method: "POST",
          headers: {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: Number(amount) }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "خطا در ارسال کد");
      }

      alert("کد تایید به شماره موبایل شما ارسال شد.");
      setCodeSent(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "مشکل در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!codeSent) {
      alert("لطفاً ابتدا درخواست ارسال کد کنید.");
      return;
    }
    if (!verificationCode || verificationCode.length < 4) {
      alert("لطفاً کد تایید معتبر وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("لطفاً وارد شوید.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Admin_URL}/wallet/withdraw/confirm`,
        {
          method: "POST",
          headers: {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(amount),
            verificationCode: verificationCode,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "خطا در برداشت وجه");
      }

      alert("برداشت با موفقیت انجام شد.");
      onBack(); // بازگشت به کیف پول
    } catch (error: any) {
      console.error(error);
      alert(error.message || "مشکل در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full rounded-[20px] shadow-[1px_1px_8px_0px_#00000033] overflow-hidden flex items-center justify-center py-16">
      {/* تصویر پس‌زمینه یکسان */}
      <img
        src="/images/bg_wallet_billing.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* فلش بازگشت (بالا سمت چپ) */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
        aria-label="بازگشت"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#143A62]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* محتوای برداشت */}
      <div className="relative flex flex-col items-center justify-center space-y-[4vh] sm:space-y-[10vh] w-full max-w-[600px] md:max-w-[500px] sm:max-w-[400px]">
        <div className="text-[#143A62] font-bold text-[15px] md:text-[18px] sm:text-[16px]">
          برداشت از حساب:
        </div>

        {/* فیلد مبلغ برداشت */}
        <div className="w-full max-w-[300px] md:max-w-[250px] sm:max-w-[200px]">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="مبلغ برداشت (به تومان)"
            className="w-full px-4 py-3 text-center text-[#143A62] font-bold text-[16px] bg-[#143A620D] rounded-xl outline-none focus:ring-2 focus:ring-[#143A62]"
            dir="rtl"
          />
        </div>

        {/* ردیف ارسال کد + ورودی کد تایید */}
        <div className="flex flex-row items-center w-full max-w-[300px] md:max-w-[250px] sm:max-w-[200px]">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="کد تایید پیامک شده"
            className="flex-1 px-3 py-2 text-center text-[#143A62] bg-[#143A620D] rounded-r-xl outline-none focus:ring-2 focus:ring-[#143A62] text-sm"
            dir="rtl"
          />
          <button
            onClick={handleSendCode}
            disabled={loading || codeSent}
            className="bg-[#143A62E5] text-white font-bold text-sm py-2.5 px-4 rounded-l-xl hover:bg-[#143A62] transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "..." : "ارسال کد"}
          </button>
        </div>

        {/* دکمه تایید نهایی */}
        <button
          onClick={handleConfirmWithdraw}
          disabled={loading}
          className="bg-[#143A62E5] text-white font-bold text-lg md:text-base sm:text-sm py-3 px-8 rounded-xl w-[50%] transition hover:bg-[#143A62] disabled:opacity-50"
        >
          {loading ? "در حال پردازش..." : "تایید"}
        </button>
      </div>
    </div>
  );
};

export default WithdrawContent;
