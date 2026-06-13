"use client";

import React from "react";
import DeskAboutUs from "./_components/DesktopAboutUs";
import MobileAboutUs from "./_components/MobileAboutUs";

export default function AboutUs() {
  return (
    <>
      {/* نسخه دسکتاپ */}
      <div className="hidden md:block">
        <DeskAboutUs />
      </div>

      {/* نسخه رسپانسیو */}
      <div className="block md:hidden">
        <MobileAboutUs />
      </div>
    </>
  );
}
