"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ResProfile = () => {
  const router = useRouter();
  const { fullName } = useSelector((state: RootState) => state.loged);
  const { user: contextUser } = useUser();
  const userId = contextUser?._id;
  const gender = contextUser?.gender;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // تابع کمکی برای تصویر پیش‌فرض بر اساس جنسیت (فقط بعد از لود استفاده می‌شود)
  const getDefaultAvatar = () => {
    if (gender === "female") return "/images/women_default.svg";
    if (gender === "male") return "/images/men_default.svg";
    return "/images/user.png";
  };

  // تبدیل آدرس قدیمی به جدید
  const replaceImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const oldBase = "https://barchasb-data.storage.c2.liara.site";
    const newBase = "https://barchasb-admin-server.ir";
    if (url.startsWith(oldBase)) {
      return url.replace(oldBase, newBase);
    }
    return url;
  };

  // دریافت تصویر پروفایل از API
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfileImage = async () => {
      try {
        const res = await fetch(
          `https://barchasb-server.liara.run/api/profile?userId=${userId}`,
          { credentials: "include" },
        );
        const data = await res.json();
        if (data.profile?.profileImage) {
          const newUrl = replaceImageUrl(data.profile.profileImage);
          setProfileImage(newUrl);
        } else {
          setProfileImage(null);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setProfileImage(null);
      }
    };

    fetchProfileImage();
  }, [userId]);

  const handleImageError = () => {
    setImageError(true);
    // در صورت خطا، تصویر پیش‌فرض جایگزین می‌شود (اما دیگر حالت لود تمام شده)
    setProfileImage(null);
  };

  const handleProfileClick = () => {
    router.push("/dashboard/myads");
  };

  const handleEditClick = () => {
    console.log("Edit clicked");
    // در صورت نیاز می‌توانید به همان آدرس هدایت کنید
    // router.push("/dashboard/myads");
  };

  // تعیین تصویر نهایی فقط بعد از اتمام لود
  let finalImage: string | null = null;
  if (!loading) {
    if (imageError || !profileImage) {
      finalImage = getDefaultAvatar();
    } else {
      finalImage = profileImage;
    }
  }

  return (
    <div
      className="w-full h-[10vh] rounded-[16px] flex items-center px-4 sm:h-[12vh] md:h-[80px] lg:h-[90px]"
      style={{ background: "#FFFFFF33" }}
    >
      {/* سمت راست - عکس کاربر + نام (قابل کلیک) */}
      <button
        onClick={handleProfileClick}
        className="flex items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="رفتن به صفحه پروفایل"
      >
        <div className="w-[8vh] h-[8vh] flex items-center justify-center">
          {loading ? (
            // در حین بارگذاری، به جای عکس پیش‌فرض، یک اسپینر ساده نمایش بده
            <div className="w-[60px] h-[60px] rounded-full bg-white/20 animate-pulse" />
          ) : (
            <Image
              src={finalImage!}
              alt="User"
              width={60}
              height={60}
              className="rounded-full object-cover"
              unoptimized
              onError={handleImageError}
            />
          )}
        </div>

        <div className="mx-4">
          <div className="flex flex-col justify-center text-white text-right">
            <span className="font-semibold text-[2.2vh] leading-tight">
              {fullName || ""}
            </span>
            {/* نقش کاربر حذف شده است */}
          </div>
        </div>
      </button>

      {/* سمت چپ - دکمه ویرایش */}
      <button
        onClick={handleEditClick}
        className="w-[35px] h-[35px] rounded-full flex items-center justify-center"
        style={{ background: "rgba(255, 255, 255, 0.2)" }}
        aria-label="ویرایش پروفایل"
      >
        <Image src="/images/edit.svg" alt="Edit" width={14} height={14} />
      </button>
    </div>
  );
};

export default ResProfile;
