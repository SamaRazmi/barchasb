import React from "react";
import Image from "next/image";
import MessagesFilter from "../MessagesFilter";
import { SkillsProvider } from "@/context/SkillsContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import NotificationsFilter from "../NotificationsFilter";

const MessagesContent: React.FC = () => {
  return (
    <div className="relative flex flex-row gap-4 mt-1 sm:mt-[1%] h-full">
      {/* بک‌گراند */}
      <Image
        src="/images/bg_messages_dashboard.svg"
        alt="Background"
        fill
        className="object-cover rounded-[20px] pointer-events-none z-0"
      />

      {/* سمت چپ - پیام‌ها */}
      <div className="flex-1 w-full flex flex-col items-center">
        {/* عنوان پیام‌ها (وسط افقی) */}
        <div className="w-full flex justify-center mt-[1vh] px-4">
          <div className="text-[#143A62] font-bold text-[2.5vh] lg:text-[5vh]">
            پیام‌ها
          </div>
        </div>

        {/* فیلتر (وسط افقی زیر عنوان) */}
        <div className="w-full flex justify-center mt-4 px-4 z-10">
          <div className="w-full max-w-[800px]">
            <SkillsProvider>
              <MessagesFilter />
            </SkillsProvider>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center">
        {/* عنوان اعلان‌ها (وسط افقی) */}
        <div className="w-full flex justify-center mt-[1vh] px-4">
          <div className="text-[#143A62] font-bold text-[2.5vh] lg:text-[5vh]">
            پیشنهادات هوشمند
          </div>
        </div>

        {/* فیلتر (وسط افقی زیر عنوان) */}
        <div className="w-full flex justify-center items-center  mt-4 px-4 z-10">
          <div className="w-full max-w-[800px]">
            <NotificationsProvider>
              <NotificationsFilter />
            </NotificationsProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesContent;
