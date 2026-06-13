"use client";

import React from "react";
import DashboardAuthWrapper from "@/components/Dashboard/DashboardAuthWrapper";
import { UserProvider } from "@/context/UserContext";
import { FiltersProvider } from "@/context/FiltersContext";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <FiltersProvider>
      <UserProvider>
        <DashboardAuthWrapper>{children}</DashboardAuthWrapper>
      </UserProvider>
    </FiltersProvider>
  );
};

export default DashboardLayout;
