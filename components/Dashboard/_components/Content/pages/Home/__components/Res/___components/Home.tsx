// Home.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import SidePanelWithProvider from "../../../../../pages/Home/__components/Desk/SidePanel";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import CircleProgress from "../../Desk/CircleProgress";
import BarChart from "../../Desk/BarChart";
import { useEffect, useState } from "react";
import { fetchInAppNotifications } from "@/api/apiNotifications";
import { useUser } from "@/context/UserContext";

const Home = () => {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

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
    <div className="relative flex-1 h-full">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        className="h-full"
      >
        <SwiperSlide>
          <div className="h-[95%] flex items-center justify-center text-xl">
            <SidePanelWithProvider />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          {/* فقط در سایز کمتر از md نمایش داده می‌شود */}
          <div className="block md:hidden h-full">
            <div className="flex flex-col h-full p-3 gap-4">
              {/* سطر اول */}
              <div className="grid grid-cols-2 gap-4">
                {/* راست: اعلان های دریافتی */}
                <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-5 px-2 text-center">
                  <p className="text-[20px] font-bold text-[#143A62]">
                    {unreadCount}
                  </p>
                  <p className="text-[15px] font-medium text-[#143A62]">
                    اعلان های دریافتی
                  </p>
                </div>
                

                {/* چپ: نمودار دایره‌ای (مانده اشتراک) */}
                <div className="rounded-lg overflow-hidden shadow-sm">
                  <CircleProgress dayPercent={70} notificationPercent={45} />
                </div>
              </div>

              {/* سطر دوم */}
              <div className="grid grid-cols-2 gap-4">
                {/* راست: آمار ماه جاری */}
                <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-5 px-2 text-center">
                  <p className="text-[20px] font-bold text-[#143A62]">2000</p>
                  <p className="text-[15px] font-medium text-[#143A62]">
                    آمار ماه جاری
                  </p>
                </div>
                {/* چپ: آگهی ها فعال */}
                <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-5 px-2 text-center">
                  <p className="text-[20px] font-bold text-[#143A62]">5</p>
                  <p className="text-[15px] font-medium text-[#143A62]">
                    آگهی های فعال
                  </p>
                </div>
              </div>

              {/* نمودار میله‌ای */}
              <div className="flex-1 min-h-0">
                <BarChart />
              </div>
            </div>
          </div>

          {/* نمایش قبلی (فقط در سایز md و بالاتر) */}
          <div className="hidden md:block h-full flex items-center justify-center text-xl">
            Slide 2
          </div>
        </SwiperSlide>
      </Swiper>
      <style jsx>{`
        :global(.swiper-pagination) {
          bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
