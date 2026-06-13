"use client";

import DesktopHeader from "./_components/DesktopHeader";
import MobileHeader from "./_components/MobileHeader";

const HeaderIndex = () => {
  return (
    <header className="w-full ">
      {/* هدر دسکتاپ */}
      <DesktopHeader />

      {/* هدر موبایل */}
      <MobileHeader />
    </header>
  );
};

export default HeaderIndex;
