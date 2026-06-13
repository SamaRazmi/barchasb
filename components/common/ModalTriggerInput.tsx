"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ModalTriggerInputProps {
  placeholder: string;
  width?: string;
  height?: string;
  onClick: () => void;
  value?: string;
  type?: "text" | "file";
  defaultBgColor?: string;
}

const ModalTriggerInput: React.FC<ModalTriggerInputProps> = ({
  placeholder,
  width = "77%",
  height = "7vh",
  onClick,
  value = "",
  type = "text",
  defaultBgColor,
}) => {
  const [isActive, setIsActive] = useState(false);
  const isFile = type === "file";

  const handleClick = () => {
    setIsActive(true);
    onClick();
  };

  const floating = isActive || value;

  // تابع‌های responsive
  const getFontSize = () => {
    const vw = window.innerWidth;
    if (vw < 600) return "1.8vh"; // زیر sm
    if (vw < 960) return "2vh"; // sm
    return "2vh"; // md و بالاتر
  };

  const getLabelFontSize = () => {
    const vw = window.innerWidth;
    if (vw < 600) return floating ? "2vh" : "1.6vh";
    if (vw < 960) return floating ? "2.2vh" : "2vh";
    return floating ? "2.4vh" : "2.4vh";
  };

  const getHeight = () => {
    const vw = window.innerWidth;
    if (vw < 600) return "5vh"; // زیر sm
    if (vw < 960) return "6.5vh"; // sm
    return height; // md و بالاتر
  };

  const getImageSize = () => {
    const vw = window.innerWidth;
    if (vw < 600) return "3.5vh"; // زیر sm
    if (vw < 960) return "4vh"; // sm
    return "4vh"; // md و بالاتر
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width,
        height: getHeight(),
        borderRadius: "10px",
        border: "1px solid #D1D5DB",
        backgroundColor: defaultBgColor ?? "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 12px",
        boxSizing: "border-box",
        marginBottom: "1vh",
        position: "relative",
        fontSize: getFontSize(),
        fontWeight: 600,
        color: value ? "#143A62" : "#9CA3AF",
        cursor: "pointer",
        userSelect: "none",
        gap: isFile ? "10px" : undefined,
      }}
    >
      {isFile && (
        <Image
          src="/images/file_icon.svg"
          alt="file"
          width={0}
          height={0}
          style={{
            width: getImageSize(),
            height: getImageSize(),
            flexShrink: 0,
          }}
        />
      )}

      {/* Placeholder */}
      <span
        style={{
          position: "absolute",
          top: floating ? "-10px" : "50%",
          right: isFile ? `calc(${getImageSize()} + 20px)` : "18px",
          transform: floating ? "translateY(0)" : "translateY(-50%)",
          fontSize: getLabelFontSize(),
          color: floating ? "#143A62" : "#9CA3AF",
          backgroundColor: floating
            ? "rgba(247, 247, 247, 0.98)"
            : "transparent",
          padding: floating ? "0 4px" : "0",
          transition: "all 0.2s ease-in-out",
          pointerEvents: "none",
        }}
      >
        {placeholder}
      </span>

      {/* Value */}
      {value && <span>{value}</span>}
    </div>
  );
};

export default ModalTriggerInput;
