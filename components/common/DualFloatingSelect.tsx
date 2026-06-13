"use client";

import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

export type TimeUnit = "minute" | "hour" | "day" | "month" | "year";

interface UnitOption {
  value: TimeUnit;
  label: string;
}

const unitOptions: UnitOption[] = [
  { value: "minute", label: "دقیقه" },
  { value: "hour", label: "ساعت" },
  { value: "day", label: "روز" },
  { value: "month", label: "ماه" },
  { value: "year", label: "سال" },
];

interface Props {
  width?: string;
  height?: string;
  onChange?: (unit: TimeUnit | "", amount: string) => void;
  disabled?: boolean;
}

const DualFloatingSelect: React.FC<Props> = ({
  width = "100%",
  height = "7vh",
  onChange,
  disabled = false,
}) => {
  const [unit, setUnit] = useState<TimeUnit | "">("");
  const [amount, setAmount] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = isFocused || unit !== "" || amount.trim() !== "";

  const handleUnitChange = (e: any) => {
    const value = e.target.value as TimeUnit;

    setUnit(value);
    onChange?.(value, amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    // جلوگیری از 0 و اعدادی که با 0 شروع می‌شوند
    if (value === "0") return;

    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }

    setAmount(value);
    onChange?.(unit, value);
  };

  const getLabelFontSize = () => {
    if (typeof window === "undefined") return "2vh";

    const vw = window.innerWidth;

    if (vw < 600) return isActive ? "2vh" : "1.6vh";
    if (vw < 960) return isActive ? "2.2vh" : "2vh";

    return "2.4vh";
  };

  return (
    <div
      style={{
        width,
        position: "relative",
        display: "flex",
        alignItems: "stretch",
        border: "1px solid #D1D5DB",
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        overflow: "visible",
      }}
    >
      {/* UNIT */}
      <div
        style={{
          width: "40%",
          position: "relative",
        }}
      >
        <TextField
          select
          fullWidth
          disabled={disabled}
          value={unit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleUnitChange}
          SelectProps={{
            displayEmpty: true,
            open,
            onOpen: () => setOpen(true),
            onClose: () => setOpen(false),
            IconComponent: () => null,
            renderValue: (selected) => {
              if (!selected) {
                return (
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontWeight: 500,
                    }}
                  >
                    نوع بازه
                  </span>
                );
              }

              return unitOptions.find((o) => o.value === selected)?.label ?? "";
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height,
              borderRadius: 0,
              fontWeight: 600,
            },
            "& fieldset": {
              border: "none",
            },
          }}
        >
          {unitOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>

        {/* فلش */}
        <div
          onClick={() => !disabled && setOpen(!open)}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: open
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%) rotate(0deg)",
            transition: "0.3s",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          backgroundColor: "#D1D5DB",
          margin: "8px 0",
        }}
      />

      {/* Amount */}
      <div
        style={{
          width: "60%",
        }}
      >
        <TextField
          fullWidth
          disabled={disabled}
          value={amount}
          placeholder="مقدار"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleAmountChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              height,
              borderRadius: 0,
              fontWeight: 600,
            },
            "& fieldset": {
              border: "none",
            },

            "& input[type=number]": {
              MozAppearance: "textfield",
            },

            "& input::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },

            "& input::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          }}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
        />
      </div>

      {/* Floating Label */}
      <label
        style={{
          position: "absolute",
          right: "12px",
          top: isActive ? "-2px" : "50%",
          transform: isActive
            ? "translateY(-50%) scale(0.9)"
            : "translateY(-50%)",
          transition: "all 0.3s ease",
          fontWeight: 600,
          color: isActive ? "#4B5563" : "rgba(20,58,98,0.15)",
          backgroundColor: isActive ? "rgba(247,247,247,0.98)" : "transparent",
          padding: isActive ? "0 20px" : "0",
          pointerEvents: "none",
          zIndex: 100,
          fontSize: getLabelFontSize(),
        }}
      >
        بازه زمانی
      </label>
    </div>
  );
};

export default DualFloatingSelect;
