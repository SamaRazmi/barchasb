"use client";

import React from "react";
import FooterDesk from "./_components/DesktopFooter";
import FooterRes from "./_components/MobileFooter";

export default function Footer() {
  return (
    <>
      {/* نسخه دسکتاپ */}
      <div className="hidden md:block">
        <FooterDesk />
      </div>

      {/* نسخه رسپانسیو */}
      <div className="block md:hidden">
        <FooterRes />
      </div>
    </>
  );
}
