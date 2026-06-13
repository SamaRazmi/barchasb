// PurchasePlansView.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import { buySubscription, getPlans, Plan } from "@/api/apiPlans";
import type { RootState } from "@/store/store";

// ================= توابع Toast =================
const showPlanToast = (
  planType: "basic" | "silver" | "gold",
  duration: 1 | 3 | 6,
) => {
  const durationText =
    duration === 1 ? "ماهانه" : duration === 3 ? "سه ماهه" : "شش ماهه";
  const planText =
    planType === "gold" ? "طلایی" : planType === "silver" ? "نقره‌ای" : "برنزی";
  const background =
    planType === "gold"
      ? "linear-gradient(135deg,#D4AF37,#F7E27E,#B8860B)"
      : planType === "silver"
        ? "linear-gradient(135deg,#C0C0C0,#ECECEC,#8E8E8E)"
        : "linear-gradient(135deg,#CD7F32,#E6B17A,#8C5523)";

  toast.success(`خرید پلن ${planText} ${durationText} با موفقیت ثبت شد`, {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progressClassName: "!bg-white",
    style: {
      background,
      color: "#fff",
      fontWeight: "bold",
      fontSize: window.innerWidth < 640 ? "2vh" : "2.8vh",
      borderRadius: "2vh",
      minHeight: window.innerWidth < 640 ? "8vh" : "10vh",
      width: window.innerWidth < 640 ? "92vw" : "32vw",
      maxWidth: "420px",
      padding: window.innerWidth < 640 ? "1.2vh" : "1.8vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      direction: "rtl",
      boxShadow: "0 1vh 3vh rgba(0,0,0,0.25)",
    },
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progressClassName: "!bg-white",
    style: {
      background: "linear-gradient(135deg,#B71C1C,#E53935,#7F0000)",
      color: "#fff",
      fontWeight: "bold",
      fontSize: window.innerWidth < 640 ? "2vh" : "2.8vh",
      borderRadius: "2vh",
      minHeight: window.innerWidth < 640 ? "8vh" : "10vh",
      width: window.innerWidth < 640 ? "92vw" : "32vw",
      maxWidth: "430px",
      padding: window.innerWidth < 640 ? "1.2vh" : "1.8vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      direction: "rtl",
      boxShadow: "0 1vh 3vh rgba(183,28,28,0.35)",
    },
  });
};

// ================= مودال تأیید خرید =================
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  plan,
  duration,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plan: Plan | null;
  duration: 1 | 3 | 6;
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !plan) return null;
  const planName =
    plan.planType === "gold"
      ? "طلایی"
      : plan.planType === "silver"
        ? "نقره‌ای"
        : "برنزی";
  const durationText =
    duration === 1 ? "یک‌ماهه" : duration === 3 ? "سه‌ماهه" : "شش‌ماهه";
  const priceFormatted = plan.price.toLocaleString("fa-IR");

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#143A62] mb-4">تأیید خرید</h3>
        <p className="text-gray-700 mb-6">
          آیا از خرید پلن <span className="font-bold">{planName}</span> با مدت{" "}
          <span className="font-bold">{durationText}</span> و مبلغ{" "}
          <span className="font-bold">{priceFormatted} تومان</span> مطمئن هستید؟
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            خیر
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#143A62] text-white rounded-lg hover:bg-[#0e2a4a] transition"
          >
            بلی
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= کارت پلن =================
interface PlanCardProps {
  topImage: string;
  title: string;
  price: string;
  features: string[];
  isCenter: boolean;
  onPurchaseClick: () => void;
  onClickCard: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  topImage,
  title,
  price,
  features,
  isCenter,
  onPurchaseClick,
  onClickCard,
}) => {
  return (
    <div
      onClick={onClickCard}
      className={`
        relative flex flex-col justify-between items-center
        w-full h-full
        px-2 sm:px-3 py-2 sm:py-4
        text-white cursor-pointer transition-all duration-400
        rounded-xl overflow-hidden
        bg-[rgba(0,0,0,0.05)] backdrop-blur-md border border-white/5
        ${isCenter ? "scale-110 z-10 shadow-2xl" : "scale-90 opacity-70 blur-[0.5px]"}
      `}
      style={{ transform: isCenter ? "translateY(-6px)" : "translateY(6px)" }}
    >
      <div className="flex justify-center h-[7vh] sm:h-[9vh]">
        <Image
          src={topImage}
          alt="plan-icon"
          width={55}
          height={55}
          className="object-contain h-full"
        />
      </div>
      <div className="text-center font-bold text-[#143A62] text-[1.6vh] sm:text-[1.8vh] mt-1 mb-1">
        {title}
      </div>
      <div className="flex flex-col items-start gap-0.5 w-full mb-2">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <Image
              src="/images/check_green.svg"
              alt="check"
              width={12}
              height={12}
              className="w-3 h-3"
            />
            <span className="text-black text-[1.2vh] sm:text-[1.4vh]">
              {item}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full text-center">
        <div className="text-[#143A62] font-bold text-[1.6vh] sm:text-[2vh] mb-1">
          {price}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isCenter) onPurchaseClick();
          }}
          disabled={!isCenter}
          className={`w-full font-bold text-[1.3vh] py-1 rounded-lg shadow-md transition
            ${
              isCenter
                ? "bg-[#143A62] text-white hover:bg-[#0e2a4a] cursor-pointer"
                : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
            }
          `}
        >
          خرید اشتراک
        </button>
      </div>
    </div>
  );
};

