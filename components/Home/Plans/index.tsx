// "use client";

// import React, { useEffect, useMemo, useState } from "react";

// import { useQuery } from "@tanstack/react-query";

// import { useRouter } from "next/navigation";

// import { useDispatch, useSelector } from "react-redux";

// import { toast, ToastContainer } from "react-toastify";

// import "react-toastify/dist/ReactToastify.css";

// import PlanContent from "./_components/PlanContent";

// import MonthlyFilter from "./_components/MonthlyFilter";

// import { buySubscription, getPlans, Plan } from "@/api/apiPlans";

// import type { RootState } from "@/store/store";

// import { userLogedTrue } from "@/store/slices/logedSlice";

// import { setRole } from "@/store/slices/roleSlice";

// // ================= SUCCESS TOAST =================

// const showPlanToast = (
//   planType: "basic" | "silver" | "gold",
//   duration: 1 | 3 | 6,
// ) => {
//   const durationText =
//     duration === 1 ? "1 ماهه" : duration === 3 ? "3 ماهه" : "6 ماهه";

//   const planText =
//     planType === "gold" ? "طلایی" : planType === "silver" ? "نقره‌ای" : "برنزی";

//   const background =
//     planType === "gold"
//       ? "linear-gradient(135deg,#D4AF37,#F7E27E,#B8860B)"
//       : planType === "silver"
//         ? "linear-gradient(135deg,#C0C0C0,#ECECEC,#8E8E8E)"
//         : "linear-gradient(135deg,#CD7F32,#E6B17A,#8C5523)";

//   toast.success(`خرید پلن ${planText} ${durationText} با موفقیت ثبت شد`, {
//     position: "top-center",

//     autoClose: 3500,

//     hideProgressBar: false,

//     closeOnClick: true,

//     pauseOnHover: true,

//     draggable: true,

//     progressClassName: "!bg-white",

//     style: {
//       background,

//       color: "#fff",

//       fontWeight: "bold",

//       fontSize: window.innerWidth < 640 ? "2vh" : "2.8vh",

//       borderRadius: "2vh",

//       minHeight: window.innerWidth < 640 ? "8vh" : "10vh",

//       width: window.innerWidth < 640 ? "92vw" : "32vw",

//       maxWidth: "420px",

//       padding: window.innerWidth < 640 ? "1.2vh" : "1.8vh",

//       display: "flex",

//       alignItems: "center",

//       justifyContent: "center",

//       textAlign: "center",

//       direction: "rtl",

//       boxShadow: "0 1vh 3vh rgba(0,0,0,0.25)",
//     },
//   });
// };

// // ================= ERROR TOAST =================

// const showErrorToast = (message: string) => {
//   toast.error(message, {
//     position: "top-center",

//     autoClose: 3500,

//     hideProgressBar: false,

//     closeOnClick: true,

//     pauseOnHover: true,

//     draggable: true,

//     progressClassName: "!bg-white",

//     style: {
//       background: "linear-gradient(135deg,#B71C1C,#E53935,#7F0000)",

//       color: "#fff",

//       fontWeight: "bold",

//       fontSize: window.innerWidth < 640 ? "2vh" : "2.8vh",

//       borderRadius: "2vh",

//       minHeight: window.innerWidth < 640 ? "8vh" : "10vh",

//       width: window.innerWidth < 640 ? "92vw" : "32vw",

//       maxWidth: "430px",

//       padding: window.innerWidth < 640 ? "1.2vh" : "1.8vh",

//       display: "flex",

//       alignItems: "center",

//       justifyContent: "center",

//       textAlign: "center",

//       direction: "rtl",

//       boxShadow: "0 1vh 3vh rgba(183,28,28,0.35)",
//     },
//   });
// };

// // ================= CARD STYLE =================

