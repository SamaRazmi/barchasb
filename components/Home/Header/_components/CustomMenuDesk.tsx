"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, ReactNode } from "react";

interface CustomMenuDeskProps {
  isOpen: boolean;
  anchorEl?: HTMLElement | null;
  children?: ReactNode;
}

const CustomMenuDesk: React.FC<CustomMenuDeskProps> = ({
  isOpen,
  anchorEl,
  children,
}) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const updatePosition = useCallback(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const menuWidth = window.innerWidth * 0.7; // 50% از عرض viewport
    const menuHeight = window.innerHeight * 0.9; // 50% از ارتفاع viewport

    const left = Math.min(
      Math.max(rect.right + window.scrollX - menuWidth + 45, 0),
      vw - menuWidth
    );
    const top = Math.min(rect.bottom + window.scrollY + 4, vh - menuHeight);

    setPosition({ top, left, width: menuWidth, height: menuHeight });
  }, [anchorEl]);

  useEffect(() => {
    if (!isOpen || !anchorEl) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, anchorEl, updatePosition]);

  if (!isOpen || !anchorEl) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        zIndex: 1500,
      }}
    >
      <div
        style={{
          position: "relative",
          width: position.width,
          height: position.height,
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        {/* فقط تصویر اصلی بدون هیچ بک‌گراند */}
        <Image
          src="/images/customMenuDesk.svg"
          alt="Custom Menu"
          width={position.width}
          height={position.height}
          style={{ objectFit: "cover", borderRadius: "2vh" }}
          sizes={`(max-width: 768px) 100vw, ${position.width}px`}
          priority
        />

        {/* محتوای منو */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: position.width,
            height: position.height,
            zIndex: 10,
            padding: "1vh",
            color: "white",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomMenuDesk;
