// ActiveSubscriptionDisplay.tsx
import React from "react";
import { Subscription } from "@/api/apiPlans";

interface ActiveSubscriptionDisplayProps {
  subscription: Subscription;
}

const ActiveSubscriptionDisplay: React.FC<ActiveSubscriptionDisplayProps> = ({
  subscription,
}) => {
  const plan = subscription.planSnapshot;
  const planType = plan.planType;
  const duration = plan.durationMonths;

  let planName = "",
    color = "",
    bgGradient = "";
  switch (planType) {
    case "gold":
      planName = "طلایی";
      color = "#D4AF37";
      bgGradient = "linear-gradient(135deg, #FFF8E7, #F9E6B3)";
      break;
    case "silver":
      planName = "نقره‌ای";
      color = "#A0A0A0";
      bgGradient = "linear-gradient(135deg, #F5F5F5, #E0E0E0)";
      break;
    case "basic":
      planName = "برنزی";
      color = "#CD7F32";
      bgGradient = "linear-gradient(135deg, #FDF3E7, #F2D8C2)";
      break;
    default:
      planName = planType;
      color = "#143A62";
      bgGradient = "linear-gradient(135deg, #E8F0F8, #D0E2F0)";
  }
  const durationText =
    duration === 1 ? "یک‌ماهه" : duration === 3 ? "سه‌ماهه" : "شش‌ماهه";
  const startDate = new Date(subscription.startDate).toLocaleDateString(
    "fa-IR",
  );
  const endDate = new Date(subscription.endDate).toLocaleDateString("fa-IR");

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        className="max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        style={{ background: bgGradient }}
      >
        <div className="p-6 sm:p-8 text-center">
          <div className="mb-4">
            <span
              className="inline-block px-6 py-2 rounded-full text-lg sm:text-xl font-bold shadow-md"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              اشتراک فعال
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143A62] mb-4">
            پلن {planName} {durationText}
          </h2>
          <div className="space-y-3 text-right pr-4 sm:pr-12 text-gray-700">
            <p className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold">مبلغ پرداختی:</span>
              <span>{plan.price.toLocaleString("fa-IR")} تومان</span>
            </p>
            <p className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold">تاریخ شروع:</span>
              <span>{startDate}</span>
            </p>
            <p className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold">تاریخ پایان:</span>
              <span>{endDate}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">وضعیت:</span>
              <span className="text-green-600 font-bold">فعال</span>
            </p>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            در صورت نیاز به تمدید یا تغییر پلن، با پشتیبانی تماس بگیرید.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSubscriptionDisplay;
