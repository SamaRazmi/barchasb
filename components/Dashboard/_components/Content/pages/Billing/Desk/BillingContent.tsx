import React, { useState } from "react";
import PlansContent from "./___components/PlansContent";
import WalletContent from "./___components/WalletContent";
import TransactionsContent from "./___components/TransactionsContent";
import DepositContent from "./___components/DepositContent";
import WithdrawContent from "./___components/WithdrawContent";

type WalletSubview = "main" | "deposit" | "withdraw";

const BillingContent: React.FC = () => {
  const [activeContent, setActiveContent] = useState<
    "plans" | "wallet" | "transactions"
  >("plans");
  const [walletView, setWalletView] = useState<WalletSubview>("main");

  const handleDepositClick = () => setWalletView("deposit");
  const handleWithdrawClick = () => setWalletView("withdraw");
  const handleBackToWallet = () => setWalletView("main");

  const handleTabChange = (tab: "plans" | "wallet" | "transactions") => {
    setActiveContent(tab);
    setWalletView("main");
  };

  const renderMainContent = () => {
    if (activeContent !== "wallet") {
      return activeContent === "plans" ? (
        <PlansContent />
      ) : (
        <TransactionsContent />
      );
    }

    switch (walletView) {
      case "deposit":
        return <DepositContent onBack={handleBackToWallet} />;
      case "withdraw":
        return <WithdrawContent onBack={handleBackToWallet} />;
      default:
        return (
          <WalletContent
            onDepositClick={handleDepositClick}
            onWithdrawClick={handleWithdrawClick}
          />
        );
    }
  };

  return (
    <div
      className="
      flex flex-col md:flex-row 
      items-center md:items-start 
      mt-1 md:mt-[1%] 
      h-[99svh] bg-[#F5F5F5] rounded-[20px] gap-3
      "
    >
      {/* استایل active: بزرگ‌تر شدن عکس و متن + پررنگ‌تر */}
      <style>{`
        .active-tab {
          box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3) !important;
        }
        .active-tab img {
          transform: scale(1.08);
          transition: transform 0.2s ease;
        }
        .active-tab .text-center {
          font-size: 1.4vh !important;
          font-weight: 800 !important;
          color: #0A2A4A !important;
        }
        @media (min-width: 768px) {
          .active-tab .text-center {
            font-size: 2.6vh !important;
          }
        }
      `}</style>

      {/* منوی سمت چپ (سه گزینه) */}
      <div
        className="
        flex justify-center items-center 
        w-[95%] md:w-1/3
        h-[10svh] md:h-full  
        gap-3 md:gap-[2.5vh]
        flex-row md:flex-col
        "
      >
        {/* Plans */}
        <div
          onClick={() => handleTabChange("plans")}
          className={`
          w-[30%] md:w-[22vh] 
          h-full md:h-[22vh] 
          bg-white shadow-[0px_0px_8px_0px_#00000026] rounded-[20px] cursor-pointer 
          flex flex-col justify-center items-center
          py-4 md:py-2
          ${activeContent === "plans" ? "active-tab" : ""}
          `}
        >
          <img
            src="/images/plans_billing.svg"
            alt="Plans"
            loading="lazy"
            className="w-[5vh] h-[4vh] md:w-[22vh] md:h-[12vh] object-contain"
          />
          <div className="text-center mt-2 text-[#143A62] font-semibold text-[1.2vh] md:text-[2.4vh]">
            اشتراک
          </div>
        </div>

        {/* Wallet */}
        <div
          onClick={() => handleTabChange("wallet")}
          className={`
          w-[30%] md:w-[22vh] 
          h-full md:h-[22vh]  
          bg-white shadow-[0px_0px_8px_0px_#00000026] rounded-[20px] cursor-pointer 
          flex flex-col justify-center items-center
          py-4 md:py-2
          ${activeContent === "wallet" ? "active-tab" : ""}
          `}
        >
          <img
            src="/images/wallet_billing.svg"
            alt="Wallet"
            loading="lazy"
            className="w-[5vh] h-[4vh] md:w-[20vh] md:h-[10vh] object-contain"
          />
          <div className="text-center mt-2 text-[#143A62] font-semibold text-[1.2vh] md:text-[2.4vh]">
            کیف پول
          </div>
        </div>

        {/* Transactions */}
        <div
          onClick={() => handleTabChange("transactions")}
          className={`
          w-[30%] md:w-[22vh] 
          h-full md:h-[22vh] 
          bg-white shadow-[0px_0px_8px_0px_#00000026] rounded-[20px] cursor-pointer 
          flex flex-col justify-center items-center
          py-4 md:py-2
          ${activeContent === "transactions" ? "active-tab" : ""}
          `}
        >
          <img
            src="/images/transactions_billing.svg"
            alt="Transactions"
            loading="lazy"
            className="w-[5vh] h-[4vh] md:w-[20vh] md:h-[10vh] object-contain"
          />
          <div className="text-center mt-2 text-[#143A62] font-semibold text-[1.2vh] md:text-[2.4vh]">
            تراکنش‌ها
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div
        className="
        w-[95%] md:w-2/3  
        h-[calc(100svh-58svh)] md:h-[70vh]
        bg-white shadow-[1px_1px_8px_0px_#00000033] 
        rounded-[20px] flex items-center justify-center
        md:ml-[4%] md:mr-[5%] my-2 md:my-[4vh]
        "
      >
        {renderMainContent()}
      </div>
    </div>
  );
};

export default BillingContent;
