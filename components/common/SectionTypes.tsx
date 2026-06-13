import React, { useState } from "react";

interface AccordionProps {
  title: string;
  options: string[];
  variant?: "circle" | "square";
  selectedOption?: string | string[] | null;
  onSelect?: (selected: string | string[]) => void;
}

export default function SectionTypes({
  title,
  options,
  variant = "circle",
  selectedOption,
  onSelect,
}: AccordionProps) {
  const [open, setOpen] = useState(false);

  // اگر حالت circle باشد: string - اگر square باشد: string[]
  const [selected, setSelected] = useState<string | string[] | null>(
    selectedOption || (variant === "square" ? [] : null)
  );

  const handleSelect = (opt: string) => {
    if (variant === "circle") {
      setSelected(opt);
      onSelect?.(opt);
    } else {
      const current = Array.isArray(selected) ? [...selected] : [];
      const updated = current.includes(opt)
        ? current.filter((item) => item !== opt)
        : [...current, opt];

      setSelected(updated);
      onSelect?.(updated);
    }
  };

  return (
    <div className="w-[99%] mx-auto bg-[#F5F5F5] rounded-2xl transition-all duration-300 px-2 pb-[2vh] max-h-[16vh] mt-[0.2vh] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-[2.2vh] font-semibold text-[#143A62]">{title}</h2>
        <div
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            width="7"
            height="3"
            viewBox="0 0 7 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 0.5L3.5 2.5L6.5 0.5"
              stroke="#143A62"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      {open && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-[1vh] mt-[1vh] justify-between">
          {options.map((opt, index) => {
            const isActive = Array.isArray(selected)
              ? selected.includes(opt)
              : selected === opt;

            return (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#FFFFFFF2] rounded-[20px] px-[1vh] py-[0.5vh]"
              >
                <div
                  onClick={() => handleSelect(opt)}
                  className={`w-[2vh] h-[2vh] cursor-pointer flex items-center justify-center border border-[#D9D9D9] bg-[#D9D9D9] ${
                    variant === "circle" ? "rounded-[10px]" : "rounded-[2px]"
                  } ${isActive ? "ring-2 ring-[#143A62]" : ""}`}
                >
                  {isActive && (
                    <div
                      className={`w-[1.4vh] h-[1.5vh] bg-[#143A62] ${
                        variant === "circle" ? "rounded-full" : "rounded-[2px]"
                      }`}
                    />
                  )}
                </div>
                <span className="text-[#143A62] text-[1vh] md:text-[1.5vh] lg:text-[1.8vh] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {opt}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

