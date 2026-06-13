"use client";
import React, { FC, useRef, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const items: Array<string | null> = [
  "برچسب کلاب",
  "برچسب شاپ",
  "برچسب آموزش",
  null,
  null,
  null,
  null,
  null,
  null,
];

const RightMenuPanel: FC<Props> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-[20vh] right-[5%] sm:top-[28vh] sm:right-[12%] bg-white shadow-lg rounded-xl w-[300px] h-[48vh] p-4 grid grid-cols-3 grid-rows-3 gap-[5vh] pb-[5vh] z-50"
    >
      {items.map((item, index) => {
        const isComingSoon = item == null || item.trim?.() === "";

        return (
          <button
            key={index}
            disabled={isComingSoon}
            className={[
              "relative rounded-lg border-2 p-3 text-sm flex items-center justify-center",
              "transition-colors",
              isComingSoon
                ? "bg-gray-50 border-gray-200 text-white cursor-not-allowed overflow-hidden"
                : "bg-white border-gray-100 text-gray-700 hover:bg-gray-200",
            ].join(" ")}
          >
            {!isComingSoon ? (
              item
            ) : (
              <>
                {/* خط مورب واضح */}
                <span
                  className="absolute inset-0 pointer-events-none opacity-80"
                  aria-hidden="true"
                >
                  <span className="absolute left-[-40%] top-1/2 w-[170%] h-[20px] bg-orange-500 rotate-[-45deg]" />
                </span>

                {/* متن به‌زودی */}
                <span className="relative z-10 font-medium rotate-[-45deg] pt-1">
                  به‌زودی
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default RightMenuPanel;
