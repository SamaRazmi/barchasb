// NoSubscriptionView.tsx
import React from "react";

interface NoSubscriptionViewProps {
  onBuyClick: () => void;
}

const NoSubscriptionView: React.FC<NoSubscriptionViewProps> = ({
  onBuyClick,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center flex-col">
      <img
        src="/images/plans_bg_billing.svg"
        alt="Plans Background"
        className="mb-[12vh]"
        loading="lazy"
        style={{ height: "55vh", width: "80vh" }}
      />
      <div className="absolute top-1/2 transform -translate-y-1/2 text-[#143A62] font-bold text-[2svh] sm:text-[3.6vh] mt-[-11%] sm:mt-[-3%]">
        اشتراک ندارید!!
      </div>
      <div className="absolute bottom-[6vh] left-1/2 transform -translate-x-1/2">
        <button
          onClick={onBuyClick}
          className="bg-[#143A62E5] text-white font-bold text-[2svh] sm:text-[3vh] py-3 px-8 rounded-xl"
        >
          خرید اشتراک
        </button>
      </div>
    </div>
  );
};

export default NoSubscriptionView;
