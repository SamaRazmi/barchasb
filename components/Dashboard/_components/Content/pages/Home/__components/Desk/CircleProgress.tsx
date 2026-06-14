import React, { useState, useEffect } from "react";

interface CircleProgressProps {
  dayPercent: number; // سمت چپ - بنفش (مانده روز)
  notificationPercent: number; // سمت راست - نارنجی (مانده اعلان)
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  dayPercent,
  notificationPercent,
}) => {
  const [circleSize, setCircleSize] = useState(70); // مقدار پیش‌فرض موبایل
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [paddingClass, setPaddingClass] = useState("py-2 px-2");
  const [titleFontClass, setTitleFontClass] = useState("text-[10px]");
  const [percentFontClass, setPercentFontClass] = useState("text-[10px]");
  const [wrapperBg, setWrapperBg] = useState("bg-transparent");
  const [cardRound, setCardRound] = useState("rounded-lg");
  const [marginBottom, setMarginBottom] = useState("");

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width >= 1250) {
        // ========== md و بالاتر ==========
        // دقیقاً مانند نسخه اصلی
        const newCircleSize = height * 0.2;
        setCircleSize(newCircleSize);
        setStrokeWidth(15);
        setPaddingClass("py-9 px-6");
        setTitleFontClass("text-[2vh]"); // فونت نسبی به ارتفاع
        setPercentFontClass("text-[15px]");
        setWrapperBg("bg-gray-100");
        setCardRound("rounded-[20px]");
      } else if (width >= 780) {
        // ========== md و بالاتر ==========
        // دقیقاً مانند نسخه اصلی
        const newCircleSize = height * 0.15;
        setCircleSize(newCircleSize);
        setStrokeWidth(10);
        setPaddingClass("py-10 px-1");
        setTitleFontClass("text-[1.6vh]"); // فونت نسبی به ارتفاع
        setPercentFontClass("text-[15px]");
        setWrapperBg("bg-gray-100");
        setCardRound("rounded-[20px]");
      } else if (width >= 640) {
        // ========== sm (640px تا 767px) ==========
        setCircleSize(70);
        setStrokeWidth(8);
        setPaddingClass("py-3 px-6");
        setTitleFontClass("text-xs");
        setPercentFontClass("text-xs");
        setWrapperBg("bg-transparent");
        setCardRound("rounded-lg");
        setMarginBottom("");
      } else {
        // ========== موبایل (کمتر از 640px) ==========
        setCircleSize(65);
        setStrokeWidth(6);
        setPaddingClass("py-2 px-8");
        setTitleFontClass("text-[9px]");
        setPercentFontClass("text-[9px]");
        setWrapperBg("bg-transparent");
        setCardRound("rounded-lg");
        setMarginBottom("");
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const radius = (circleSize - strokeWidth) / 2;
  const center = circleSize / 2;
  const halfCircleLength = Math.PI * radius;

  const dayOffset = halfCircleLength * (1 - dayPercent / 100);
  const notificationOffset = halfCircleLength * (1 - notificationPercent / 100);

  return (
    <div className={`flex w-full items-center justify-start ${wrapperBg}`}>
      <div
        className={`bg-white ${cardRound} ${paddingClass} flex items-center justify-center ${marginBottom} relative shadow-sm`}
      >
        {/* عنوان‌ها */}
        <div
          className={`absolute top-2 left-2 text-[#143A62] font-semibold ${titleFontClass} md:top-4 md:left-4`}
        >
          مانده اعلان
        </div>
        <div
          className={`absolute top-2 right-2 text-[#143A62] font-semibold ${titleFontClass} md:top-4 md:right-4`}
        >
          مانده روز
        </div>

        <div className="relative flex items-center justify-center">
          <svg width={circleSize} height={circleSize}>
            {/* نیمه چپ - پس‌زمینه */}
            <path
              d={`
                M ${center},${center}
                m 0,-${radius}
                a ${radius},${radius} 0 0,1 0,${2 * radius}
              `}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* نیمه چپ - بنفش (مانده روز) */}
            <path
              d={`
                M ${center},${center}
                m 0,-${radius}
                a ${radius},${radius} 0 0,1 0,${2 * radius}
              `}
              stroke="#802183ff"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={halfCircleLength}
              strokeDashoffset={dayOffset}
              strokeLinecap="butt"
            />
            {/* نیمه راست - پس‌زمینه */}
            <path
              d={`
                M ${center},${center}
                m 0,-${radius}
                a ${radius},${radius} 0 0,0 0,${2 * radius}
              `}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* نیمه راست - نارنجی (مانده اعلان) */}
            <path
              d={`
                M ${center},${center}
                m 0,-${radius}
                a ${radius},${radius} 0 0,0 0,${2 * radius}
              `}
              stroke="#f97316"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={halfCircleLength}
              strokeDashoffset={notificationOffset}
              strokeLinecap="butt"
            />
          </svg>

          {/* خط عمودی وسط */}
          <div
            className="absolute bg-gray-400"
            style={{
              width: "1px",
              height: `${circleSize + 5}px`,
            }}
          />

          {/* درصدها */}
          <div
            className={`absolute text-[#f97316] font-semibold ${percentFontClass} md:left-[25%] md:right-auto md:translate-x-[-50%]`}
            style={{
              top: circleSize + 5,
              left: "25%",
              transform: "translateX(-50%)",
            }}
          >
            {notificationPercent}%
          </div>
          <div
            className={`absolute text-[#802183ff] font-semibold ${percentFontClass} md:right-[25%] md:left-auto md:translate-x-[50%]`}
            style={{
              top: circleSize + 5,
              right: "25%",
              transform: "translateX(50%)",
            }}
          >
            {dayPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleProgress;
