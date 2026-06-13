"use client";
import Image from "next/image";
import CardContentSlide from "../../../../../../../common/CardContentSlide";

interface SliderSidebarProps {
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
}

export default function SliderSidebar({
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
  img,
  className,
}: SliderSidebarProps) {
  return (
    <div className={`relative w-[275px] h-[95%] ${className}`}>
      {/* لایه رنگی کوچک گوشه بالا سمت چپ */}
      <div className="absolute top-0 left-0 w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] bg-[#F5F5F5] rounded-br-xl z-10"></div>

      {/* باکس اصلی با بوردر */}
      <div className="absolute inset-0 border-2 border-[#143A6233] bg-white rounded-xl"></div>

      {/* فلش بالا سمت چپ */}
      <div className="absolute top-0 left-0 z-20 bg-[#F5F5F5] overflow-hidden">
        <Image
          src="/images/arrow_slidepanel.svg"
          alt="arrow"
          width={55}
          height={55}
          className="sm:w-[50px] sm:h-[50px] w-[35px] h-[35px]"
        />
      </div>

      {/* محتوا: CardContentSlide وسط عمودی */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <CardContentSlide
          img={img}
          title={title}
          personName={personName}
          experience={experience}
          details={details}
          contactName={contactName}
          positions={positions}
          skills={skills}
          jobTitle={jobTitle}
          jobType={jobType}
          salary={salary}
          location={location}
        />
      </div>
    </div>
  );
}
