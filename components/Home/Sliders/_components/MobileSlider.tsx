"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IconButton } from "@mui/material";
import CardContent from "./CardContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Swiper as SwiperType } from "swiper";

interface Card {
  id: string;
  title?: string;
  personName?: string;
  experience?: string;
  img: string;
}

interface MobileSliderProps {
  cards: Card[];
  startIndex: number;
  setStartIndex: (index: number) => void;
  cardType: "EmployerAd" | "JobSeekerAd" | "SellerAd";
}

const MobileSlider = ({
  cards,
  startIndex,
  setStartIndex,
  cardType,
}: MobileSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [arrowPos, setArrowPos] = useState({ left: 0, right: 0, top: 0 });

  const updateArrowPosition = useCallback(() => {
    const centerSlide = slideRefs.current[startIndex];
    const container = containerRef.current;
    if (!centerSlide || !container) return;

    const rect = centerSlide.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    const cardCenterY = rect.top - parentRect.top + rect.height / 2;
    const arrowWidth = 50;
    const offset = 10;

    setArrowPos({
      left: rect.left - parentRect.left - arrowWidth / 2 - offset,
      right: parentRect.right - rect.right - arrowWidth / 2 - offset,
      top: cardCenterY,
    });
  }, [startIndex]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const onTransitionEnd = () => {
      setStartIndex(swiper.realIndex);
      updateArrowPosition();
    };

    swiper.on("transitionEnd", onTransitionEnd);
    window.addEventListener("resize", updateArrowPosition);
    const initTimer = setTimeout(updateArrowPosition, 400);

    return () => {
      swiper.off("transitionEnd", onTransitionEnd);
      window.removeEventListener("resize", updateArrowPosition);
      clearTimeout(initTimer);
    };
  }, [updateArrowPosition, setStartIndex]);

  const handlePrev = () => {
    swiperRef.current?.slidePrev(1);
  };

  const handleNext = () => {
    swiperRef.current?.slideNext(1);
  };

  return (
    <div
      ref={containerRef}
      className="md:hidden w-full relative flex justify-center mb-6"
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: true,
        }}
        loop={cards.length > 2}
        watchSlidesProgress
        slidesPerView="auto"
        centeredSlides
        spaceBetween={10}
        style={{ paddingLeft: 5, paddingRight: 5 }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setStartIndex(swiper.realIndex)}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={card.id} className="!w-[328px] flex justify-center">
            <div
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className="mx-auto relative"
            >
              <Image
                src="/images/heart.png"
                alt="heart"
                width={27}
                height={27}
                className="absolute top-2 right-2 z-40"
              />
              {/* اضافه کردن detailsLink مشابه نسخه دسکتاپ */}
              <CardContent
                {...card}
                title={card.title ?? ""}
                cardType={cardType}
                detailsLink={`/my-ads-details/${cardType}/${card.id}?adType=${cardType}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* فلش چپ */}
      <IconButton
        onClick={handlePrev}
        disableRipple
        className="!absolute z-30 transition-all duration-300"
        style={{ left: arrowPos.left, top: arrowPos.top - 15 }}
      >
        <Image
          src="/images/arrow_bottom.svg"
          alt="فلش چپ"
          width={50}
          height={31}
          className="rotate-90"
        />
      </IconButton>

      {/* فلش راست */}
      <IconButton
        onClick={handleNext}
        disableRipple
        className="!absolute z-30 transition-all duration-300"
        style={{ right: arrowPos.right, top: arrowPos.top - 15 }}
      >
        <Image
          src="/images/arrow_bottom.svg"
          alt="فلش راست"
          width={50}
          height={31}
          className="-rotate-90"
        />
      </IconButton>
    </div>
  );
};

export default MobileSlider;
