"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import SupportContent from "./Desk/SupportContent";
import SupportQuestions from "./SupportQuestions";
import SupportTicket from "./SupportTicket";
import SupportAdminOptions from "./Desk/SupportAdminOptions";

type SupportView = "menu" | "questions" | "ticket" | "adminOptions";

const Support: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getInitialView = (): SupportView => {
    if (pathname?.endsWith("/questions")) return "questions";
    if (pathname?.endsWith("/ticket")) return "ticket";
    if (pathname?.endsWith("/admin-options")) return "adminOptions";
    return "menu";
  };

  const [view, setView] = useState<SupportView>(getInitialView());

  const goTo = (newView: SupportView) => {
    setView(newView);
    let url = "/dashboard/support";
    if (newView === "questions") url = "/dashboard/support/questions";
    else if (newView === "ticket") url = "/dashboard/support/ticket";
    else if (newView === "adminOptions")
      url = "/dashboard/support/admin-options";
    router.push(url, { scroll: false });
  };

  return (
    <div className="relative flex flex-col h-[88vh] overflow-y-hidden">
      {/* Desktop */}
      <div className="hidden md:flex md:flex-col overflow-x-hidden overflow-y-hidden md:h-full sm:p-[1vh] relative">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            view === "menu"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <SupportContent setView={goTo} />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            view === "questions"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <SupportQuestions />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            view === "ticket"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <SupportTicket />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            view === "adminOptions"
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <SupportAdminOptions />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden flex-1 h-[95vh]">
        {view === "menu" && <SupportContent setView={goTo} />}
        {view === "questions" && <SupportQuestions />}
        {view === "ticket" && <SupportTicket />}
        {view === "adminOptions" && <SupportAdminOptions />}
      </div>
    </div>
  );
};

export default Support;
