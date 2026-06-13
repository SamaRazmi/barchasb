"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useMediaQuery } from "@mui/material";

interface UserCardProps {
  name: string;
  role: string;
  scoreTitle: string;
  scoreStars: number;
  imageSrc: string;
  textContent: string;
}

const UserCard: React.FC<UserCardProps> = ({
  name,
  role,
  scoreTitle,
  scoreStars,
  imageSrc,
  textContent,
}) => {
  const TOTAL_STARS = 5;
  return (
    <div>
      <div className="bg-[#E3E8ED] relative flex flex-col md:gap-0.5 gap-1 md:h-[50vh] h-[52vh] rounded-[16px] py-[15px] px-[3vh] ">
        {/* اطلاعات فردی و ستاره */}
        <div className="flex flex-col md:flex-row md:justify-between gap-[6vh] md:gap-[4vh] items-center md:px-[0.5vh] px-[1vh]">
          {/* اطلاعات فردی  */}
          <div className="flex flex-row w-full items-center md:justify-start justify-between md:gap-[4vh] gap-[2vh]">
            {/* پروفایل */}
            <div>
              <Image
                src={imageSrc}
                alt="user"
                width={100}
                height={100}
                className="rounded-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]
                md:w-[12vh] md:h-[12vh] w-[9vh] h-[9vh] "
              />
            </div>
            {/* اسم و شغل */}
            <div className="flex flex-col gap-3">
              <p className="text-[#143A62] font-bold md:text-[3vh] text-[2vh] leading-6 truncate ">
                {name}
              </p>

              <p className="text-black/60 font-bold text-[2.5vh] leading-5">
                {role}
              </p>
            </div>
          </div>
          {/* امتیاز*/}
          <div
            className="relative
          flex md:flex-col  md:gap-2 gap-[6vh] md:w-fit w-full md:justify-end justify-between "
          >
            {/*امتیاز داستان و آیکون  */}
            <div className="flex gap-5 items-center ">
              <p className="font-bold text-[#143A62] text-[2vh] truncate ">
                {scoreTitle}
              </p>
              <Image
                src="/images/like.svg"
                alt="like"
                width={28}
                height={28}
                className="absolute left-0 md:-top-1 -top-[4vh] "
              />
            </div>
            {/* ستاره ها */}

            <div className="bg-white/20 md:py-[2vh] py-[1vh] px-[1vh] md:px-[1.5vh] relative col-span-2 h-1/2 rounded-[1.4vh] flex items-center justify-between gap-1 overflow-hidden min-h-[5vh]">
              {Array.from({ length: 5 }).map((_, i) => {
                const isActive = i >= 5 - scoreStars;

                return (
                  <div
                    key={i}
                    className="flex-1 max-w-[3.5vh] aspect-square flex items-center justify-center"
                  >
                    <Image
                      src={isActive ? "/images/star2.svg" : "/images/star1.svg"}
                      alt="star"
                      width={35}
                      height={35}
                      className="w-full h-full object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* متن داستان  */}
        <div>
          {/* متن */}
          <div
            className="relative bg-white rounded-[16px] sm:my-[2vh] p-[2vh] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]
              text-justify overflow-hidden md:h-[30vh] h-[27vh]"
          >
            <p className="font-semibold text-[1.5vh] sm:text-[2vh] leading-[3.5vh] sm:leading-[4vh]">
              {textContent}
            </p>

            {/* سایه/فید فقط روی سفید */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12.5vh] bg-gradient-to-b from-white/0 to-white" />
          </div>

          {/* دکمه */}
          <div>
            {" "}
            <button className="absolute md:bottom-[5vh] bottom-[4.5vh] left-[4.5vh] text-[2vh] bg-[#143A62] text-white px-[2vh] py-[1vh] sm:px-[2vh] sm:py-[1.5vh] rounded-[1.5vh]">
              مشاهده کامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const UserCards: React.FC = () => {
  const textContent = `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم...`;

  const users = [
    {
      name: "سمانه رزمی",
      role: "طراح سایت",
      scoreTitle: "امتیاز داستان",
      scoreStars: 3,
      imageSrc: "/images/user.png",
      textContent,
    },
    {
      name: "محمد سالاری",
      role: "طراح سایت",
      scoreTitle: "امتیاز داستان",
      scoreStars: 2,
      imageSrc: "/images/user.png",
      textContent,
    },
    {
      name: "علی رضایی",
      role: "مدیر پروژه",
      scoreTitle: "امتیاز داستان",
      scoreStars: 4,
      imageSrc: "/images/user.png",
      textContent,
    },
    {
      name: "لیلا احمدی",
      role: "توسعه دهنده",
      scoreTitle: "امتیاز داستان",
      scoreStars: 5,
      imageSrc: "/images/user.png",
      textContent,
    },
  ];

  const [activeRealIndex, setActiveRealIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const total = users.length;

  const updateVisibleCount = (swiper: any) => {
    const current =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1;

    setVisibleCount(current >= 2 ? 2 : 1);
  };

  return (
    <div className="w-full mt-4 mb-5">
      <Swiper
        dir="rtl"
        navigation
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 1, // دقیقاً یکی برای اینکه مطمئن شوی تکی شده
            centeredSlides: true,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
            spaceBetween: 10,
          },
          1000: {
            slidesPerView: 2,
            centeredSlides: false,
            slidesOffsetBefore: 90,
            slidesOffsetAfter: 90,
            spaceBetween: 30,
          },
        }}
        onSwiper={(swiper) => {
          setActiveRealIndex(swiper.realIndex);
          updateVisibleCount(swiper);
        }}
        onBreakpoint={(swiper) => {
          updateVisibleCount(swiper);
        }}
        onActiveIndexChange={(swiper) => {
          setActiveRealIndex(swiper.realIndex);
        }}
        onTouchStart={() => setIsDragging(true)}
        onSliderFirstMove={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTransitionEnd={() => setIsDragging(false)}
      >
        {users.map((user, index) => {
          let isVisible = false;

          for (let i = 0; i < visibleCount; i++) {
            if ((activeRealIndex + i) % total === index) {
              isVisible = true;
              break;
            }
          }

          const opacityClass = isDragging
            ? "opacity-100"
            : isVisible
              ? "opacity-100"
              : "opacity-60";

          return (
            <SwiperSlide key={index}>
              <div
                className={`transition-opacity duration-300 ${opacityClass}`}
              >
                <UserCard {...user} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default UserCards;
