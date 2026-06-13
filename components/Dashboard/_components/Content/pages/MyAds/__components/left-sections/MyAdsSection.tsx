"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import SelectionSwitch from "./SelectionSwitch";
import RenewAdPaymentModal from "./RenewAdPaymentModal";
import EditFormEmployee from "../ads-sections/EditFormEmployee";
import EditFormJobSeeker from "../ads-sections/EditFormJobSeeker";
import EditFormAdvertiser from "../ads-sections/EditFormAdvertiser";
import VisitStatsModal from "./VisitStatsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface MyAdsSectionProps {
  initialActiveType?: "employer" | "seeker" | "seller";
}

export interface Ad {
  _id: string;
  title: string;
  name: string;
  description: string;
  aboutMe: string;
  priceIRT: string;
  createdAt: string;
  category?: string;
  cooperationType?: string;
  paymentMethod?: string;
  minSalary?: string;
  maxSalary?: string;
  startTime?: string;
  endTime?: string;
  state?: string;
  skills?: string;
  city?: string;
  gender?: string;
  experience?: string;
  otherFeatures?: string;
  militaryStatus?: string;
  images?: { url: string; isMain?: boolean }[];
  visitStats?: {
    today: number;
    total: number;
    weekly: number[];
    monthly: number[];
  };
}

