"use client";

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { SelectChangeEvent } from "@mui/material/Select";

interface SelectOption {
  label: string;
  value: string | number;
}

interface FloatingSelectProps {
  placeholder?: string;
  options: SelectOption[];
  width?: string;
  height?: string;
  value: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  multiSelect?: boolean;
  disabled?: boolean;
}

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  placeholder,
  options,
  width = "77%",
  height = "7vh",
  value,
  onChange,
  multiSelect = false,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const safeValue: (string | number)[] = multiSelect
    ? Array.isArray(value)
      ? value
      : []
    : value
      ? [value as string | number]
      : [];

  const isActive = safeValue.length > 0 || isFocused;

  const handleChange = (val: string | number | (string | number)[]) => {
    if (multiSelect) {
      onChange(Array.isArray(val) ? (val as (string | number)[]) : []);
    } else {
      onChange(Array.isArray(val) ? val[0] : val);
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    let newValues: (string | number)[];
    if (safeValue.includes(optionValue)) {
      newValues = safeValue.filter((v) => v !== optionValue);
    } else {
      newValues = [...safeValue, optionValue];
    }
    handleChange(newValues);
  };

  const renderSelectedValue = (selected: unknown) => {
    const values = Array.isArray(selected) ? selected : [];
    if (!multiSelect)
      return options.find((o) => o.value === values[0])?.label ?? "";
    if (values.length === 0) return "";
    if (values.length === 1)
      return options.find((o) => o.value === values[0])?.label;
    return `${values.length} مورد انتخاب شد`;
  };

  // محاسبه fontSize responsive بدون media query
  const getLabelFontSize = () => {
    const vw = window.innerWidth;
    if (vw < 600) return isActive ? "2vh" : "1.6vh"; // زیر sm
    if (vw < 960) return isActive ? "2.2vh" : "2vh"; // sm
    return isActive ? "2.4vh" : "2.4vh"; // md و بالاتر
  };

  return (
    <div
      className="mb-1 sm:mb-2"
      style={{ width, position: "relative", zIndex: 100 }}
    >
      <TextField
        select
        fullWidth
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        InputProps={{
          style: {
            textAlign: "right",
            fontWeight: 600,
            height, // md و بالاتر
            fontSize: "2vh", // md و بالاتر
            paddingLeft: "40px", // md و بالاتر
          },
          endAdornment: null,
        }}
        SelectProps={{
          multiple: multiSelect,
          value: safeValue,
          IconComponent: () => null,
          open: isOpen,
          onOpen: () => setIsOpen(true),
          onClose: () => setIsOpen(false),
          onChange: (e: SelectChangeEvent<any>) =>
            handleChange(
              e.target.value as string | number | (string | number)[],
            ),
          renderValue: renderSelectedValue,
          MenuProps: {
            anchorOrigin: { vertical: "center", horizontal: "right" },
            transformOrigin: { vertical: "center", horizontal: "right" },
          },
        }}
        InputLabelProps={{ shrink: false, style: { display: "none" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            "&.Mui-focused": { borderColor: "#374151", borderWidth: "1px" },
            // responsive height و fontSize و paddingLeft
            height: { xs: "4vh", sm: "6.5vh", md: height },
            fontSize: { xs: "1.8vh", sm: "2vh", md: "2vh" },
            paddingLeft: { xs: "30px", sm: "35px", md: "40px" },
          },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            onClick={(e) => {
              e.stopPropagation();
              handleOptionClick(option.value);
            }}
          >
            {multiSelect && (
              <Checkbox checked={safeValue.includes(option.value)} />
            )}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </TextField>

      {/* فلش */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center"
        style={{
          pointerEvents: "auto",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transform: isOpen
            ? "translateY(-50%) rotate(180deg)"
            : "translateY(-50%) rotate(0deg)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-gray-500"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {placeholder && (
        <label
          onClick={() => setIsFocused(true)}
          style={{
            position: "absolute",
            right: "10px",
            top: isActive ? "-2px" : "50%",
            transform: isActive
              ? "translateY(-50%) scale(0.9)"
              : "translateY(-50%)",
            transition: "all 0.3s ease",
            fontWeight: 600,
            color: isActive ? "#4B5563" : "rgba(20,58,98,0.15)",
            backgroundColor: isFocused
              ? "rgba(247,247,247,0.98)"
              : "transparent",
            padding: isActive ? "0 20px" : "0",
            pointerEvents: "none",
            zIndex: 101,
            fontSize: getLabelFontSize(),
          }}
        >
          {placeholder}
        </label>
      )}
    </div>
  );
};

export default FloatingSelect;