// ================= فیلتر افقی =================
const HorizontalFilter = ({
  active,
  setActive,
}: {
  active: 1 | 3 | 6;
  setActive: (value: 1 | 3 | 6) => void;
}) => {
  const filters = [
    { id: 1, label: "ماهانه", durationMonths: 1 as const },
    { id: 3, label: "سه ماهه", durationMonths: 3 as const },
    { id: 6, label: "شش ماهه", durationMonths: 6 as const },
  ];
  return (
    <div className="flex justify-center w-full mt-2">
      <div className="flex flex-row justify-around items-center w-full sm:w-[70%] py-1.5 px-4 rounded-xl bg-[#EFEFEF]">
        {filters.map((item) => {
          const isActive = active === item.durationMonths;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.durationMonths)}
              className={`px-4 py-1 rounded-md text-[2vh] sm:text-[2.4vh] font-medium transition ${
                isActive ? "text-[#143A62]" : "text-black/40"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ================= اسلایدر اصلی =================
const PlansSlider: React.FC<{
  plansData: { basic?: Plan; silver?: Plan; gold?: Plan };
  duration: 1 | 3 | 6;
  onRequestPurchase: (plan: Plan) => void;
  onBack: () => void;
}> = ({ plansData, duration, onRequestPurchase, onBack }) => {
  const { basic, silver, gold } = plansData;
  const plansList = [basic, gold, silver];
  const [centerIndex, setCenterIndex] = useState(1);

  const getTopImage = (planType?: string) => {
    switch (planType) {
      case "basic":
        return "/images/bronze_top.svg";
      case "gold":
        return "/images/gold_top.svg";
      case "silver":
        return "/images/silver_top.svg";
      default:
        return "/images/gold_top.svg";
    }
  };

  const getPlanTitle = (type?: string) => {
    if (type === "basic") return "پلن برنزی";
    if (type === "silver") return "پلن نقره‌ای";
    if (type === "gold") return "پلن طلایی";
    return "";
  };

  const getFeatures = (plan?: Plan) => {
    if (!plan) return [];
    const mapKey: Record<string, string> = {
      maxAds: "حداکثر آگهی",
      specialAds: "آگهی ویژه",
      ladder: "نردبان",
      tests: "افزونه تست",
      digitalAds: "آگهی دیجیتال",
      specialDisplay: "نمایش ویژه",
    };
    return Object.entries(plan.limits).map(
      ([k, v]) => `${mapKey[k] || k}: ${v}`,
    );
  };

  const formatPrice = (price?: number) =>
    price ? `${price.toLocaleString("fa-IR")} تومان` : "";

  const leftIndex = (centerIndex - 1 + 3) % 3;
  const rightIndex = (centerIndex + 1) % 3;
  const leftPlan = plansList[leftIndex];
  const centerPlan = plansList[centerIndex];
  const rightPlan = plansList[rightIndex];

  const goPrev = () => setCenterIndex(leftIndex);
  const goNext = () => setCenterIndex(rightIndex);

  if (!basic || !gold || !silver)
    return <div className="text-center py-10">در حال بارگذاری...</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full overflow-hidden">
        <div className="relative flex justify-center items-center h-[48vh] sm:h-[52vh]">
          <div className="absolute left-[-18%] sm:left-[-12%] w-[55%] sm:w-[38%] h-full transition-all duration-500 z-0">
            <PlanCard
              topImage={getTopImage(leftPlan?.planType)}
              title={getPlanTitle(leftPlan?.planType)}
              price={formatPrice(leftPlan?.price)}
              features={getFeatures(leftPlan)}
              isCenter={false}
              onPurchaseClick={() => leftPlan && onRequestPurchase(leftPlan)}
              onClickCard={goPrev}
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 w-[65%] sm:w-[42%] h-full z-20 transition-all duration-500 pb-12">
            <PlanCard
              topImage={getTopImage(centerPlan?.planType)}
              title={getPlanTitle(centerPlan?.planType)}
              price={formatPrice(centerPlan?.price)}
              features={getFeatures(centerPlan)}
              isCenter={true}
              onPurchaseClick={() =>
                centerPlan && onRequestPurchase(centerPlan)
              }
              onClickCard={() => {}}
            />
          </div>

          <div className="absolute right-[-18%] sm:right-[-12%] w-[55%] sm:w-[38%] h-full transition-all duration-500 z-0">
            <PlanCard
              topImage={getTopImage(rightPlan?.planType)}
              title={getPlanTitle(rightPlan?.planType)}
              price={formatPrice(rightPlan?.price)}
              features={getFeatures(rightPlan)}
              isCenter={false}
              onPurchaseClick={() => rightPlan && onRequestPurchase(rightPlan)}
              onClickCard={goNext}
            />
          </div>

          <button
            onClick={onBack}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 px-8 py-2 rounded-lg text-base sm:text-lg font-bold bg-[#143A62E5] text-[#FFFFFFCC] transition hover:brightness-110 z-30"
          >
            بازگشت
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= کامپوننت اصلی نمای خرید =================
interface PurchasePlansViewProps {
  onBack: () => void;
  onPurchaseSuccess: () => void;
}

const PurchasePlansView: React.FC<PurchasePlansViewProps> = ({
  onBack,
  onPurchaseSuccess,
}) => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);
  const [duration, setDuration] = useState<1 | 3 | 6>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);

  const { data: plans = [] } = useQuery({
    queryKey: ["plans", duration],
    queryFn: getPlans,
  });

  const selectedPlans = plans.filter(
    (item) => item.durationMonths === duration,
  );
  const getPlanData = (type: Plan["planType"]) =>
    selectedPlans.find((item) => item.planType === type);
  const basicPlan = getPlanData("basic");
  const silverPlan = getPlanData("silver");
  const goldPlan = getPlanData("gold");

  const requestPurchase = (plan: Plan) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setPendingPlan(plan);
    setModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!pendingPlan) return;
    try {
      await buySubscription(pendingPlan._id);
      showPlanToast(pendingPlan.planType, pendingPlan.durationMonths);
      onPurchaseSuccess();
    } catch (error: any) {
      const errorMessage = error?.message || "خطا در خرید اشتراک";
      if (errorMessage.includes("User already has active subscription")) {
        showErrorToast("شما قبلاً یک اشتراک فعال خریداری کرده‌اید");
      } else {
        showErrorToast(errorMessage);
      }
    } finally {
      setModalOpen(false);
      setPendingPlan(null);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPendingPlan(null);
  };

  return (
    <>
      <div
        className="relative w-full h-full bg-cover bg-center rounded-xl overflow-hidden"
        style={{ backgroundImage: "url('/images/plans_bg.svg')" }}
      >
        <div className="flex flex-col h-full pt-3 pb-2">
          <HorizontalFilter active={duration} setActive={setDuration} />
          <div className="flex-1 min-h-0 mt-2">
            <PlansSlider
              plansData={{
                basic: basicPlan,
                silver: silverPlan,
                gold: goldPlan,
              }}
              duration={duration}
              onRequestPurchase={requestPurchase}
              onBack={onBack}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmPurchase}
        plan={pendingPlan}
        duration={duration}
      />
      <ToastContainer position="top-center" newestOnTop closeButton={false} />
    </>
  );
};

export default PurchasePlansView;
