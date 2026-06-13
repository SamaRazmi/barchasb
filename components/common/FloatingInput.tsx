"use client";

import React, { useState, useRef, useEffect } from "react";

interface FloatingInputProps {
  placeholder: string;
  variant?: "input" | "textarea";
  width?: string;
  height?: string;
  textareaHeight?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxChars?: number;
  inputType?:
    | "text"
    | "number"
    | "alphanumeric"
    | "price"
    | "file"
    | "urlFriendly";
  defaultBgColor?: string;
  activeLabelBg?: string;
  disabled?: boolean;
  inputStyle?: React.CSSProperties;
  textareaStyle?: React.CSSProperties;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  placeholder,
  variant = "input",
  width = "77%",
  height = "7vh",
  textareaHeight = "18vh",
  value = "",
  onChange,
  maxChars = 260,
  inputType = "alphanumeric",
  defaultBgColor = "#FFFFFF",
  activeLabelBg = "rgba(247, 247, 247, 0.98)",
  disabled = false,
  inputStyle,
  textareaStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const isActive = isFocused || internalValue.length > 0;
  const isTextarea = variant === "textarea";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let text = e.target.value;

    if (text.length > maxChars) text = text.slice(0, maxChars);

    if (inputType === "number") {
      text = text.replace(/[^0-9]/g, "");
    } else if (inputType === "text") {
      text = text.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "");
    } else if (inputType === "alphanumeric") {
      text = text.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "");
    } else if (inputType === "price") {
      const parts = text.split("-");
      const formattedParts = parts.map((part) => {
        const nums = part.replace(/[^0-9]/g, "");
        return nums.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      });
      text = formattedParts.join("-");
    } else if (inputType === "urlFriendly") {
      text = text.replace(/[^a-zA-Z0-9-_.~@:/?&=#,+%]/g, "");
    }

    setInternalValue(text);
    onChange?.(text);
  };

  const currentBg = isFocused || isHovered ? "transparent" : defaultBgColor;

  const sharedStyles = {
    width: "100%",
    borderRadius: "10px",
    border: isFocused ? "2px solid #1f2937" : "1px solid #D1D5DB",
    outline: "none",
    boxShadow: "none",
    fontWeight: 600,
    padding: "12px",
    textAlign: "right" as const,
    boxSizing: "border-box" as const,
    backgroundColor: currentBg,
    transition: "background-color 0.3s ease",
  };

  // تابع تعیین اندازه responsive
  const getFontSize = () => {
    const vw = window.innerWidth;
    if (vw < 600) return "1.8vh"; // زیر sm
    if (vw < 960) return "2vh"; // sm
    return "2vh"; // md و بالاتر
  };

  const getLabelFontSize = () => {
    const vw = window.innerWidth;
    if (vw < 600) return isActive ? "2vh" : "0.6vh"; // زیر sm
    if (vw < 960) return isActive ? "2.2vh" : "2vh"; // sm
    return isActive ? "2.4vh" : "2.4vh"; // md و بالاتر
  };

  const getInputHeight = () => {
    const vw = window.innerWidth;
    if (vw < 600) return isTextarea ? "10vh" : "5vh";
    if (vw < 960) return isTextarea ? "14vh" : "6.5vh"; // sm
    return isTextarea ? textareaHeight : height;
  };

  return (
    <div
      style={{ width, position: "relative", marginBottom: "1rem", zIndex: 100 }}
    >
      {isTextarea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...sharedStyles,
            height: getInputHeight(),
            fontSize: getFontSize(),
            resize: "none",
            overflowY: "auto",
            ...textareaStyle,
          }}
          disabled={disabled}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...sharedStyles,
            height: getInputHeight(),
            fontSize: getFontSize(),
            ...inputStyle,
          }}
          disabled={disabled}
        />
      )}

      <label
        onClick={() => inputRef.current?.focus()}
        style={{
          position: "absolute",
          right: "10px",
          top: isTextarea && !isActive ? "15%" : isActive ? "-3%" : "50%",
          transform: isActive
            ? "translateY(-50%) scale(0.9)"
            : "translateY(-50%)",
          transition: "all 0.3s ease",
          fontWeight: 600,
          color: isActive ? "#4B5563" : "rgba(20,58,98,0.15)",
          backgroundColor: isActive ? activeLabelBg : "transparent",
          padding: isActive ? "0 15px" : "0",
          pointerEvents: "none",
          textAlign: "right" as const,
          zIndex: 101,
          fontSize: getLabelFontSize(),
          whiteSpace: window.innerWidth < 640 ? "nowrap" : "normal",
          borderRadius: isActive ? "0.5rem" : "0",
          boxShadow: "none",
        }}
      >
        {placeholder}
      </label>

      {isTextarea && internalValue.length > 0 && isFocused && (
        <div
          style={{
            position: "absolute",
            left: "10px",
            bottom: "5px",
            fontSize: "1.4vh",
            fontWeight: 600,
            color: "black",
          }}
        >
          {internalValue.length}/{maxChars}
        </div>
      )}
    </div>
  );
};

export default FloatingInput;
