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
      flex flex-col sm:flex-row 
      items-center sm:items-start 
      mt-1 sm:mt-[1%] 
      h-[99svh] bg-[#F5F5F5] rounded-[20px] gap-3
      "
    >
      {/* منوی سمت چپ (سه گزینه) */}
      <div
        className="
        flex justify-center items-center 
        w-[95%] sm:w-1/3
        h-[10svh] sm:h-full  
        gap-3 sm:gap-[2.5vh]
        flex-row sm:flex-col
        "
      >
        {/* Plans */}
        <div
          onClick={() => handleTabChange("plans")}
          className="
          w-[30%] sm:w-[22vh] 
          h-full sm:h-[22vh] 
          bg-white shadow-[0px_0px_8px_0px_#00000026] rounded-[20px] cursor-pointer 
          flex flex-col justify-center items-center
          py-4 sm:py-2
          "
        >
          <img
            src="/images/plans_billing.svg"
            alt="Plans"
            loading="lazy"
            className="w-[5vh] h-[4vh] sm:w-[22vh] sm:h-[12vh] object-contain"
          />
          <div className="text-center mt-2 text-[#143A62] font-semibold text-[1.2vh] sm:text-[2.4vh]">
            اشتراک
          </div>
        </div>

        {/* Wallet */}
        <div
          onClick={() => handleTabChange("wallet")}
          className="
          w-[30%] sm:w-[22vh] 
          h-full sm:h-[22vh]  
          bg-white shadow-[0px_0px_8px_0px_#00000026] rounded-[20px] cursor-pointer 
          flex flex-col justify-center items-center
          py-4 sm:py-2
          "
        >
          <img
            src="/images/wallet_billing.svg"
            alt="Wallet"
            loading="lazy"
            className="w-[5vh] h-[4vh] sm:w-[20vh] sm:h-[10vh] object-contain"
          />
          <div className="text-center mt-2 text-[#143A62] font-semibold text-[1.2vh] sm:text-[2.4vh]">
            کیف پول
          </div>
        </div>

        {/* Transactions */}
        <div
          onClick={() => handleTabChange("transactions")}
          className="
          w-[30%] sm:w-[22vh] 
          h-full sm:h-[22vh] 
          bg-white shadow-[0px_0px_8px_0px_#00000026] rounded-[20px] cursor-pointer 
          flex flex-col justify-center items-center
          py-4 sm:py-2
          "
        >
          <img
            src="/images/transactions_billing.svg"
            alt="Transactions"
            loading="lazy"
            className="w-[5vh] h-[4vh] sm:w-[20vh] sm:h-[10vh] object-contain"
          />
          <div className="text-center mt-2 text-[#143A62] font-semibold text-[1.2vh] sm:text-[2.4vh]">
            تراکنش‌ها
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div
        className="
        w-[95%] sm:w-2/3  
        h-[calc(100svh-58svh)] sm:h-[70vh]
        bg-white shadow-[1px_1px_8px_0px_#00000033] 
        rounded-[20px] flex items-center justify-center
        sm:ml-[4%] sm:mr-[5%] my-2 sm:my-[4vh]
        "
      >
        {renderMainContent()}
      </div>
    </div>
  );
};

export default BillingContent;
