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

  const getDefaultAvatar = () => {
    if (gender === "female") return "/images/women_default.svg";
    if (gender === "male") return "/images/men_default.svg";
    return "/images/user.png";
  };

  const replaceImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const oldDomains = [
      "https://barchasb-data.storage.c2.liara.site",
      "https://barchasb-data.storage.c2.liara.space",
    ];
    const newBase = "https://barchasb-admin-server.ir";
    for (const oldDomain of oldDomains) {
      if (url.startsWith(oldDomain)) {
        return url.replace(oldDomain, newBase);
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
          setProfileImage(newUrl);
        } else {
          setProfileImage(null);
        }
      } catch (err) {
        console.error(err);
        setProfileImage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [userId]);

  const handleImageError = () => {
    console.error("خطا در بارگیری تصویر");
    setImageError(true);
  };

  const handleProfileClick = () => {
    router.push("/dashboard/myads");
  };

  const handleEditClick = () => {
    console.log("Edit clicked");
  };

  let finalImage: string;
  if (!loading) {
    if (imageError || !profileImage) {
      finalImage = getDefaultAvatar();
    } else {
      finalImage = profileImage;
    }
  } else {
    finalImage = getDefaultAvatar(); // مقدار موقت در حین لود (استفاده نمی‌شود)
  }

  return (
    <div
      className="w-full h-[10%] md:hidden rounded-[16px] flex items-center px-4"
      style={{ background: "#FFFFFF33" }}
    >
      <button
        onClick={handleProfileClick}
        className="flex items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="رفتن به صفحه پروفایل"
      >
        {/* div کانتینر با position: relative و ابعاد 8vh */}
        <div className="w-[8vh] h-[8vh] relative flex items-center justify-center">
          {loading ? (
            <div className="w-full h-full rounded-full bg-white/20 animate-pulse" />
          ) : (
            <Image
              src={finalImage}
              alt="User"
              fill
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
          </div>
        </div>
      </button>

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
