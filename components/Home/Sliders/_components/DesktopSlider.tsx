"use client";

import Image from "next/image";
import CardContent from "./CardContent";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";

interface Card {
  id: string;
  title?: string;
  personName?: string;
  experience?: string;
  img: string;
}

interface DesktopSliderProps {
  cards: Card[];
  cardType: "EmployerAd" | "JobSeekerAd" | "SellerAd";
}

const DesktopSlider = ({ cards, cardType }: DesktopSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <div className="hidden md:flex flex-col items-center justify-center w-full relative h-[48vh]">
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute top-0 transform -translate-y-1/2 z-30 transition-opacity duration-300 ${
          currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "opacity-100"
        }`}
      >
        <Image
          src="/images/arrow_bottom.svg"
          alt="فلش بالا"
          width={72}
          height={38}
          className="rotate-180"
          loading="lazy"
        />
      </button>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        centeredSlides
        spaceBetween={20}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        loop={false}
        speed={500}
        className="h-[48vh] w-full"
      >
        {cards.map((card) => (
          <SwiperSlide
            key={card.id}
            className="flex justify-center items-center"
          >
            <CardContent
              {...card}
              title={card.title ?? ""}
              cardType={cardType}
              // ✅ لینک صحیح با فرمت [type]/[id] و query parameter
              detailsLink={`/my-ads-details/${cardType}/${card.id}?adType=${cardType}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={handleNext}
        disabled={currentIndex === cards.length - 1}
        className={`absolute bottom-0 transform translate-y-1/2 z-30 transition-opacity duration-300 ${
          currentIndex === cards.length - 1
            ? "opacity-40 cursor-not-allowed"
            : "opacity-100"
        }`}
      >
        <Image
          src="/images/arrow_bottom.svg"
          alt="فلش پایین"
          width={72}
          height={38}
          loading="lazy"
        />
      </button>
    </div>
  );
};

export default DesktopSlider;