// const planCardBase =
//   "w-full flex items-center justify-center shadow-[inset_0_20px_40px_rgba(255,255,255,0.35)] shadow-[inset_0_-20px_50px_rgba(0,0,0,0.10)] shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-white/80 hover:backdrop-blur-[16px] hover:shadow-[inset_0_24px_48px_rgba(255,255,255,0.42),inset_0_-24px_60px_rgba(0,0,0,0.12),inset_0_0_24px_rgba(0,0,0,0.18),0_12px_40px_rgba(20,58,98,0.18)] active:scale-[0.99] rounded-2xl bg-black/5 backdrop-blur-[12px] border  border-white/60  h-[80vh] sm:h-[70vh] transition-all duration-300";

// const Plans = () => {
//   // ================= STATES =================

//   const [activePlan, setActivePlan] = useState<"basic" | "silver" | "gold">(
//     "gold",
//   );

//   const [duration, setDuration] = useState<1 | 3 | 6>(1);

//   const router = useRouter();

//   const dispatch = useDispatch();

//   const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

//   const [checkedLogin, setCheckedLogin] = useState(false);

//   // ================= USER =================

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(
//           "https://barchasb-server.liara.run/api/auth/me",
//           {
//             method: "GET",

//             credentials: "include",
//           },
//         );

//         const data = await res.json();

//         if (data?.user) {
//           dispatch(
//             userLogedTrue({
//               name: data.user.name || "",

//               lastName: data.user.lastName || "",
//             }),
//           );

//           dispatch(setRole(data.user.role));
//         }
//       } catch (err) {
//       } finally {
//         setCheckedLogin(true);
//       }
//     };

//     fetchUser();
//   }, [dispatch]);

//   // ================= GET PLANS =================

//   const { data: plans = [] } = useQuery({
//     queryKey: ["plans"],

//     queryFn: getPlans,
//   });

//   // ================= FILTER =================

//   const selectedPlans = useMemo(() => {
//     return plans.filter((item) => item.durationMonths === duration);
//   }, [plans, duration]);

//   // ================= GET PLAN =================

//   const getPlanData = (type: Plan["planType"]) => {
//     return selectedPlans.find((item) => item.planType === type);
//   };

//   // ================= TITLES =================

//   const convertPlanTitle = (type?: Plan["planType"]) => {
//     switch (type) {
//       case "basic":
//         return "پلن برنزی";

//       case "silver":
//         return "پلن نقره‌ای";

//       case "gold":
//         return "پلن طلایی";

//       default:
//         return "";
//     }
//   };

//   // ================= FEATURES =================

//   const convertFeatureKey = (key: string) => {
//     switch (key) {
//       case "maxAds":
//         return "حداکثر آگهی";

//       case "specialAds":
//         return "آگهی ویژه";

//       case "ladder":
//         return "نردبان";

//       case "tests":
//         return "افزونه تست";

//       case "digitalAds":
//         return "آگهی دیجیتال";

//       case "specialDisplay":
//         return "نمایش ویژه";

//       default:
//         return key;
//     }
//   };

//   const createFeatures = (plan?: Plan) => {
//     if (!plan) return [];

//     return Object.entries(plan.limits).map(
//       ([key, value]) => `${convertFeatureKey(key)}: ${value}`,
//     );
//   };

//   // ================= PRICE =================

//   const formatPrice = (price?: number) => {
//     if (!price) return "";

//     return `${price.toLocaleString("fa-IR")} تومان`;
//   };

//   // ================= PURCHASE =================

//   const handleWalletPurchase = async (plan?: Plan) => {
//     try {
//       if (!checkedLogin) return;

//       if (!isLoggedIn) {
//         router.push("/login");

//         return;
//       }

//       if (!plan?._id) {
//         showErrorToast("پلن انتخاب نشده است");

//         return;
//       }

//       await buySubscription(plan._id);

//       showPlanToast(plan.planType, plan.durationMonths);
//     } catch (error: any) {
//       const errorMessage = error?.message || "خطا در خرید اشتراک";

//       // ACTIVE SUBSCRIPTION

//       if (errorMessage.includes("User already has active subscription")) {
//         showErrorToast("شما قبلاً یک اشتراک فعال خریداری کرده‌اید");

//         return;
//       }

//       // GENERAL ERROR

//       showErrorToast(errorMessage);
//     }
//   };

//   // ================= ACTIVE PLAN =================

//   const handleClick = (plan: Plan["planType"]) => {
//     setActivePlan(plan);
//   };

//   // ================= PLANS =================

//   const basicPlan = getPlanData("basic");

//   const silverPlan = getPlanData("silver");

//   const goldPlan = getPlanData("gold");

//   return (
//     <>
//       <section
//         className="
//         bg-[url('/images/plansBg.png')] bg-cover bg-center bg-no-repeat
//         flex h-[95vh] sm:h-[90vh] w-full relative overflow-hidden mt-[2%] rounded-[20px] py-4 px-4 sm:px-4 "
//         // style={{
//         //   backgroundImage: "url('/images/plansBg.png')",
//         // }}
//       >
//         {/* FILTER */}
// <div className="hidden sm:block h-full w-[18%]">
//   <MonthlyFilter active={duration} setActive={setDuration} />
// </div>

//         <div className="w-[1%] sm:w-[6%]" />

//         {/* BASIC */}
//         <div className="flex justify-center items-center sm:items-end transition-all duration-300 w-[46%] sm:w-[24%]">
//           <div className={planCardBase}>
//             <PlanContent
//               topImage="/images/bronze_top.svg"
//               title={convertPlanTitle(basicPlan?.planType)}
//               price={formatPrice(basicPlan?.price)}
//               buttonLabel="خرید اشتراک"
//               features={createFeatures(basicPlan)}
//               isOpen={activePlan === "basic"}
//               onClick={() => handleClick("basic")}
//               onGatewayPay={() => {}}
//               onWalletPay={() => basicPlan && handleWalletPurchase(basicPlan)}
//             />
//           </div>
//         </div>

//         <div className="w-[2%] sm:w-[4%]" />

//         {/* GOLD */}
//         <div className="flex justify-center items-center sm:items-start transition-all duration-300 w-[46%] sm:w-[24%]">
//           <div className={planCardBase}>
//             <PlanContent
//               topImage="/images/gold_top.svg"
//               title={convertPlanTitle(goldPlan?.planType)}
//               price={formatPrice(goldPlan?.price)}
//               buttonLabel="خرید اشتراک"
//               features={createFeatures(goldPlan)}
//               isOpen={activePlan === "gold"}
//               onClick={() => handleClick("gold")}
//               onGatewayPay={() => {}}
//               onWalletPay={() => goldPlan && handleWalletPurchase(goldPlan)}
//             />
//           </div>
//         </div>

//         <div className="w-[2%] sm:w-[4%]" />

//         {/* SILVER */}
//         <div className="flex justify-center items-center sm:items-end transition-all duration-300 w-[46%] sm:w-[24%]">
//           <div className={planCardBase}>
//             <PlanContent
//               topImage="/images/silver_top.svg"
//               title={convertPlanTitle(silverPlan?.planType)}
//               price={formatPrice(silverPlan?.price)}
//               buttonLabel="خرید اشتراک"
//               features={createFeatures(silverPlan)}
//               isOpen={activePlan === "silver"}
//               onClick={() => handleClick("silver")}
//               onGatewayPay={() => {}}
//               onWalletPay={() => silverPlan && handleWalletPurchase(silverPlan)}
//             />
//           </div>
//         </div>

// {/* MOBILE FILTER */}
// <div className="w-full flex sm:hidden justify-center absolute bottom-[0.2vh] left-0">
//   <MonthlyFilter active={duration} setActive={setDuration} />
// </div>
//       </section>

//       {/* TOAST */}
//       <ToastContainer position="top-center" newestOnTop closeButton={false} />
//     </>
//   );
// };

// export default Plans;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PlanContent from "./_components/PlanContent";
import MonthlyFilter from "./_components/MonthlyFilter";

import { buySubscription, getPlans, Plan } from "@/api/apiPlans";
import type { RootState } from "@/store/store";
import { userLogedTrue } from "@/store/slices/logedSlice";
import { setRole } from "@/store/slices/roleSlice";

type PlanType = "basic" | "silver" | "gold";
type DurationType = 1 | 3 | 6;

// const PLAN_CARD_BASE =
//   "w-full h-[80vh] sm:h-[70vh] rounded-2xl border border-white/60 bg-black/5 backdrop-blur-[12px] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 hover:border-white/80 hover:backdrop-blur-[16px] active:scale-[0.99] flex items-center justify-center shadow-[inset_0_20px_40px_rgba(255,255,255,0.35),inset_0_-20px_50px_rgba(0,0,0,0.10),inset_0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_24px_48px_rgba(255,255,255,0.42),inset_0_-24px_60px_rgba(0,0,0,0.12),inset_0_0_24px_rgba(0,0,0,0.18),0_12px_40px_rgba(20,58,98,0.18)]";

const PLAN_UI = {
  basic: {
    title: "پلن برنزی",
    image: "/images/bronze_top.svg",
    wrapperClass: "sm:-translate-y-1",
  },
  gold: {
    title: "پلن طلایی",
    image: "/images/gold_top.svg",
    wrapperClass: " sm:-translate-y-20",
  },
  silver: {
    title: "پلن نقره‌ای",
    image: "/images/silver_top.svg",
    wrapperClass: "sm:-translate-y-1",
  },
} satisfies Record<
  PlanType,
  { title: string; image: string; wrapperClass: string }
>;

const getDurationText = (duration: DurationType) => {
  switch (duration) {
    case 1:
      return "1 ماهه";
    case 3:
      return "3 ماهه";
    case 6:
      return "6 ماهه";
    default:
      return "";
  }
};

const getPlanText = (planType: PlanType) => {
  switch (planType) {
    case "gold":
      return "طلایی";
    case "silver":
      return "نقره‌ای";
    case "basic":
      return "برنزی";
    default:
      return "";
  }
};

const getPlanToastBackground = (planType: PlanType) => {
  switch (planType) {
    case "gold":
      return "linear-gradient(135deg,#D4AF37,#F7E27E,#B8860B)";
    case "silver":
      return "linear-gradient(135deg,#C0C0C0,#ECECEC,#8E8E8E)";
    case "basic":
      return "linear-gradient(135deg,#CD7F32,#E6B17A,#8C5523)";
    default:
      return "linear-gradient(135deg,#143A62,#1E4E82,#0F2F4F)";
  }
};

const getFeatureLabel = (key: string) => {
  const featureMap: Record<string, string> = {
    maxAds: "حداکثر آگهی",
    specialAds: "آگهی ویژه",
    ladder: "نردبان",
    tests: "افزونه تست",
    digitalAds: "آگهی مناقصه ای",
    specialDisplay: "نمایش ویژه",
  };

  return featureMap[key] || key;
};

const createFeatures = (plan?: Plan) => {
  if (!plan) return [];

  return Object.entries(plan.limits).map(
    ([key, value]) => `${getFeatureLabel(key)}: ${value}`,
  );
};

const formatPrice = (price?: number) => {
  if (!price) return "";
  return `${price.toLocaleString("fa-IR")} تومان`;
};

const getToastStyle = (background: string) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return {
    background,
    color: "#fff",
    fontWeight: "bold",
    fontSize: isMobile ? "2vh" : "2.8vh",
    borderRadius: "2vh",
    minHeight: isMobile ? "8vh" : "10vh",
    width: isMobile ? "92vw" : "32vw",
    maxWidth: "430px",
    padding: isMobile ? "1.2vh" : "1.8vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    direction: "rtl" as const,
    boxShadow: "0 1vh 3vh rgba(0,0,0,0.25)",
  };
};

