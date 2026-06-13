"use client";
import Image from "next/image";
import Link from "next/link";
import CardContentSlide from "../../../common/CardContentSlide";

export interface CardContentDeskProps {
  id: string;
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
  className?: string;
  img?: string;
  detailsLink?: string;
  cardType: "EmployerAd" | "JobSeekerAd" | "SellerAd";
}

export default function CardContentDesk({
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
  className,
  detailsLink,
  cardType,
  img,
}: CardContentDeskProps) {
  const borderColor = "#00B6FF";

  const arrowWidth = 70;
  const arrowHeight = 60;

  const getDetailsLink = () => {
    if (detailsLink) return detailsLink;
    return `/my-ads-details/${cardType}/${id}`;
  };

  const finalDetailsLink = getDetailsLink();

  return (
    <div
      className={`hidden sm:block w-full sm:h-[48vh] relative ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: "20px",
        clipPath: `polygon(${arrowWidth}px 0, 100% 0, 100% 100%, 0 100%, 0 ${arrowHeight}px)`,
      }}
    >
      <div className="absolute top-[-2px] left-[-2px] w-[70px] h-[60px] z-20">
        <Image
          src="/images/arrow_card.svg"
          alt="arrow"
          width={arrowWidth}
          height={arrowHeight}
          className="object-cover"
        />
      </div>

      <Link href={finalDetailsLink} className="absolute bottom-0 left-0 z-20">
        <div
          className="flex items-center justify-center text-white font-[400]"
          style={{
            width: "80px",
            height: "40px",
            backgroundColor: borderColor,
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        >
          <span className="text-[2vh] lg:text-[2.5vh]">مشاهده</span>
        </div>
      </Link>
      <Link href={finalDetailsLink} className="cursor-pointer">
        <CardContentSlide
          img={img || "/images/ResUser.jpg"}
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
      </Link>
    </div>
  );
}
