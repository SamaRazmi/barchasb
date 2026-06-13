// components/DepositContent.tsx
import React, { useState } from "react";

interface DepositContentProps {
  onBack: () => void; // فراخوانی برای بازگشت به کیف پول
}

const DepositContent: React.FC<DepositContentProps> = ({ onBack }) => {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("لطفاً مبلغ معتبر وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("لطفاً وارد شوید.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Admin_URL}/wallet/deposit`,
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
        const errData = await response.json();
        throw new Error(errData.message || "خطا در واریز وجه");
      }

      alert("عملیات واریز با موفقیت انجام شد.");
      onBack(); // بازگشت به صفحه کیف پول
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
      {/* دکمه بازگشت (فلش به عقب) در بالا سمت چپ */}
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

      {/* محتوای اصلی */}
      <div className="relative flex flex-col items-center justify-center space-y-[4vh] sm:space-y-[10vh] w-full max-w-[600px] md:max-w-[500px] sm:max-w-[400px]">
        <div className="text-[#143A62] font-bold text-[15px] md:text-[18px] sm:text-[16px]">
          افزایش حساب
        </div>

        {/* فیلد ورودی مبلغ */}
        <div className="w-full max-w-[300px] md:max-w-[250px] sm:max-w-[200px]">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="مبلغ واریزی (به تومان)"
            className="w-full px-4 py-3 text-center text-[#143A62] font-bold text-[16px] bg-[#143A620D] rounded-xl outline-none focus:ring-2 focus:ring-[#143A62] border border-transparent focus:border-[#143A62] transition"
            dir="rtl"
          />
        </div>

        {/* دکمه تایید */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-[#143A62E5] text-white font-bold text-lg md:text-base sm:text-sm py-3 px-8 rounded-xl w-[50%] transition hover:bg-[#143A62] disabled:opacity-50"
        >
          {loading ? "در حال واریز..." : "تایید"}
        </button>
      </div>
    </div>
  );
};

export default DepositContent;
