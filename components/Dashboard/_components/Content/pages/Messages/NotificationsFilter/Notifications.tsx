"use client";
import React from "react";
import { useSuggestions } from "@/context/SuggestionsContext";

const Notifications: React.FC = () => {
  const { suggestions, isLoading, used, remaining } = useSuggestions();

  if (isLoading) {
    return (
      <div className="text-center mt-10">در حال بارگذاری پیشنهادات...</div>
    );
  }

  if (suggestions.length === 0) {
    return <div className="text-center mt-10">هیچ پیشنهادی یافت نشد.</div>;
  }

  return (
    <div className="w-full p-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {suggestions.map((item) => (
        <div key={item.id} className="relative h-[22vh]">
          <div className="bg-white h-full rounded-[20px] shadow-md p-2 flex flex-col justify-between relative overflow-visible">
            <div className="pr-[40%]">
              <div className="bg-gray-100 rounded-[5px] px-[1.5vh] py-[0.6vh] w-fit">
                <p className="text-[2vh] font-bold text-[#143A62]">
                  {item.title || item.name || "بدون عنوان"}
                </p>
              </div>
              <p className="text-[1.4vh] mt-1 text-[#00000080]">
                {/* می‌توانید توضیحات یا نوع آگهی را نشان دهید */}
              </p>

              <div className="bg-gray-100 rounded-[5px] px-[1vh] py-[1px] h-fit w-fit my-1 flex leading-none relative">
                {Array.from({ length: 5 }, (_, i) => {
                  const rating = item.rating || 0;
                  const full = i + 1 <= Math.floor(rating);
                  const hasFraction =
                    i === Math.floor(rating) && rating % 1 !== 0;
                  const fraction = rating % 1;

                  return (
                    <span
                      key={i}
                      className="relative text-[3vh] leading-none text-gray-300"
                    >
                      ★
                      {full && (
                        <span className="absolute inset-0 overflow-hidden text-yellow-400">
                          ★
                        </span>
                      )}
                      {hasFraction && (
                        <span
                          className="absolute inset-0 text-yellow-400 overflow-hidden"
                          style={{ width: `${fraction * 100}%` }}
                        >
                          ★
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="text-left text-[1.5vh] mb-auto mt-5 line-clamp-2">
              {item.skills?.join("، ") || ""}
            </div>

            <div className="absolute -top-[8%] -right-[8%] w-[45%] h-[15vh] border-8 border-gray-100 rounded-[20px] bg-white flex items-center justify-center">
              <img
                src={item.image || "/images/user.png"}
                alt="user"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