const showPlanToast = (planType: PlanType, duration: DurationType) => {
  toast.success(
    `خرید پلن ${getPlanText(planType)} ${getDurationText(duration)} با موفقیت ثبت شد`,
    {
      position: "top-center",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progressClassName: "!bg-white",
      style: getToastStyle(getPlanToastBackground(planType)),
    },
  );
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
      ...getToastStyle("linear-gradient(135deg,#B71C1C,#E53935,#7F0000)"),
      boxShadow: "0 1vh 3vh rgba(183,28,28,0.35)",
    },
  });
};

const Plans = () => {
  const [activePlan, setActivePlan] = useState<PlanType>("gold");
  const [duration, setDuration] = useState<DurationType>(1);
  const [checkedLogin, setCheckedLogin] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://barchasb-server.liara.run/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();

        if (data?.user) {
          dispatch(
            userLogedTrue({
              name: data.user.name || "",
              lastName: data.user.lastName || "",
            }),
          );
          dispatch(setRole(data.user.role));
        }
      } catch (error) {
        console.error("Fetch user failed:", error);
      } finally {
        setCheckedLogin(true);
      }
    };

    fetchUser();
  }, [dispatch]);

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const selectedPlans = useMemo(() => {
    return plans.filter((item) => item.durationMonths === duration);
  }, [plans, duration]);

  const plansMap = useMemo(() => {
    return {
      basic: selectedPlans.find((item) => item.planType === "basic"),
      gold: selectedPlans.find((item) => item.planType === "gold"),
      silver: selectedPlans.find((item) => item.planType === "silver"),
    };
  }, [selectedPlans]);

  const handleWalletPurchase = async (plan?: Plan) => {
    try {
      if (!checkedLogin) return;

      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      if (!plan?._id) {
        showErrorToast("پلن انتخاب نشده است");
        return;
      }

      await buySubscription(plan._id);
      showPlanToast(
        plan.planType as PlanType,
        plan.durationMonths as DurationType,
      );
    } catch (error: any) {
      const errorMessage = error?.message || "خطا در خرید اشتراک";

      if (errorMessage.includes("User already has active subscription")) {
        showErrorToast("شما قبلاً یک اشتراک فعال خریداری کرده‌اید");
        return;
      }

      showErrorToast(errorMessage);
    }
  };

  const planOrder: PlanType[] = ["basic", "gold", "silver"];

  return (
    <>
      <section className="relative flex min-h-screen w-full rounded-[20px] bg-[url('/images/plansBg.png')] bg-cover bg-center bg-no-repeat px-2 py-10">
        <div className="hidden h-full w-[22%] sm:block mt-[130px]  ">
          <MonthlyFilter active={duration} setActive={setDuration} />
        </div>
        <div className="flex w-full items-stretch justify-center sm:gap-5 gap-2 pl-2 sm:pt-20 pb-[30px] ">
          {planOrder.map((type) => {
            const plan = plansMap[type];
            const ui = PLAN_UI[type];

            return (
              <PlanContent
                key={type}
                topImage={ui.image}
                title={ui.title}
                price={formatPrice(plan?.price)}
                isFeatured={type === "gold"}
                features={createFeatures(plan)}
                isOpen={activePlan === type}
                onClick={() => setActivePlan(type)}
                onGatewayPay={() => {}}
                onWalletPay={() => handleWalletPurchase(plan)}
              />
            );
          })}
        </div>

        {/* MOBILE FILTER */}
        <div className="w-full flex sm:hidden justify-center absolute -bottom-[4vh] left-0">
          <MonthlyFilter active={duration} setActive={setDuration} />
        </div>
      </section>

      <ToastContainer position="top-center" newestOnTop closeButton={false} />
    </>
  );
};

export default Plans;
