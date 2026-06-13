import React, { useState, useEffect } from "react";
import { getWalletBalance } from "@/api/apiWallet";
// اضافه کردن نوع props
interface WalletContentProps {
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
}

const WalletContent: React.FC<WalletContentProps> = ({
  onDepositClick,
  onWithdrawClick,
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        // استفاده از API به جای fetch مستقیم
        const data = await getWalletBalance();
        setBalance(data.balance);
        setError(null);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "مشکل در ارتباط با سرور.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="relative w-full h-full rounded-[20px] shadow-[1px_1px_8px_0px_#00000033] overflow-hidden flex items-center justify-center py-16">
      <img
        src="/images/bg_wallet_billing.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="relative flex flex-col items-center justify-center space-y-[4vh] sm:space-y-[10vh] w-full max-w-[600px] md:max-w-[500px] sm:max-w-[400px]">
        <div className="text-[#143A62] font-bold text-[15px] md:text-[18px] sm:text-[16px]">
          موجودی حساب:
        </div>
        <div className="bg-[#143A620D] w-full max-w-[300px] md:max-w-[250px] sm:max-w-[200px] flex items-center justify-center p-4 rounded-xl">
          <div className="w-[80%] flex justify-center items-center text-[#143A62] font-bold text-[20px] md:text-[18px] sm:text-[16px]">
            <div className="border-l-2 border-solid border-image-source-[linear-gradient(180deg,_rgba(20,_58,_98,_0)_0%,_rgba(20,_58,_98,_0.5)_46.15%,_rgba(20,_58,_98,_0)_100%)] h-full pl-10 flex justify-center items-center">
              {loading ? (
                "در حال بارگذاری..."
              ) : error ? (
                <span className="text-red-500 text-sm">{error}</span>
              ) : balance !== null ? (
                formatNumber(balance)
              ) : (
                "۰"
              )}
            </div>
          </div>
          <div className="w-[20%] text-[#143A62] font-bold text-[20px] md:text-[18px] sm:text-[16px] flex items-center justify-center">
            تومان
          </div>
        </div>
        <div className="flex w-full max-w-[300px] md:max-w-[250px] sm:max-w-[200px] justify-between">
          <button
            onClick={onWithdrawClick}
            className="bg-[#143A62E5] text-white font-bold text-lg md:text-base sm:text-sm py-3 px-8 rounded-xl w-[120px]"
          >
            برداشت
          </button>
          <button
            onClick={onDepositClick}
            className="bg-[#143A62E5] text-white font-bold text-lg md:text-base sm:text-sm py-3 px-8 rounded-xl w-[120px]"
          >
            واریز
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletContent;
