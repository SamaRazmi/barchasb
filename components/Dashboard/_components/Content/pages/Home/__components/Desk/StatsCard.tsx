"use client";
import React, { useEffect, useState } from "react";
import { fetchInAppNotifications } from "@/api/apiNotifications";
import { useUser } from "@/context/UserContext";

const StatsCard: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      try {
        const notifications = await fetchInAppNotifications();
        const unread = notifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (e) {
        setUnreadCount(0);
      }
    };

    load();
  }, [user]);

  return (
    <div className="relative h-[24vh] w-[70%] flex justify-start mt-[1vh]">
      <div className="bg-white rounded-[20px] h-full w-full flex">
        {/* بخش سمت راست */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <p className="text-[20px] font-bold text-[#143A62]">{unreadCount}</p>
          <p className="text-[15px] font-medium text-[#143A62]">
            اعلان های دریافتی
          </p>
        </div>

        {/* خط جداکننده اول */}
        <div
          className="w-[2px] h-[60%] self-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(20, 58, 98, 0.05) 0%, rgba(20, 58, 98, 0.5) 47.6%, rgba(20, 58, 98, 0.05) 100%)",
          }}
        ></div>

        {/* بخش وسط */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <p className="text-[20px] font-bold text-[#143A62]">2000</p>
          <p className="text-[15px] font-medium text-[#143A62]">
            آمار ماه جاری
          </p>
        </div>

        {/* خط جداکننده دوم */}
        <div
          className="w-[2px] h-[60%] self-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(20, 58, 98, 0.05) 0%, rgba(20, 58, 98, 0.5) 47.6%, rgba(20, 58, 98, 0.05) 100%)",
          }}
        ></div>

        {/* بخش سمت چپ */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <p className="text-[20px] font-bold text-[#143A62]">5</p>
          <p className="text-[15px] font-medium text-[#143A62]">آگهی ها فعال</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
