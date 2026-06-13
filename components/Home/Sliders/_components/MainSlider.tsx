"use client";

import { useState } from "react";
import DesktopSlider from "./DesktopSlider";
import MobileSlider from "./MobileSlider";

interface Card {
  id: string;
  title?: string;
  personName?: string;
  experience?: string;
  img: string;
}

interface MainSliderProps {
  title?: string;
  cards: Card[];
  cardType: "EmployerAd" | "JobSeekerAd" | "SellerAd"; 
}

const MainSlider = ({ title, cards, cardType }: MainSliderProps) => {
  const [startIndex, setStartIndex] = useState(0);

  return (
    <div className="w-full h-auto sm:h-[60vh] flex flex-col">
      {title && (
        <h2 className="text-[#143A62] text-[22px] font-bold mb-4 sm:h-[5vh]">
          {title}
        </h2>
      )}

      {/* DesktopSlider */}
      <div className="hidden sm:block sm:h-[55vh] sm:w-[88%]">
        <DesktopSlider cards={cards} cardType={cardType} />
      </div>

      {/* MobileSlider */}
      <div className="block sm:hidden">
        <MobileSlider
          cards={cards}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
          cardType={cardType}
        />
      </div>
    </div>
  );
};

export default MainSlider;
