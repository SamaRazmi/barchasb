"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

interface CardContentSlideProps {
  img?: string;
  personImg?: string;
  title?: string;
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
}

export default function CardContentSlide({
  img,
  personImg,
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
}: CardContentSlideProps) {
  // تصویر نهایی: اولویت با personImg، سپس img، سپس تصویر پیش‌فرض
  const finalImg = personImg || img || "/images/ResUser.jpg";

  const skillsRef = useRef<HTMLParagraphElement | null>(null);
  const salaryRef = useRef<HTMLParagraphElement | null>(null);
  const locationRef = useRef<HTMLParagraphElement | null>(null);

  const [skillsSingleLine, setSkillsSingleLine] = useState(true);
  const [salarySingleLine, setSalarySingleLine] = useState(true);
  const [locationSingleLine, setLocationSingleLine] = useState(true);

  useEffect(() => {
    if (skillsRef.current) {
      setSkillsSingleLine(
        skillsRef.current.scrollWidth <= skillsRef.current.clientWidth,
      );
    }
    if (salaryRef.current) {
      setSalarySingleLine(
        salaryRef.current.scrollWidth <= salaryRef.current.clientWidth,
      );
    }
    if (locationRef.current) {
      setLocationSingleLine(
        locationRef.current.scrollWidth <= locationRef.current.clientWidth,
      );
    }
  }, [skills, salary, location]);

  const createStyledLine = (
    text: string,
    ref: React.RefObject<HTMLParagraphElement | null>,
    isSingleLine: boolean,
  ) => (
    <div
      className="relative max-w-[100%] group cursor-default flex items-center mb-1"
      title={text}
    >
      <p
        ref={ref}
        className={`truncate text-gray-700 mb-3 whitespace-nowrap ${
          isSingleLine ? "text-center rounded-xl" : "rounded-r-2xl text-left"
        }`}
        style={
          isSingleLine
            ? {
                padding: "0.25rem 1rem",
                backgroundColor: "#f3f4f6",
                display: "inline-block",
                margin: "0 auto",
              }
            : {
                padding: "0.5rem 1rem",
                background:
                  "linear-gradient(to left, rgba(243,244,246,1) 0%, rgba(243,244,246,0.2) 100%)",
                width: "95%",
              }
        }
      >
        {text}
      </p>
    </div>
  );

  const desktopTexts = [
    title && (
      <p
        key="title"
        className="text-[3vh] font-semibold text-[#143A62] leading-[1.2] sm:leading-[1.4]"
      >
        {title}
      </p>
    ),
    personName && (
      <p
        key="person"
        className="text-[1.8vh] text-gray-700 leading-[1.2] sm:leading-[1.4]"
      >
        {personName}
      </p>
    ),
    experience && (
      <p
        key="exp"
        className="text-[1.8vh]  text-gray-500 leading-[1.2] sm:leading-[1.4]"
      >
        {experience}
      </p>
    ),
    details && (
      <p
        key="details"
        className="text-[1.8vh]  text-gray-500 leading-[1.2] sm:leading-[1.4]"
      >
        {details}
      </p>
    ),
    contactName && (
      <p
        key="contact"
        className="text-[1.8vh]  text-gray-700 leading-[1.2] sm:leading-[1.4]"
      >
        {contactName}
      </p>
    ),
    positions && (
      <p
        key="positions"
        className="text-[1.8vh]  text-gray-500 leading-[1.2] sm:leading-[1.4]"
      >
        {positions}
      </p>
    ),
    skills && createStyledLine(skills, skillsRef, skillsSingleLine),
    jobTitle && (
      <p
        key="job"
        className="text-[1.8vh]  text-gray-700 leading-[1.2] sm:leading-[1.4]"
      >
        {jobTitle}
      </p>
    ),
    jobType && (
      <p
        key="type"
        className="text-[1.8vh]  text-gray-500 leading-[1.2] sm:leading-[1.4]"
      >
        {jobType}
      </p>
    ),
    salary && createStyledLine(salary, salaryRef, salarySingleLine),
    location && createStyledLine(location, locationRef, locationSingleLine),
  ].filter(Boolean);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* فاصله بالای 8% */}
      <div className="h-[6%]"></div>

      {/* قاب عکس + تصویر - 40% ارتفاع */}
      <div className="relative h-[38%] w-[20%] flex justify-start items-center">
        <div className="absolute left-1/2 -translate-x-1/2 scale-[0.8] w-[8vh] h-[9vh] sm:w-[9vh] sm:h-[10vh] md:w-[12vh] md:h-[13vh] lg:w-[15vh] lg:h-[16vh] flex justify-center items-center origin-center">
          <Image
            src="/images/image_frame.png"
            alt="frame"
            fill
            className="object-contain"
          />
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: "url('/images/image_frame.png')",
              maskImage: "url('/images/image_frame.png')",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              backgroundImage: `url('${finalImg}')`, // استفاده از تصویر نهایی
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "110%",
              transform: "scale(1.05)",
              transformOrigin: "center",
            }}
          />
        </div>
      </div>

      {/* متن‌ها - 42% ارتفاع */}
      <div className="flex flex-col justify-between h-[50%] w-[80%] text-[2vh]  text-center">
        {desktopTexts.map((el, idx) => (
          <div key={idx}>{el}</div>
        ))}
      </div>

      {/* فاصله پایین متن تا پایین کارت 10% */}
      <div className="h-[10%]"></div>
    </div>
  );
}
