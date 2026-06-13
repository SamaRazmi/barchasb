"use client";

import Image from "next/image";
import { useState } from "react";
import CustomMenuDesk from "../CustomMenuDesk";
import CardContentPanel from "./CardContentPanel";

interface FindMenuDeskProps {
  isOpen: boolean;
  anchorEl?: HTMLElement | null;
}

const cards = [
  {
    id: 1,
    title: "مهارت‌ها",
    icon: "/images/skills_icon.png",
    description: "شغل مناسب خود را بر اساس مهارت‌های تخصصی بیابید",
  },
  {
    id: 2,
    title: "دسته‌بندی شغلی",
    icon: "/images/cat_icon.png",
    description: "در میان دسته‌های شغلی مختلف جستجو کنید",
  },
  {
    id: 3,
    title: "موقعیت مکانی",
    icon: "/images/address_icon.png",
    description: "شغل‌های نزدیک به محل زندگی خود را بیابید",
  },
];

const FindMenuDesk: React.FC<FindMenuDeskProps> = ({ isOpen, anchorEl }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(cards[0].id);

  return (
    <CustomMenuDesk isOpen={isOpen} anchorEl={anchorEl}>
      <div className="relative flex flex-row h-full p-4 mr-[-20px] mt-[0.5vh]">
        {/* کارت‌ها در سمت راست */}
        <div className="flex flex-col space-y-4 items-start mt-2 mt-[2vh]">
          {cards.map(({ id, title, icon, description }) => {
            const isSelected = selectedCard === id;

            return (
              <div
                key={id}
                onClick={() => setSelectedCard(id)}
                className="relative w-[20vw] h-[22vh] rounded-[16px] mx-1 p-4 flex flex-col justify-start cursor-pointer transition-all duration-200 mt-[1.5vh]"
                style={{
                  backgroundColor: isSelected ? "#00000033" : "#0000001A",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "#00000033";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "#0000001A";
                }}
              >
                {/* فلش سمت چپ */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-2">
                  <Image
                    src={
                      isSelected
                        ? "/images/selectedvector.png"
                        : "/images/menu_vector.png"
                    }
                    alt="arrow"
                    width={10}
                    height={10}
                  />
                </div>

                {/* آیکن و عنوان */}
                <div className="flex items-start gap-3 ml-6">
                  <div className="flex-shrink-0 w-[30px] h-[30px]">
                    <Image src={icon} alt={title} width={30} height={30} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-[3vh]">
                      {title}
                    </span>
                    <span className="text-white font-normal text-[2.2vh] mt-2 -ml-[10px]">
                      {description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* محتوای سمت چپ کارت */}
        <div className="mr-3 xl:mr-6 mt-[1.5vh] flex-grow">
          {selectedCard && <CardContentPanel selectedId={selectedCard} />}
        </div>
      </div>
    </CustomMenuDesk>
  );
};

export default FindMenuDesk;
