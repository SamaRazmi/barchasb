"use client";

import React from "react";
import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

const ChatDetails: React.FC = () => {
  return (
    <div className="flex w-full h-[100vh]">
      {/* داشبورد دسکتاپ */}
      <DeskDashboard initialTab="chatdetails" />
      {/* داشبورد ریسپانسیو */}
      <ResDashboard initialTab="chatdetails" />
    </div>
  );
};

export default ChatDetails;
