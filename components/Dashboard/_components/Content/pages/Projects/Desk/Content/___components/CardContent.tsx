import React from "react";
import { useRouter } from "next/navigation";
import { DigitalAd } from "@/types/digitalTypes";
import { trackAdView as defaultTrackView } from "@/api/apiAdView";

interface CardContentProps {
  ads: DigitalAd[];
  onTrackView?: (adId: string, adType: string) => Promise<any>;
}

const CardContent: React.FC<CardContentProps> = ({
  ads,
  onTrackView = defaultTrackView,
}) => {
  const router = useRouter();

  const handleCardClick = async (adId: string) => {
    try {
      await onTrackView(adId, "DigitalAd");
    } catch (error) {
      console.error("خطا در ثبت بازدید:", error);
    }
    // تغییر مسیر به فرمت مورد نظر
    router.push(`/dashboard/projects/${adId}?adType=DigitalAd`);
  };

  const getDaysAgoText = (createdAt: string) => {
    const now = new Date();
    const adDate = new Date(createdAt);
    const diffInMs = now.getTime() - adDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays === 0 ? "امروز" : `${diffInDays} روز پیش`;
  };

  const getFreshLabel = (createdAt: string) => {
    const now = new Date();
    const adDate = new Date(createdAt);

    if (
      adDate.getDate() === now.getDate() &&
      adDate.getMonth() === now.getMonth() &&
      adDate.getFullYear() === now.getFullYear()
    )
      return "امروز";

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (adDate >= startOfWeek && adDate <= endOfWeek) return "این هفته";

    if (
      adDate.getFullYear() === now.getFullYear() &&
      adDate.getMonth() === now.getMonth()
    )
      return "این ماه";

    if (adDate.getFullYear() === now.getFullYear()) return "سال اخیر";

    return `سال ${adDate.getFullYear()}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-3 lg:gap-x-6 lg:gap-y-6">
      {ads.length === 0 ? (
        <p>در حال بارگذاری یا هیچ پروژه‌ای موجود نیست...</p>
      ) : (
        ads.map((ad) => (
          <div
            key={ad._id}
            onClick={() => handleCardClick(ad._id)}
            className="relative bg-white border-2 rounded-[20px] p-2 w-full min-h-[160px] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* بخش بالای کارت */}
            <div className="flex items-center">
              <div className="bg-[#143A6233] rounded-[10px] w-[2vh] h-[2vh] sm:w-[4vh] sm:h-[4vh] md:w-[5vh] md:h-[5vh]" />
              <div className="text-[#143A62] font-semibold whitespace-nowrap text-[1vh] sm:text-[1.6vh] md:text-[2vh] lg:text-[2.4vh] leading-none mr-auto text-left ml-[2.5vh]">
                {ad.title}
              </div>
            </div>

            {/* توضیحات پروژه – در صورت آرایه بودن، با کاما جدا می‌شود */}
            <p className="mt-1 text-[#000000] font-normal text-[1vh] sm:text-[1.5vh] md:text-[2vh] leading-[22px] pr-2 pl-4 text-justify">
              {Array.isArray(ad.projectDescriptions)
                ? ad.projectDescriptions.join(" ، ")
                : ad.projectDescriptions}
            </p>

            {/* تاریخ */}
            <div className="mt-3 flex justify-start items-center gap-2">
              <div className="bg-[#D9D9D966] px-[2vh] py-[0.7vh] text-[#143A62D9] text-[2vh] rounded-[5px]">
                {getDaysAgoText(ad.createdAt)}
              </div>
              <div className="bg-[#143A62] text-white font-semibold text-[1.5vh] px-[2vh] py-[1vh] rounded-[5px]">
                {getFreshLabel(ad.createdAt)}
              </div>
            </div>

            {/* بودجه و تعداد پروژه */}
            <div className="mt-[1vh] flex items-center py-1 relative text-[#143A62D9] justify-start lg:gap-[1vh] flex-nowrap">
              <div className="bg-[#143A621A] px-2 py-1 rounded-[5px] text-[1.5vh] max-w-[45%] sm:max-w-[40%] md:max-w-[42%] lg:max-w-[50%] truncate">
                از {ad.minBudget || "تعیین نشده"} تا{" "}
                {ad.maxBudget || "تعیین نشده"}
              </div>
              <div className="bg-[#143A621A] px-2 py-1 rounded-[5px] text-[1.5vh] max-w-[25%] sm:max-w-[22%] md:max-w-[23%] lg:max-w-[25%] truncate">
                {ad.projectNames?.length || 0} پروژه
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CardContent;
