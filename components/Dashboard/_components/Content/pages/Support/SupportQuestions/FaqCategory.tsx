"use client";
import React from "react";
import { FaqItem } from "./index";

interface FaqCategoryProps {
  title: string;
  items: FaqItem[];
  isExpanded: boolean;
  onToggle: () => void;
  selectedFaqId: string | null;
  onSelectFaq: (faq: FaqItem) => void;
}

const FaqCategory: React.FC<FaqCategoryProps> = ({
  title,
  items,
  isExpanded,
  onToggle,
  selectedFaqId,
  onSelectFaq,
}) => {
  return (
    <div className="mb-[1vh] rounded-xl overflow-hidden backdrop-blur-sm shadow-md w-full">
      {/* هدر دسته - تیره‌تر از سوالات */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-[1.5vh] bg-[#143A62]/4 text-right font-bold text-[#143A62] text-[2vh]"
      >
        <span>{title}</span>
        <span className="text-[2vh]">{isExpanded ? "−" : "+"}</span>
      </button>

      {/* لیست سوالات */}
      {isExpanded && (
        <div className="p-[1.5vh] flex flex-col gap-[1vh]">
          {items.map((item, idx) => {
            const isSelected = selectedFaqId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectFaq(item)}
                className={`flex items-center  gap-[1.5vh] p-[1.2vh] rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "border-[0.2vh] border-[#1E3A8A] bg-[#1E3A8A]/10 shadow-md"
                    : "border-[0.1vh] border-gray-300 hover:bg-white/50"
                }`}
              >
                {/* کادر شماره */}
                <div className="bg-[#FFFFFF80] rounded-lg px-[1.5vh] py-[2vh] text-[2vh] font-mono text-gray-700 min-w-[5vh] text-center">
                  {idx + 1}
                </div>
                {/* کادر متن سوال */}
                <div className="bg-[#FFFFFF80] rounded-lg px-[3vh] py-[2vh] w-[90%] text-right text-[#143A62] text-[2vh] leading-[3vh]">
                  {item.question}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FaqCategory;
