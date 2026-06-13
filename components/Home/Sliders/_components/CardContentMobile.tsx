"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

interface CardContentMobileProps {
  id?: string;
  title: string;
  personName?: string;
  experience?: string;
  details?: string;
  contactName?: string;
  positions?: string;
  skills?: string;
  jobTitle?: string;
  jobType?: string;
  salary?: string;
  location?: string;
  img?: string;
  className?: string;
  detailsLink?: string;
  cardType?: "EmployerAd" | "JobSeekerAd" | "SellerAd";
}

export default function CardContentMobile({
  id,
  title,
  personName,
  experience,
  details,
  contactName,
  positions,
  skills,
  jobTitle,
  jobType,
  salary,
  location,
  img = "/images/ResUser.jpg",
  className,
  detailsLink = "#",
  cardType,
}: CardContentMobileProps) {
  const [currentImg, setCurrentImg] = useState(img);

  // هر بار که img پروپ تغییر کند، state را به‌روز می‌کنیم
  useEffect(() => {
    setCurrentImg(img);
  }, [img]);

  const getValidSrc = (src: string) => {
    if (
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("/")
    ) {
      return src;
    }
    return "/images/ResUser.jpg";
  };

  const finalDetailsLink = (() => {
    if (detailsLink !== "#") return detailsLink;
    if (!id) return "#";
    if (cardType) {
      return `/my-ads-details/${cardType}/${id}`;
    }
    return `/my-ads-details/${id}`;
  })();

  const createStyledLine = (
    text: string,
    ref: React.RefObject<HTMLParagraphElement | null>,
  ) => {
    const [isSingleLine, setIsSingleLine] = useState(true);

    useEffect(() => {
      if (ref.current) {
        setIsSingleLine(ref.current.scrollWidth <= ref.current.clientWidth);
      }
    }, [text, ref]);

    return (
      <p
        ref={ref}
        className={`text-xs text-gray-500 mb-2 whitespace-nowrap overflow-hidden ${
          isSingleLine ? "rounded-full" : "rounded-r-2xl"
        }`}
        style={
          isSingleLine
            ? {
                padding: "0.125rem 0.25rem",
                backgroundColor: "#f3f4f6",
                display: "inline-block",
                marginLeft: "auto",
                marginRight: 0,
                width: "fit-content",
                maxWidth: "90%",
                textOverflow: "ellipsis",
              }
            : {
                padding: "0.25rem 0.5rem",
                background:
                  "linear-gradient(to left, rgba(243,244,246,1) 0%, rgba(243,244,246,0.5) 100%)",
                display: "inline-block",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "fit-content",
                maxWidth: "90%",
              }
        }
      >
        {text}
      </p>
    );
  };

  const skillsRef = useRef<HTMLParagraphElement | null>(null);
  const salaryRef = useRef<HTMLParagraphElement | null>(null);
  const locationRef = useRef<HTMLParagraphElement | null>(null);

  const handleImageLoad = () => {
    // console.log(
    //   `✅ عکس آگهی «${title}» با موفقیت لود شد (مسیر: ${getValidSrc(currentImg)})`,
    // );
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    // console.error(`❌ خطا در لود عکس آگهی «${title}» - مسیر نامعتبر: ${img}`);
    (e.target as HTMLImageElement).src = "/images/ResUser.jpg";
  };

  const handleArrowLoad = () => {
    // console.log(`🟢 آیکون فلش کارت موبایل لود شد (آگهی: ${title})`);
  };

  const handleArrowError = () => {
    // console.warn(`⚠️ آیکون فلش کارت موبایل لود نشد (آگهی: ${title})`);
  };

  return (
    <div
      className={`relative w-full h-[164px] sm:h-[220px] md:hidden ${className}`}
    >
      <div
        className="absolute inset-0 border border-[#00B6FF] rounded-[20px]"
        style={{
          clipPath: "polygon(34px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 28px)",
        }}
      />

      <div className="absolute top-0 left-0 z-20 w-[35px] h-[35px] overflow-hidden bg-white">
        <img
          src="/images/arrow_card.svg"
          alt="arrow"
          width={45}
          height={40}
          onLoad={handleArrowLoad}
          onError={handleArrowError}
        />
      </div>

      <Link href={finalDetailsLink} className="absolute bottom-0 left-0 z-20">
        <div
          className="w-[85px] h-[22px] flex items-center justify-center text-white text-[16px] font-[400]"
          style={{
            backgroundColor: "#00B6FF",
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        >
          جزئیات
        </div>
      </Link>

      {/* کلید راه‌حل: استفاده از key={currentImg} برای اجبار به لود مجدد تصویر */}
      <div className="absolute top-0 right-0 h-full w-[131px] overflow-hidden border-l border-gray-300 rounded-r-[20px]">
        <img
          key={currentImg}
          src={getValidSrc(currentImg)}
          alt={title}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <div className="pr-[131px] w-full p-3 mr-2 flex flex-col justify-between text-right overflow-hidden z-10 h-full">
        <div className="flex flex-col justify-start h-full py-2 space-y-2">
          {title && (
            <p className="text-[20px] font-semibold text-[#143A62] truncate leading-[1.4]">
              {title}
            </p>
          )}
          {personName && (
            <p className="text-xs text-gray-700 truncate leading-[1.5]">
              {personName}
            </p>
          )}
          {experience && (
            <p className="text-xs text-gray-500 truncate leading-[1.5]">
              {experience}
            </p>
          )}
          {details && (
            <p className="text-xs text-gray-500 truncate leading-[1.5]">
              {details}
            </p>
          )}
          {contactName && (
            <p className="text-xs text-gray-700 truncate leading-[1.5]">
              {contactName}
            </p>
          )}
          {positions && (
            <p className="text-xs text-gray-500 truncate leading-[1.5]">
              {positions}
            </p>
          )}
          {skills && createStyledLine(skills, skillsRef)}
          {jobTitle && (
            <p className="text-xs text-gray-700 truncate leading-[1.5]">
              {jobTitle}
            </p>
          )}
          {jobType && (
            <p className="text-xs text-gray-500 truncate leading-[1.5]">
              {jobType}
            </p>
          )}
          {salary && createStyledLine(salary, salaryRef)}
          {location && createStyledLine(location, locationRef)}
        </div>
      </div>
    </div>
  );
}
