// CardContent.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useFilters } from "@/context/FiltersContext";
import { BASE_URL } from "@/api/apiClient";

interface CardProps {
  id: string;
  title: string;
  description: string;
  city: string;
  rating: string;
  imageSrc: string;
  initialMarked?: boolean;
  // اضافه شده برای ثبت بازدید
  adType?: string;
  adId?: string;
  onViewTrack?: (adId: string, adType: string) => Promise<any>;
}

const CardContent: React.FC<CardProps> = ({
  id,
  title,
  description,
  city,
  rating,
  imageSrc,
  initialMarked,
  adType,
  adId,
  onViewTrack,
}) => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [marked, setMarked] = useState(initialMarked || false);
  const { activeTab, setActiveTab } = useFilters();
  useEffect(() => {
    console.log("🟡 useEffect triggered");

    console.log("🔸 userLoading:", userLoading);
    console.log("🔸 user:", user);
    console.log("🔸 ad id:", id);
    console.log("🔸 activeTab:", activeTab);
    console.log("🔸 initialMarked:", initialMarked);

    if (initialMarked === true) {
      console.log("⛔ useEffect skipped because initialMarked is true");
      return;
    }

    if (userLoading || !user) {
      console.log("⛔ useEffect stopped (userLoading or no user)");
      return;
    }

    const adTypeParam = activeTab === "karjo" ? "JobSeekerAd" : "EmployerAd";
    console.log("➡️ adType:", adTypeParam);

    const url = `${BASE_URL}/ads/${id}/is-marked?userId=${user._id}&adType=${adTypeParam}`;
    console.log("🌐 Fetch URL:", url);

    fetch(url, { credentials: "include" })
      .then((res) => {
        console.log("📥 Raw response:", res);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Response data:", data);
        console.log("⭐ data.marked:", data?.marked);
        setMarked(!!data.marked);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setMarked(false);
      });
  }, [initialMarked, userLoading, user, id, activeTab]);

  const handleMarkAd = async () => {
    if (!user) return;

    const adTypeParam = activeTab === "karjo" ? "JobSeekerAd" : "EmployerAd";

    try {
      const res = await fetch(`${BASE_URL}/ads/${id}/mark`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          adType: adTypeParam,
        }),
      });

      const data = await res.json();

      setMarked(data.marked);
    } catch (err) {
      setMarked(false);
    }
  };

  const handleMoreDetails = async () => {
    if (onViewTrack && adId && adType) await onViewTrack(adId, adType);
    if (adType === "JobSeekerAd") {
      setActiveTab("karjo");
      router.push(`/dashboard/ads/${id}?adType=JobSeekerAd`);
    } else if (adType === "EmployerAd") {
      setActiveTab("karfarma");
      router.push(`/dashboard/ads/${id}?adType=EmployerAd`);
    } else {
      setActiveTab("agahi");
      router.push(`/dashboard/ads/${id}?adType=SellerAd`);
    }
  };

  return (
    <div className="w-full p-2 md:p-3 flex flex-col justify-between bg-white rounded-[20px] shadow-lg min-h-[30vh] md:h-[36vh] overflow-y-hidden">
      <div className="flex flex-col items-start text-right">
        <img
          src={imageSrc}
          alt={title}
          className="w-[7vh] h-[7vh] rounded-[15px] mt-1 md:mt-[1%] mb-1 md:mb-[1%]"
        />

        <h3 className="font-medium text-[#143A62] text-[1.6vh] sm:text-[2.4vh] leading-tight md:leading-normal line-clamp-2">
          {title}
        </h3>
        <p className="text-[#143A62] opacity-80 text-[1.2vh] sm:text-[1.8vh] leading-snug md:leading-normal line-clamp-1">
          {description}
        </p>
      </div>

      <div
        className="mt-1"
        style={{
          borderBottom: "1px solid transparent",
          borderImageSource:
            "linear-gradient(90deg, rgba(20, 58, 98, 0.05) 0%, #143A62 48.08%, rgba(20, 58, 98, 0.05) 100%)",
          borderImageSlice: 1,
        }}
      ></div>

      <div className="bg-gray-50 text-[#143A62] rounded-xl py-1 md:py-2 px-3 md:px-5 mt-1 inline-flex w-fit items-center">
        <img
          src="/images/citycard-icon.svg"
          alt="City"
          className="w-[2vh] h-[2vh] ml-2"
        />
        <p className="text-[#143A62] text-[1.4vh] sm:text-[2vh] font-normal line-clamp-2">
          {city}
        </p>
      </div>

      <div className="bg-gray-50 text-[#143A62] rounded-xl py-1 md:py-2 px-3 md:px-5 mt-1 inline-flex w-fit items-center">
        <img
          src="/images/star.svg"
          alt="Rating"
          className="w-[2vh] h-[2vh] ml-2"
        />
        <p className="text-[#143A62] text-[11px] font-normal">{rating}</p>
      </div>

      <div className="flex justify-between items-center mt-1 md:mt-[1vh] space-x-1 md:space-x-2">
        <button
          onClick={handleMarkAd}
          className={`w-[20%] h-[4vh] sm:h-[5vh] rounded-[10px]
    flex justify-center items-center transition-colors
    border border-[#143A62]
    ${marked ? "bg-[#143A62]" : "bg-[#FFFFFF]"}`}
        >
          <img
            src={
              marked
                ? "/images/addcard-icon.svg"
                : "/images/addcard-icon-white.svg"
            }
            alt="Icon"
            className="w-[2vh] h-[2vh]"
          />
        </button>

        <button
          onClick={handleMoreDetails}
          className="flex flex-row-reverse items-center w-[calc(100%-18%-1rem)] sm:w-[calc(100%-20%-1rem)] h-[4vh] sm:h-[5vh] bg-[#143A62] rounded-[10px] text-white pr-3 sm:pl-4 justify-start"
        >
          <img
            src="/images/more-option-icon.svg"
            alt="Options"
            className="w-[2vh] h-[2vh] mr-1 ml-1"
          />
          <span className="font-semibold text-[1.2vh] sm:text-[2vh] sm:text-[13px] pr-4 sm:pr-5 whitespace-nowrap">
            جزئیات بیشتر
          </span>
        </button>
      </div>
    </div>
  );
};

export default CardContent;
