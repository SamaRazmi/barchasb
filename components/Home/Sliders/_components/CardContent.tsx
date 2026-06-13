"use client";

import CardContentDesk from "./CardContentDesk";
import CardContentMobile from "./CardContentMobile";

interface CardContentWrapperProps {
  id: string;
  cardType: "EmployerAd" | "JobSeekerAd" | "SellerAd";
  title: string; // الزامی شد
  personName?: string;
  experience?: string;
  img: string;
  details?: string;
  contactName?: string;
  positions?: string;
  skills?: string;
  jobTitle?: string;
  jobType?: string;
  salary?: string;
  location?: string;
  className?: string;
  detailsLink?: string;
}

export default function CardContent(props: CardContentWrapperProps) {
  return (
    <>
      <div className="block md:hidden">
        <CardContentMobile {...props} />
      </div>
      <div className="hidden md:block">
        <CardContentDesk {...props} />
      </div>
    </>
  );
}
