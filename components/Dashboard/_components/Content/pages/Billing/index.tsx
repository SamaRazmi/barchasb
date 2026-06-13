// pages/Projects.tsx
import React from "react";
import TopBar from "@/components/common/TopBar";
import BillingContent from "./Desk/BillingContent"; // Import BillingContent component

const Projects: React.FC = () => {
  return (
    <div className="flex flex-col h-[88vh] overflow-y-hidden">
      <div className="hidden md:flex md:flex-col md:h-full sm:p-[1vh]">
        <div className="mt-0">
          <TopBar />
        </div>

        {/* BillingContent component */}
        <BillingContent />
      </div>

      <div className="flex flex-col md:hidden flex-1 h-[95vh]">
        <div className="flex flex-col"></div>
      </div>
    </div>
  );
};

export default Projects;
