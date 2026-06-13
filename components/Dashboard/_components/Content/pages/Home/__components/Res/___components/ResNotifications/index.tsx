import React, { useState } from "react";
import Image from "next/image";
import { SkillsProvider } from "@/context/SkillsContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import NotificationsFilter from "../../../../../Messages/NotificationsFilter";
import MessagesFilter from "../../../../../Messages/MessagesFilter";

const ResNotifications = () => {
  const [active, setActive] = useState<"messages" | "notifications" | null>(
    null,
  );

  // صفحه اول: نمایش دو دایره
  if (active === null) {
    return (
      <div className="sm:hidden flex flex-col items-center justify-center h-screen w-full overflow-x-hidden">
        <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-[5vh] px-[4vh] py-[5vh] m-[2vh] w-[calc(96%-4vh)] h-[calc(96%-4vh)] max-w-full">
          {/* دایره پیام‌ها */}
          <div
            onClick={() => setActive("messages")}
            className="relative cursor-pointer w-[18vh] h-[18vh]"
          >
            <Image
              src="/images/base_msg_bg_res.svg"
              alt="پیام‌ها"
              fill
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#143A62] font-bold text-base">
              پیام‌ها
            </span>
          </div>

          {/* دایره اعلان‌ها */}
          <div
            onClick={() => setActive("notifications")}
            className="relative cursor-pointer w-[18vh] h-[18vh]"
          >
            <Image
              src="/images/base_noti_bg_res.svg"
              alt="اعلان‌ها"
              fill
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#143A62] font-bold text-base">
              اعلان‌ها
            </span>
          </div>
        </div>
      </div>
    );
  }

  // صفحه پیام‌ها
  if (active === "messages") {
    return (
      <div className="sm:hidden flex flex-col h-screen w-full overflow-x-hidden bg-gray-50">
        <div className="flex items-center p-4 border-b bg-white flex-shrink-0">
          <button onClick={() => setActive(null)} className="text-2xl ml-4">
            ←
          </button>
          <span className="text-[#143A62] font-bold text-xl">پیام‌ها</span>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SkillsProvider>
            <MessagesFilter />
          </SkillsProvider>
        </div>
      </div>
    );
  }

  // صفحه اعلان‌ها
  return (
    <div className="sm:hidden flex flex-col h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="flex items-center p-4 border-b bg-white flex-shrink-0">
        <button onClick={() => setActive(null)} className="text-2xl ml-4">
          ←
        </button>
        <span className="text-[#143A62] font-bold text-xl">اعلان‌ها</span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <NotificationsProvider>
          <NotificationsFilter />
        </NotificationsProvider>
      </div>
    </div>
  );
};

export default ResNotifications;
