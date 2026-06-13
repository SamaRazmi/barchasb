"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import Drawer from "@mui/material/Drawer";
import ResMoreOptions from "../ResMoreOptions";

interface ResTopBarProps {
  setDrawerOption: (option: string | null) => void;
}

const ResTopBar: React.FC<ResTopBarProps> = ({ setDrawerOption }) => {
  const router = useRouter(); // اضافه شده
  const [isActive, setIsActive] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // وقتی گزینه‌ای در ResMoreOptions کلیک شد
  const handleOptionClick = (option: string) => {
    setDrawerOption(option); // محتوا در Home تغییر کند
    setDrawerOpen(false); // Drawer بسته شود
  };

  return (
    <>
      <div className="flex items-center justify-between w-full px-1 py-2">
        {/* Left Icons */}
        <div className="flex items-center gap-2 order-2">
          {["chatRes.svg", "notoficationRes.svg", "3-dots.svg"].map(
            (icon, idx) => (
              <div
                key={idx}
                className="w-[40px] h-[40px] flex items-center justify-center rounded-[16px] bg-white/10 cursor-pointer shadow-sm"
                onClick={() => {
                  if (icon === "3-dots.svg") {
                    setDrawerOpen(true);
                  } else if (icon === "chatRes.svg") {
                    router.push("/dashboard/chat");
                  } else if (icon === "notoficationRes.svg") {
                    router.push("/dashboard/messages?tab=barchasb");
                  }
                }}
              >
                <Image
                  src={`/images/${icon}`}
                  alt={icon}
                  width={icon === "3-dots.svg" ? 5 : 20}
                  height={icon === "3-dots.svg" ? 25 : 20}
                />
              </div>
            ),
          )}
        </div>

        {/* Right Search */}
        <div className="relative flex items-center flex-1 justify-start max-w-[500px] md:max-w-full ml-[3px] order-1 min-w-0 pl-[3px]">
          <div
            className="w-[40px] h-[40px] rounded-[16px] flex items-center justify-center bg-white/10 cursor-pointer z-20 flex-shrink-0 shadow-sm"
            onClick={() => setIsActive(!isActive)}
          >
            <Image
              src="/images/searchRes.svg"
              alt="Search"
              width={20}
              height={20}
            />
          </div>

          <div
            className={`absolute top-0 right-0 h-[40px] flex items-center overflow-hidden transition-all duration-500 ease-in-out ${
              isActive
                ? "w-[calc(100%-10px)] opacity-100 shadow-sm"
                : "w-0 opacity-0"
            }`}
            style={{ zIndex: 10 }}
          >
            <div className="absolute right-0 w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/searchRes.svg"
                alt="Search"
                width={20}
                height={20}
              />
            </div>

            <input
              type="text"
              placeholder="جستجوی آگهی ها، کارفرمایان و ...."
              className="flex-1 h-full bg-white/10 rounded-[16px] pr-[48px] pl-2 text-right text-[16px] font-normal outline-none placeholder-white transition-all duration-500 truncate min-w-0 shadow-sm"
            />
          </div>
        </div>
      </div>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerOption(null); // ← این را اضافه کن
        }}
        PaperProps={{ style: { width: "100%" } }}
        ModalProps={{
          keepMounted: true, // Drawer هنگام close کاملاً unmount نشود
        }}
      >
        <ResMoreOptions
          onClose={() => {
            setDrawerOpen(false);
            setDrawerOption(null); 
          }}
          onOptionClick={handleOptionClick} 
        />
      </Drawer>
    </>
  );
};

export default ResTopBar;
