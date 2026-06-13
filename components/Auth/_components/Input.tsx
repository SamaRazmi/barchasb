"use client";
import React from "react";
import Image from "next/image";

interface InputProps {
  icon?: string;
  placeholder: string;
  value?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  width?: string;
  smWidth?: string;
  mdWidth?: string;
  className?: string;
  name?: string;
  error?: string;
  touched?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  height?: string;
  smHeight?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  placeholder,
  value,
  onChange,
  onClick,
  type = "text",
  width,
  smWidth,
  mdWidth,
  height,
  smHeight,
  className = "",
  name,
  error,
  touched,
  readOnly,
  autoComplete,
}) => {
  const hasError = touched && error;

  const widthClasses = `
    ${width ? `w-[${width}]` : "w-[90%]"}
    ${smWidth ? `sm:w-[${smWidth}]` : ""}
    ${mdWidth ? `md:w-[${mdWidth}]` : ""}
  `;

  return (
    <div
      className={`
        ${widthClasses}
         ${height ? `h-[${height}]` : "h-[56px]"}
        ${smHeight ? `sm:h-[${smHeight}]` : "sm:h-[58px]"}
        flex items-center
        border ${hasError ? "border-red-500" : "border-gray-300"}  
        rounded-[15px] sm:rounded-[20px]
        px-4
        bg-white
        box-border
        overflow-hidden
        ${className}
      `}
    >
      {icon && (
        <div className="flex-none">
          <Image
            src={icon}
            alt="icon"
            width={22}
            height={22}
            className={`sm:w-[24px] sm:h-[24px] ${
              hasError ? "opacity-55" : ""
            }`}
          />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onClick={onClick}
        placeholder={hasError ? error : placeholder}
        name={name}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={`
          flex-1 h-full text-right font-medium
          bg-white pr-3 border-none outline-none
          ${hasError ? "text-red-500 placeholder-red-500" : "text-black"}
        `}
      />
    </div>
  );
};

export default Input;