const MyAdsSection = ({ initialActiveType }: MyAdsSectionProps) => {
  const { user, loading: userLoading } = useUser();

  const [activeType, setActiveType] = useState<
    "employer" | "seeker" | "seller"
  >(initialActiveType || "seeker");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [renewModalAd, setRenewModalAd] = useState<Ad | null>(null);
  const [visitStatsModalAd, setVisitStatsModalAd] = useState<Ad | null>(null);
  const [deleteModalAd, setDeleteModalAd] = useState<Ad | null>(null);
  const [deleting, setDeleting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const editContainerRef = useRef<HTMLDivElement>(null);
  const [editDragOffset, setEditDragOffset] = useState(0);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "امروز";
    if (diffDays < 7) return `${diffDays} روز پیش`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ماه پیش`;
    return "بیش از یک سال پیش";
  };

  // دریافت آگهی‌ها (بدون تغییر)
  useEffect(() => {
    if (!user) return;
    const fetchAds = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (activeType) {
          case "employer":
            url = `https://barchasb-server.liara.run/api/ads/employer/owner/${user._id}`;
            break;
          case "seeker":
            url = `https://barchasb-server.liara.run/api/ads/jobseeker/owner/${user._id}`;
            break;
          case "seller":
            url = `https://barchasb-server.liara.run/api/ads/seller/owner/${user._id}`;
            break;
        }
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        let fetchedAds: Ad[] = [];
        if (Array.isArray(data)) fetchedAds = data;
        else if (Array.isArray(data.ads)) fetchedAds = data.ads;
        else if (Array.isArray(data.data)) fetchedAds = data.data;
        const uniqueAds = Array.from(
          new Map(fetchedAds.map((ad) => [ad._id, ad])).values(),
        );
        uniqueAds.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setAds(uniqueAds);
      } catch (err) {
        console.error("خطا در دریافت آگهی‌ها:", err);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [user, activeType]);

  // تابع حذف آگهی
  const handleDeleteAd = async () => {
    if (!deleteModalAd || !user) return;
    setDeleting(true);
    try {
      let url = "";
      switch (activeType) {
        case "employer":
          url = `https://barchasb-server.liara.run/api/ads/employer/${deleteModalAd._id}`;
          break;
        case "seeker":
          url = `https://barchasb-server.liara.run/api/ads/jobseeker/${deleteModalAd._id}`;
          break;
        case "seller":
          url = `https://barchasb-server.liara.run/api/ads/seller/${deleteModalAd._id}`;
          break;
      }
      // Get token from localStorage
      let token = localStorage.getItem("token") || "";
      if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("حذف ناموفق");
      setAds((prev) => prev.filter((ad) => ad._id !== deleteModalAd._id));
      setDeleteModalAd(null);
    } catch (err) {
      console.error("خطا در حذف آگهی:", err);
      alert(err instanceof Error ? err.message : "حذف آگهی با خطا مواجه شد.");
    } finally {
      setDeleting(false);
    }
  };

  const renderEditForm = () => {
    // بدون تغییر
    if (!editingAdId) return null;
    switch (activeType) {
      case "employer":
        return (
          <EditFormEmployee
            adId={editingAdId}
            onCancel={() => setEditingAdId(null)}
          />
        );
      case "seeker":
        return (
          <EditFormJobSeeker
            adId={editingAdId}
            onCancel={() => setEditingAdId(null)}
          />
        );
      case "seller":
        return (
          <EditFormAdvertiser
            adId={editingAdId}
            onCancel={() => setEditingAdId(null)}
          />
        );
      default:
        return null;
    }
  };

  // اسکرول هندلرها (بدون تغییر)
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleDrag = (e: MouseEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.clientY;
      containerRef.current.scrollTop = Math.max(
        0,
        containerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };
  const handleTouchStart = (e: React.TouchEvent) =>
    setDragOffset(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      containerRef.current.scrollTop = Math.max(
        0,
        containerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current) containerRef.current.scrollTop += e.deltaY;
  };

  const handleEditMouseDown = (e: React.MouseEvent) => {
    if (!isMobile) return;
    setEditDragOffset(e.clientY);
    document.addEventListener("mousemove", handleEditDrag);
    document.addEventListener("mouseup", handleEditMouseUp);
  };
  const handleEditDrag = (e: MouseEvent) => {
    if (editContainerRef.current) {
      const delta = editDragOffset - e.clientY;
      editContainerRef.current.scrollTop = Math.max(
        0,
        editContainerRef.current.scrollTop + delta,
      );
      setEditDragOffset(e.clientY);
    }
  };
  const handleEditMouseUp = () => {
    document.removeEventListener("mousemove", handleEditDrag);
    document.removeEventListener("mouseup", handleEditMouseUp);
  };
  const handleEditTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setEditDragOffset(e.touches[0].clientY);
  };
  const handleEditTouchMove = (e: React.TouchEvent) => {
    if (editContainerRef.current && isMobile) {
      const delta = editDragOffset - e.touches[0].clientY;
      editContainerRef.current.scrollTop = Math.max(
        0,
        editContainerRef.current.scrollTop + delta,
      );
      setEditDragOffset(e.touches[0].clientY);
    }
  };
  const handleEditWheel = (e: React.WheelEvent) => {
    if (editContainerRef.current)
      editContainerRef.current.scrollTop += e.deltaY;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = !!editingAdId;
      const targetContainer = isEditing
        ? editContainerRef.current
        : containerRef.current;
      if (!targetContainer) return;
      const scrollAmount = 100;
      const pageScrollAmount = targetContainer.clientHeight;
      switch (e.key) {
        case "ArrowDown":
          targetContainer.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          targetContainer.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          targetContainer.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          targetContainer.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingAdId]);

  return (
    <div className="w-full h-full relative md:p-4">
      {userLoading ? (
        <div>در حال بارگذاری کاربر...</div>
      ) : editingAdId ? (
        <div
          ref={editContainerRef}
          className="w-full overflow-auto h-[50vh] sm:h-[55vh] md:h-[100vh]"
          onMouseDown={handleEditMouseDown}
          onWheel={handleEditWheel}
          onTouchStart={handleEditTouchStart}
          onTouchMove={handleEditTouchMove}
        >
          <div className="h-auto">{renderEditForm()}</div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col md:flex-row gap-8 items-center md:items-start">
          <SelectionSwitch
            active={activeType}
            onChange={(type) => {
              setActiveType(type);
              setEditingAdId(null);
            }}
          />
          <div className="flex-1">
            <h2 className="text-[2.4vh] font-semibold text-[#143A62] mb-4">
              آگهی‌های من
            </h2>
            {loading ? (
              <div>در حال بارگذاری آگهی‌ها...</div>
            ) : ads.length === 0 ? (
              <div>آگهی‌ای برای این کاربر موجود نیست.</div>
            ) : (
              <div
                ref={containerRef}
                className="space-y-4 h-[34vh] md:h-[70vh] overflow-hidden"
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {ads.map((ad) => {
                  if (!isMobile) {
                    // نسخه دسکتاپ (با دکمه حذف جدید)
                    return (
                      <div
                        key={ad._id}
                        className="relative border p-2 bg-[#FFFFFF] rounded-md shadow-sm flex flex-row-reverse items-center gap-4"
                      >
                        {/* دکمه حذف با آیکون جدید */}
                        <button
                          onClick={() => setDeleteModalAd(ad)}
                          className="absolute left-2 top-2 w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10"
                          style={{ background: "#EDEDED" }}
                          aria-label="حذف آگهی"
                        >
                          <img
                            src="/images/delete_icon.svg"
                            alt="delete"
                            className="w-4 h-4"
                          />
                        </button>
                        <div className="flex-1 flex flex-col gap-1">
                          <h3 className="font-semibold text-[#143A62]">
                            {ad.name}
                          </h3>
                          <h3 className="font-semibold text-[#143A62D9]">
                            {ad.title}
                          </h3>
                          <p className="text-[#143A62D9] text-[2vh]">
                            {ad.description}
                            {ad.category}
                          </p>
                          <p className="text-[#143A62D9] text-[2vh]">
                            {ad.priceIRT}
                          </p>
                          <small className="text-[#1143A62]">
                            {ad.city}،{ad.state}
                            <span className="bg-[#143A62] rounded-md px-1 mx-[1.5vh] text-white">
                              {getRelativeTime(ad.createdAt)}
                            </span>
                          </small>
                        </div>
                        <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                          <img
                            src={ad.images?.[0]?.url || "/images/ResUser.jpg"}
                            alt="عکس آگهی"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute left-4 bottom-2 flex gap-[1.4vh]">
                          <button
                            onClick={() => setVisitStatsModalAd(ad)}
                            className="bg-sky-300 text-white px-4 py-1 rounded-md text-[1.8vh]"
                          >
                            آمار بازدید
                          </button>
                          <button
                            onClick={() => setRenewModalAd(ad)}
                            className="bg-orange-500 text-white px-4 py-1 rounded-md text-[1.8vh]"
                          >
                            تمدید
                          </button>
                          <button
                            onClick={() => setEditingAdId(ad._id)}
                            className="bg-blue-900 text-white px-4 py-1 rounded-md text-[1.8vh]"
                          >
                            ویرایش
                          </button>
                        </div>
                      </div>
                    );
                  }
                  // نسخه موبایل (با دکمه حذف جدید)
                  return (
                    <div
                      key={ad._id}
                      className="relative border p-2 bg-white rounded-md shadow-sm flex flex-col items-center gap-2"
                    >
                      <button
                        onClick={() => setDeleteModalAd(ad)}
                        className="absolute left-2 top-2 w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10"
                        style={{ background: "#EDEDED" }}
                        aria-label="حذف آگهی"
                      >
                        <img
                          src="/images/delete_icon.svg"
                          alt="delete"
                          className="w-4 h-4"
                        />
                      </button>

                      <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-300">
                        <img
                          src={ad.images?.[0]?.url || "/images/ResUser.jpg"}
                          alt="عکس آگهی"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-[#143A62] truncate w-full text-center">
                        {ad.name}
                      </h3>
                      <h3 className="font-semibold text-[#143A62D9] truncate w-full text-center">
                        {ad.title}
                      </h3>
                      <small className="text-[#1143A62] text-center">
                        {ad.city}،{ad.state}
                        <span className="bg-[#143A62] rounded-md px-1 mx-2 text-white">
                          {getRelativeTime(ad.createdAt)}
                        </span>
                      </small>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => setVisitStatsModalAd(ad)}
                          className="bg-sky-300 text-white px-4 py-1 rounded-md text-sm"
                        >
                          آمار بازدید
                        </button>
                        <button
                          onClick={() => setRenewModalAd(ad)}
                          className="bg-orange-500 text-white px-4 py-1 rounded-md text-sm"
                        >
                          تمدید
                        </button>
                        <button
                          onClick={() => setEditingAdId(ad._id)}
                          className="bg-blue-900 text-white px-4 py-1 rounded-md text-sm"
                        >
                          ویرایش
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* مدال تمدید */}
      {renewModalAd && (
        <RenewAdPaymentModal
          isOpen={true}
          ad={renewModalAd}
          onClose={() => setRenewModalAd(null)}
        />
      )}

      {/* مدال آمار بازدید */}
      {visitStatsModalAd && (
        <VisitStatsModal
          isOpen={true}
          adId={visitStatsModalAd._id}
          adType={
            activeType === "employer"
              ? "EmployerAd"
              : activeType === "seeker"
                ? "JobSeekerAd"
                : "SellerAd"
          }
          onClose={() => setVisitStatsModalAd(null)}
        />
      )}

      {/* مدال حذف با طراحی جدید */}
      <DeleteConfirmationModal
        isOpen={!!deleteModalAd}
        onClose={() => setDeleteModalAd(null)}
        onConfirm={handleDeleteAd}
        adTitle={deleteModalAd?.title || deleteModalAd?.name || ""}
        isDeleting={deleting}
      />
    </div>
  );
};

export default MyAdsSection;
