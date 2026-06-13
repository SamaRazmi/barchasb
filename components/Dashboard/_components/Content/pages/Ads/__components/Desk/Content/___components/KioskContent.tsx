// KioskContent.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useFilters } from "@/context/FiltersContext";

interface KioskCardProps {
  id: string;
  title: string;
  city: string;
  price: string;
  imageSrc: string;
  initialMarked?: boolean;
  // اضافه شده برای ثبت بازدید
  adType?: string;
  adId?: string;
  onViewTrack?: (adId: string, adType: string) => Promise<any>;
}

const KioskContent: React.FC<KioskCardProps> = ({
  id,
  title,
  city,
  price,
  imageSrc,
  initialMarked,
  adType,
  adId,
  onViewTrack,
}) => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { activeTab, setActiveTab } = useFilters();

  const [marked, setMarked] = useState(initialMarked || false);

  const getAdType = () => {
    if (activeTab === "karjo") return "JobSeekerAd";
    if (activeTab === "karfarma") return "EmployerAd";
    return "SellerAd";
  };

  useEffect(() => {
    console.log("🟡 KioskContent useEffect triggered");
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

    const adTypeParam = getAdType();
    const url = `https://barchasb-server.liara.run/api/ads/${id}/is-marked?userId=${user._id}&adType=${adTypeParam}`;

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("initial marked fetch:", { id, adTypeParam, data });
        setMarked(!!data.marked);
      })
      .catch((err) => {
        console.log("initial marked fetch error:", err);
        setMarked(false);
      });
  }, [initialMarked, userLoading, user, id, activeTab]);

  const handleMarkAd = async () => {
    if (!user) return;

    const adTypeParam = getAdType();

    try {
      const res = await fetch(
        `https://barchasb-server.liara.run/api/ads/${id}/mark`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, adType: adTypeParam }),
        },
      );

      const data = await res.json();
      console.log("mark toggle response:", { id, adTypeParam, data });
      setMarked(data.marked);
    } catch (err) {
      console.log("mark toggle error:", err);
      setMarked(false);
    }
  };

  const handleMoreDetails = async () => {
    if (onViewTrack && adId && adType) await onViewTrack(adId, adType);
    setActiveTab("agahi");
    router.push(`/dashboard/ads/${id}?adType=SellerAd`);
  };

  return (
    <div className="w-full p-4 flex flex-col justify-between bg-white rounded-[20px] shadow-lg h-[36vh] overflow-hidden">
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={title}
          className="w-[12vh] h-[12vh] rounded-[1.5vh] object-cover"
        />
      </div>

      <h3 className="text-[#143A62] font-medium text-[1.6vh] sm:text-[2.4vh] text-center mt-[1vh] truncate">
        {title}
      </h3>

      <div
        className="my-[0.5vh]"
        style={{
          borderBottom: "1px solid transparent",
          borderImageSource:
            "linear-gradient(90deg, rgba(20, 58, 98, 0.05) 0%, #143A62 48.08%, rgba(20, 58, 98, 0.05) 100%)",
          borderImageSlice: 1,
        }}
      ></div>

      <div className="flex justify-start items-center gap-[2vh] mt-[1vh]">
        <div className="bg-gray-50 text-[#143A62] rounded-xl sm:py-2 sm:px-3 inline-flex items-center">
          <img
            src="/images/citycard-icon.svg"
            alt="City"
            className="w-[2vh] h-[2vh] ml-1"
          />
          <p className="text-[#143A62] text-[1.2vh] sm:text-[1.7vh] font-normal line-clamp-2">
            {city}
          </p>
        </div>

        <div className="bg-gray-50 text-[#143A62] rounded-xl sm:py-[0.5vh] sm:px-[2vh] inline-flex items-center">
          <p className="text-[#143A62] text-[1.2vh] sm:text-[1.7vh] font-medium line-clamp-2">
            {price}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[0.5vh] space-x-[1vh]">
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
          className="flex flex-row-reverse items-center w-[calc(100%-18%-1rem)] sm:w-[calc(100%-20%-1rem)] h-[4vh] sm:h-[5vh] bg-[#143A62] rounded-[10px] text-white sm:pr-3 sm:pl-1 justify-start"
        >
          <img
            src="/images/more-option-icon.svg"
            alt="Options"
            className="w-[2vh] h-[2vh] mr-1 md:ml-2 "
          />
          <span className="font-semibold text-[1.2vh] sm:text-[2vh] pr-2 sm:pl-1 whitespace-nowrap">
            جزئیات بیشتر
          </span>
        </button>
      </div>
    </div>
  );
};

export default KioskContent;
