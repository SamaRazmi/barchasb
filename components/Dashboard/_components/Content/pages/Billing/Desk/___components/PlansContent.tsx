// PlansContent.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getMySubscription, Subscription } from "@/api/apiPlans";
import type { RootState } from "@/store/store";
import { userLogedTrue } from "@/store/slices/logedSlice";
import { setRole } from "@/store/slices/roleSlice";

import NoSubscriptionView from "./NoSubscriptionView";
import ActiveSubscriptionDisplay from "./ActiveSubscriptionDisplay";
import PurchasePlansView from "./PurchasePlansView";

const PlansContent: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.loged.value === 1);

  const [checkedLogin, setCheckedLogin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);

  // گرفتن اطلاعات کاربر
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://barchasb-server.liara.run/api/auth/me",
          { method: "GET", credentials: "include" },
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
          setUserId(data.user._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckedLogin(true);
      }
    };
    fetchUser();
  }, [dispatch]);

  // گرفتن اشتراک فعال
  const fetchSubscription = async () => {
    if (!userId && checkedLogin) {
      setSubscriptionLoading(false);
      return;
    }
    if (!userId) return;
    setSubscriptionLoading(true);
    try {
      const data = await getMySubscription();
      setSubscription(data);
      if (data && showPurchase) {
        setShowPurchase(false);
      }
    } catch (err: any) {
      if (
        err?.message?.includes("No active subscription") ||
        err?.response?.status === 404
      ) {
        setSubscription(null);
      } else {
        console.error(err);
      }
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, checkedLogin, showPurchase]);

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      // می‌توانید به صفحه لاگین هدایت کنید
      // router.push("/login");
      return;
    }
    setShowPurchase(true);
  };

  const handleBackFromPurchase = () => {
    setShowPurchase(false);
  };

  const handlePurchaseSuccess = () => {
    fetchSubscription();
  };

  if (subscriptionLoading || !checkedLogin) {
    return (
      <>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-[#143A62]">در حال بارگذاری...</div>
        </div>
        <ToastContainer position="top-center" newestOnTop closeButton={false} />
      </>
    );
  }

  if (subscription) {
    return (
      <>
        <div
          className="relative w-full h-full bg-cover bg-center rounded-3xl"
          style={{ backgroundImage: "url('/images/plans_bg.svg')" }}
        >
          <ActiveSubscriptionDisplay subscription={subscription} />
        </div>
        <ToastContainer position="top-center" newestOnTop closeButton={false} />
      </>
    );
  }

  return (
    <>
      {showPurchase ? (
        <PurchasePlansView
          onBack={handleBackFromPurchase}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      ) : (
        <NoSubscriptionView onBuyClick={handleBuyClick} />
      )}
      <ToastContainer position="top-center" newestOnTop closeButton={false} />
    </>
  );
};

export default PlansContent;
