"use client";
import React from "react";

interface RadialMenuBottomRightProps {
  onClick: (option: string) => void;
}

const RadialMenuBottomRight: React.FC<RadialMenuBottomRightProps> = ({
  onClick,
}) => {
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <div className="relative w-20 h-20">
        <div className="absolute bottom-0 right-0 opacity-100 scale-100 transition-all duration-500">
          <div className="relative">
            {/* لایه ۴ - اشتراک */}
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                transform: "translate(-5px, -212px)",
                width: "100px",
                height: "140px",
                backgroundImage: "url('/images/layer4.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                filter:
                  "drop-shadow(-10px -60px 30px rgba(255, 255, 255, 0.3))",
              }}
              onClick={() => onClick("اشتراک")}
            >
              <img
                src="/images/subscription-resicon.svg"
                width={26}
                height={26}
                alt="اشتراک"
              />
            </div>

            <div
              className="absolute text-white font-bold text-sm"
              style={{ transform: "translate(-65px, -220px)" }}
            >
              اشتراک
            </div>

            {/* لایه ۵ - آگهی‌ها */}
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                transform: "translate(-66px, -202px)",
                width: "110px",
                height: "185px",
                backgroundImage: "url('/images/layer5.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                filter: "drop-shadow(-50px -40px 40px rgba(255, 140, 0, 0.8))",
              }}
              onClick={() => onClick("آگهی‌ها")}
            >
              <img
                src="/images/ads-resicon.svg"
                width={26}
                height={26}
                alt="آگهی‌ها"
              />
            </div>

            <div
              className="absolute text-white font-bold text-sm"
              style={{ transform: "translate(-160px, -155px)" }}
            >
              آگهی‌ها
            </div>

            {/* لایه ۶ - ذخیره‌ها */}
            <div
              className="absolute flex items-center justify-center cursor-pointer"
              style={{
                transform: "translate(-102px, -114px)",
                width: "95px",
                height: "140px",
                backgroundImage: "url('/images/layer6.svg')",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                filter:
                  "drop-shadow(-80px -10px 30px rgba(255, 255, 255, 0.3))",
              }}
              onClick={() => onClick("ذخیره‌ها")}
            >
              <img
                src="/images/save-resicon.svg"
                width={22}
                height={18}
                alt="ذخیره‌ها"
              />
            </div>

            <div
              className="absolute text-white font-bold text-sm"
              style={{ transform: "translate(-220px, -50px)" }}
            >
              ذخیره‌ها
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadialMenuBottomRight;
