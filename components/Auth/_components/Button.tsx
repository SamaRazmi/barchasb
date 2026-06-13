"use client";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  width?: string | { sm?: string; md?: string };
  height?: string | { sm?: string }; // ← ارتفاع اضافه شد
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "submit",
  onClick,
  width,
  height,
  className = "",
  disabled = false,
}) => {
  // Width Handling
  const widthClasses = width
    ? typeof width === "string"
      ? `w-[${width}]`
      : `
        ${width.sm ? `sm:w-[${width.sm}]` : ""}
        ${width.md ? `md:w-[${width.md}]` : ""}
      `
    : "w-[90%]";

  // Height Handling → اگر height داده شود، همان اعمال می‌شود
  const heightClasses = height
    ? typeof height === "string"
      ? `h-[${height}]`
      : `
        ${height.sm ? `sm:h-[${height.sm}]` : ""}
      `
    : `
        h-[56px]
        sm:h-[58px]
      `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${widthClasses}
        ${heightClasses}
        bg-[#143A62]
        text-white
        text-[25px]
        font-medium
        flex
        items-center
        justify-center
        rounded-[15px]
        sm:rounded-[20px]
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
