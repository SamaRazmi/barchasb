"use client";
import { motion, easeOut } from "framer-motion";
import LeftHalfCircle from "./___components/LeftHalfCircle";
import RightHalfCircle from "./___components/RightHalfCircle";

type ResMoreOptionsProps = {
  onClose: () => void;
  onOptionClick: (option: string) => void;
};

const ResMoreOptions: React.FC<ResMoreOptionsProps> = ({
  onClose,
  onOptionClick,
}) => {
  const options = [
    { label: "رزومه ساز", icon: "/images/resume-icon.svg" },
    { label: "مقالات", icon: "/images/articles-icon.svg" },
    { label: "اتاق خبر", icon: "/images/newsroom-icon.svg" },
  ];

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay, duration: 0.6, ease: easeOut },
  });

  return (
    <div
      className="fixed inset-0 z-[999999] flex flex-col items-center justify-center w-screen h-screen"
      style={{ backgroundColor: "#143A62" }}
    >
      {/* دکمه بستن */}
      <motion.button
        type="button"
        onClick={onClose}
        className="absolute top-2 left-2 rounded-full flex items-center justify-center z-[999999]"
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(8px)",
        }}
        {...fade(0.2)}
      >
        <img src="/images/close-res.svg" alt="Close" className="w-6 h-6" />
      </motion.button>

      {/* نیم‌دایره‌ها */}
      <motion.div {...fade(0.6)}>
        <LeftHalfCircle onClick={onOptionClick} />
      </motion.div>
      <motion.div {...fade(1.1)}>
        <RightHalfCircle onClick={onOptionClick} />
      </motion.div>

      {/* آیتم‌های وسط */}
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        {options.map((opt, idx) => (
          <motion.div
            key={idx}
            className="flex items-center justify-between px-4 cursor-pointer"
            style={{
              height: "6vh",
              width: "75vw",
              border: "1px solid #FFFFFF",
              borderRadius: "50px",
              color: "#FFFFFF",
            }}
            {...fade(1.4 + idx * 0.3)}
            onClick={() => onOptionClick(opt.label)}
          >
            <span className="text-white font-medium whitespace-nowrap">
              {opt.label}
            </span>
            <img src={opt.icon} alt={opt.label} className="h-6 w-6" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResMoreOptions;
