"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { userLogedTrue } from "@/store/slices/logedSlice";
import MoreOptions from "./MoreOptions";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const ICON_PATHS = {
  EDIT: "/images/edit.svg",
  OPTIONS: "/images/3-dots.svg",
} as const;

const IconButton: React.FC<{
  src: string;
  alt: string;
  width: number;
  height: number;
  tooltip?: string;
  emoji?: string;
  onClick?: () => void;
}> = ({ src, alt, width, height, tooltip, emoji, onClick }) => (
  <div className="relative flex flex-col items-center group">
    <button
      onClick={onClick}
      aria-label={alt}
      className="w-[6vh] h-[6vh] rounded-full bg-[#FFFFFF4D] flex items-center justify-center hover:opacity-80 transition-opacity"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
        unoptimized
      />
    </button>

    {tooltip && (
      <span
        className="
          hidden md:flex
          pointer-events-none
          absolute -top-10
          rounded-lg bg-black text-white px-1 py-1 text-[1.5vh]
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          items-center gap-1
        "
      >
        {emoji && <span className="text-[1.6vh]">{emoji}</span>} {tooltip}
      </span>
    )}
  </div>
);

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user: contextUser } = useUser();
  const userId = contextUser?._id;
  const gender = contextUser?.gender;

  const { fullName } = useSelector((state: RootState) => state.loged);
  const role = useSelector((state: RootState) => state.role.value);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDefaultAvatar = () => {
    if (gender === "female") return "/images/women_default.svg";
    if (gender === "male") return "/images/men_default.svg";
    return "/images/user.png";
  };

  // ✅ اصلاح شده: پشتیبانی از هر دو دامنه قدیمی (.site و .space)
  const replaceImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const oldDomains = [
      "https://barchasb-data.storage.c2.liara.site",
      "https://barchasb-data.storage.c2.liara.space",
    ];
    const newBase = "https://barchasb-admin-server.ir";
    for (const oldDomain of oldDomains) {
      if (url.startsWith(oldDomain)) {
        const newUrl = url.replace(oldDomain, newBase);
        console.log("🖼️ تبدیل آدرس عکس:", url, "→", newUrl);
        return newUrl;
      }
    }
    return url;
  };

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
          console.log(
            "🖼️ تبدیل آدرس عکس:",
            data.profile.profileImage,
            "→",
            newUrl,
          );
          setProfileImage(newUrl);
        } else {
          setProfileImage(null);
        }
      } catch (err) {
        console.error("❌ خطا در دریافت عکس پروفایل:", err);
        setProfileImage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [userId]);

  let finalImage: string | null = null;
  if (imageError) {
    finalImage = getDefaultAvatar();
  } else if (!loading && profileImage) {
    finalImage = profileImage;
  } else if (!loading && !profileImage) {
    finalImage = getDefaultAvatar();
  }

  const handleImageError = () => {
    console.error("❌ خطا در لود تصویر:", finalImage);
    setImageError(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://barchasb-server.liara.run/api/auth/me",
          { credentials: "include" },
        );
        const data = await res.json();
        if (data?.user) {
          dispatch(
            userLogedTrue({
              name: data.user.name || "",
              lastName: data.user.lastName || "",
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleEditClick = () => {
    router.push("/dashboard/myads");
  };

  const handleOptionsClick = () => {
    setShowOptions(true);
  };

  const handleBack = () => {
    setShowOptions(false);
  };

  const handleSharePlan = () => {
    router.push("/dashboard/billing");
  };

  const handleMyProjects = () => {
    router.push("/dashboard/myads?activeTab=myAds");
  };

  const handleBookmarks = () => {
    router.push("/dashboard/myads?activeTab=achievements");
  };

  if (showOptions) {
    return (
      <MoreOptions
        onSharePlan={handleSharePlan}
        onMyProjects={handleMyProjects}
        onBookmarks={handleBookmarks}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="w-full h-full bg-[#FFFFFF33] rounded-[16px] flex flex-col items-center justify-between py-[1.6vh] px-[2.5vh]">
      <div className="w-[12vh] h-[12vh] rounded-full overflow-hidden relative bg-white/10 flex items-center justify-center">
        {finalImage ? (
          <Image
            src={finalImage}
            alt={fullName ? `${fullName}'s profile picture` : "profile picture"}
            fill
            className="object-cover rounded-full"
            priority
            sizes="60px"
            unoptimized
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
        )}
      </div>

      <div className="w-full h-[6vh] flex flex-col items-center space-y-[0.5vh] mt-[1.5vh]">
        {fullName && (
          <h2 className="text-white text-[2.6vh] font-semibold text-center">
            {fullName}
          </h2>
        )}
      </div>

      <div className="w-full flex justify-between items-center">
        <IconButton
          src={ICON_PATHS.OPTIONS}
          alt="گزینه‌های بیشتر"
          width={5}
          height={20}
          onClick={handleOptionsClick}
          tooltip="گزینه‌های بیشتر"
          emoji="⚙️"
        />

        <IconButton
          src={ICON_PATHS.EDIT}
          alt="ویرایش پروفایل"
          width={18}
          height={18}
          onClick={handleEditClick}
          tooltip="ویرایش پروفایل"
          emoji="✏️"
        />
      </div>
    </div>
  );
};

export default Profile;
