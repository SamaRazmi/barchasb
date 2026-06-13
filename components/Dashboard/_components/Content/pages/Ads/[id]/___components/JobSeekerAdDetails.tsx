"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import ToastPortal from "@/components/common/ToastPortal";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface Props {
  id: string;
}

const BASE_URL = "https://barchasb-server.liara.run/api";

// ✅ اصلاح: ۴ رقم آخر ستاره می‌شود
const maskPhone = (phone?: string) =>
  phone ? phone.slice(0, -4) + "****" : "";

const maskPhoneLast4 = (phone?: string) => {
  if (!phone) return "";
  return phone.slice(0, -4) + "****";
};

const JobSeekerAdDetails: React.FC<Props> = ({ id }) => {
  const [adData, setAdData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactPhone, setContactPhone] = useState<string>("");
  const [fetchingPhone, setFetchingPhone] = useState(false);
  const [showModalFullPhone, setShowModalFullPhone] = useState(false);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("لینک کپی شد!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "colored",
    });
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: adData?.name || "آگهی",
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  // دریافت شماره تماس آگهی‌دهنده (owner) از API
  const fetchOwnerPhone = async () => {
    if (!user) {
      toast.warn("لطفاً ابتدا وارد حساب کاربری خود شوید", {
        position: "bottom-right",
        autoClose: 3000,
        onClick: () => router.push("/login"),
      });
      return;
    }

    const ownerId = adData?.owner?._id || adData?.owner;
    if (!ownerId) {
      toast.error("شناسه آگهی‌دهنده یافت نشد");
      return;
    }

    setFetchingPhone(true);
    try {
      const res = await fetch(`${BASE_URL}/get-one-user/${ownerId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`خطا: ${res.status}`);
      const response = await res.json();
      const phoneNumber = response.data?.phone || "";
      if (!phoneNumber) {
        toast.error("شماره تماسی برای این آگهی‌دهنده ثبت نشده است");
        return;
      }
      setContactPhone(phoneNumber);
      setShowModalFullPhone(false);
      setShowContactModal(true);
    } catch (err: any) {
      console.error(err);
      toast.error("امکان دریافت شماره تماس وجود ندارد");
    } finally {
      setFetchingPhone(false);
    }
  };

  // کلیک روی شماره تلفن درون خطی (نمایش کامل و سپس تماس)
  const handlePhoneClick = () => {
    if (!user || !adData?.phoneNumber) return;
    if (!showPhone) {
      setShowPhone(true);
    } else {
      window.location.href = `tel:${adData.phoneNumber}`;
    }
  };

  // کلیک روی شماره در مودال
  const handleModalPhoneClick = () => {
    if (!showModalFullPhone) {
      setShowModalFullPhone(true);
    } else {
      window.location.href = `tel:${contactPhone}`;
    }
  };

  // ========== رویدادهای اسکرول مخفی ==========
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragOffset(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;
      const scrollAmount = 100;
      const pageScrollAmount = scrollContainerRef.current.clientHeight;
      switch (e.key) {
        case "ArrowDown":
          scrollContainerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          scrollContainerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          scrollContainerRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          scrollContainerRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await fetch(`${BASE_URL}/ads/jobseeker/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت آگهی");
        const data = await res.json();
        setAdData(data);
        setActiveImage(0);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  // فوکوس خودکار برای دسکتاپ
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.focus();
    }
  }, [adData]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!adData) return null;

  const textColor = { color: "#143A62" };

  // ========== محتوای دسکتاپ (بدون فوتر) ==========
  const DesktopLayout = () => (
    <div className="space-y-6">
      <div className="flex gap-6 items-start">
        <div className="flex flex-col items-center gap-2">
          <img
            src={adData.images?.[activeImage]?.url || "/images/ResUser.jpg"}
            className="w-[20vh] h-[20vh] rounded-xl object-cover"
            alt="main"
          />
          {adData.images?.length > 1 && (
            <div className="flex gap-2 mt-2">
              {adData.images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.url}
                  className={`w-[4vh] h-[4vh] object-cover rounded cursor-pointer border-2 ${
                    idx === activeImage ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setActiveImage(idx)}
                  alt="thumb"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between h-[20vh]">
          <h2 className="text-[3vh] font-bold" style={textColor}>
            {adData.name}
          </h2>
          <p style={textColor}>
            {adData.state} {adData.city && ` / ${adData.city}`}
          </p>
          <p style={textColor}>⭐ {adData.rating?.average || 0} / 5</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {adData.age && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">سال تولد:</span> {adData.age}
          </div>
        )}
        {adData.maritalStatus && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">تاهل:</span> {adData.maritalStatus}
          </div>
        )}
        {adData.gender && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">جنسیت:</span> {adData.gender}
          </div>
        )}
        {adData.gender === "male" && adData.militaryStatus && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">سربازی:</span> {adData.militaryStatus}
          </div>
        )}
        {user && adData.phoneNumber && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit cursor-pointer"
            style={textColor}
            onClick={handlePhoneClick}
          >
            <span className="font-bold">تلفن:</span>{" "}
            {showPhone ? adData.phoneNumber : maskPhone(adData.phoneNumber)}
          </div>
        )}
      </div>

      {adData.skills?.length > 0 && (
        <div>
          <p className="font-bold" style={textColor}>
            مهارت‌ها:
          </p>
          <div className="mt-1 flex flex-wrap gap-4" style={textColor}>
            {adData.skills.map((skill: string, idx: number) => {
              const [key, value] = skill.split(":");
              return (
                <span key={idx}>
                  <span>• {value || key}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {adData.careerHistory?.length > 0 && (
        <div>
          <p className="font-bold" style={textColor}>
            سوابق شغلی:
          </p>
          <div className="mt-1 space-y-1">
            {adData.careerHistory.map((item: any, idx: number) => (
              <p key={idx} style={textColor}>
                <span className="font-bold">• {item.title}:</span>{" "}
                {item.description}
              </p>
            ))}
          </div>
        </div>
      )}

      {adData.education && (
        <div>
          <p className="font-bold" style={textColor}>
            سوابق تحصیلی:
          </p>
          <p style={textColor} className="mt-1">
            <span className="font-bold">تحصیلات:</span> {adData.education}
          </p>
        </div>
      )}
    </div>
  );

  // ========== محتوای موبایل (آیکون‌ها در هدر) ==========
  const MobileLayout = () => (
    <div className="w-full flex flex-col gap-[1vh] text-right text-[2vh]">
      <div className="flex flex-col items-center gap-2 my-2">
        <img
          src={adData.images?.[activeImage]?.url || "/images/ResUser.jpg"}
          className="w-[35vh] h-[36vh] object-cover rounded-xl max-h-[200px]"
          alt="main"
        />
        {adData.images?.length > 1 && (
          <div className="flex gap-2 mt-2">
            {adData.images.map((img: any, idx: number) => (
              <img
                key={idx}
                src={img.url}
                className={`w-[8vh] h-[8vh] object-cover rounded cursor-pointer border-2 ${
                  idx === activeImage ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setActiveImage(idx)}
                alt="thumb"
              />
            ))}
          </div>
        )}
      </div>

      {/* ردیف عنوان + آیکون‌های کپی/اشتراک */}
      <div className="flex justify-between items-center">
        <h2 className="text-[3vh] font-bold" style={textColor}>
          {adData.name}
        </h2>
        <div className="flex gap-3">
          <div
            className="w-[6vh] h-[6vh] rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
            onClick={handleCopyLink}
          >
            <img
              src="/images/add-page.svg"
              alt="copy"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <div
            className="w-[6vh] h-[6vh] rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
            onClick={handleWebShare}
          >
            <img
              src="/images/share-page.svg"
              alt="share"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
        </div>
      </div>

      <p style={textColor}>
        {adData.state} {adData.city && ` / ${adData.city}`}
      </p>
      <p style={textColor}>⭐ {adData.rating?.average || 0} / 5</p>

      <div className="flex flex-wrap gap-2">
        {adData.age && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">سال تولد:</span> {adData.age}
          </div>
        )}
        {adData.maritalStatus && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">تاهل:</span> {adData.maritalStatus}
          </div>
        )}
        {adData.gender && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">جنسیت:</span> {adData.gender}
          </div>
        )}
        {adData.gender === "male" && adData.militaryStatus && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit"
            style={textColor}
          >
            <span className="font-bold">سربازی:</span> {adData.militaryStatus}
          </div>
        )}
        {user && adData.phoneNumber && (
          <div
            className="bg-gray-200 px-3 py-1 rounded-full w-fit cursor-pointer"
            style={textColor}
            onClick={handlePhoneClick}
          >
            <span className="font-bold">تلفن:</span>{" "}
            {showPhone ? adData.phoneNumber : maskPhone(adData.phoneNumber)}
          </div>
        )}
      </div>

      {adData.skills?.length > 0 && (
        <div>
          <p className="font-bold" style={textColor}>
            مهارت‌ها:
          </p>
          <div className="mt-1 flex flex-wrap gap-4" style={textColor}>
            {adData.skills.map((skill: string, idx: number) => {
              const [key, value] = skill.split(":");
              return (
                <span key={idx}>
                  <span>• {value || key}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {adData.careerHistory?.length > 0 && (
        <div>
          <p className="font-bold" style={textColor}>
            سوابق شغلی:
          </p>
          <div className="mt-1 space-y-1">
            {adData.careerHistory.map((item: any, idx: number) => (
              <p key={idx} style={textColor}>
                <span className="font-bold">• {item.title}:</span>{" "}
                {item.description}
              </p>
            ))}
          </div>
        </div>
      )}

      {adData.education && (
        <div>
          <p className="font-bold" style={textColor}>
            سوابق تحصیلی:
          </p>
          <p style={textColor} className="mt-1">
            <span className="font-bold">تحصیلات:</span> {adData.education}
          </p>
        </div>
      )}
    </div>
  );

  // ========== فوتر دسکتاپ (شامل دکمه‌ها و آیکون‌ها) ==========
  const DesktopFooter = () => (
    <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-4 pt-2 border-t border-gray-200">
      <div className="flex justify-center gap-3">
        {!user ? (
          // حالت لاگین نبودن: هر دو دکمه نمایش داده می‌شوند و به /login هدایت می‌کنند
          <>
            <button
              onClick={() => router.push("/login")}
              className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
            >
              چت در برچسب
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
            >
              اطلاعات تماس
            </button>
          </>
        ) : (
          // حالت لاگین بودن: رفتار قبلی (چت فقط در صورت عدم مالکیت، اطلاعات تماس همیشه)
          <>
            {user._id !== adData.owner?._id && (
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/chat/JobSeekerAd/${id}/${adData.owner._id}`,
                  )
                }
                className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
              >
                چت در برچسب
              </button>
            )}
            <button
              onClick={fetchOwnerPhone}
              className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
            >
              اطلاعات تماس
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center gap-3">
        <div
          className="w-[6vh] h-[6vh] rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={handleCopyLink}
        >
          <img
            src="/images/add-page.svg"
            alt="copy"
            className="w-1/2 h-1/2 object-contain"
          />
        </div>
        <div
          className="w-[6vh] h-[6vh] rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={handleWebShare}
        >
          <img
            src="/images/share-page.svg"
            alt="share"
            className="w-1/2 h-1/2 object-contain"
          />
        </div>
      </div>
    </div>
  );

  // ========== فوتر موبایل (فقط دکمه‌ها) ==========
  const MobileFooter = () => (
    <div className="flex justify-center gap-3 py-3 bg-gray-50 border-t h-[30vh] border-gray-200">
      {!user ? (
        <>
          <button
            onClick={() => router.push("/login")}
            className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
          >
            چت در برچسب
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
          >
            اطلاعات تماس
          </button>
        </>
      ) : (
        <>
          {user._id !== adData.owner?._id && (
            <button
              onClick={() =>
                router.push(
                  `/dashboard/chat/JobSeekerAd/${id}/${adData.owner._id}`,
                )
              }
              className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
            >
              چت در برچسب
            </button>
          )}
          <button
            onClick={fetchOwnerPhone}
            className="bg-[#143A62D9] text-white w-32 h-12 rounded-lg flex items-center justify-center"
          >
            اطلاعات تماس
          </button>
        </>
      )}
    </div>
  );

  // ========== مودال اطلاعات تماس ==========
  const ContactModal = () => {
    if (!showContactModal) return null;
    const displayPhone = showModalFullPhone
      ? contactPhone
      : maskPhoneLast4(contactPhone);

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
        onClick={() => setShowContactModal(false)}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#143A62]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              اطلاعات تماس
            </h3>
            <p className="text-gray-500 text-sm mb-4">شماره تماس آگهی‌دهنده</p>

            {fetchingPhone ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#143A62]"></div>
              </div>
            ) : (
              <div
                onClick={handleModalPhoneClick}
                className="block bg-gray-100 rounded-xl py-3 px-4 mb-6 text-lg font-mono text-[#143A62] font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                dir="ltr"
              >
                {displayPhone}
              </div>
            )}

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-[#143A62] text-white py-2.5 rounded-xl hover:bg-[#0f2a4a] transition-colors font-medium"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative p-4 md:p-8 bg-gray-50 text-right h-[78vh] text-[2vh] flex flex-col">
      {/* دسکتاپ */}
      <div className="hidden md:flex flex-col h-full">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hidden"
          tabIndex={0}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{ userSelect: "none" }}
        >
          <DesktopLayout />
        </div>
        <DesktopFooter />
      </div>

      {/* موبایل */}
      <div className="block md:hidden flex flex-col h-full">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hidden"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{ userSelect: "none" }}
        >
          <MobileLayout />
        </div>
        <MobileFooter />
      </div>

      <ContactModal />
      <ToastPortal />

      <style jsx global>{`
        .scrollbar-hidden {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default JobSeekerAdDetails;
