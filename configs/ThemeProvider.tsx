"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";

interface ThemeProviderClientProps {
  children: React.ReactNode;
}

const ThemeProviderClient: React.FC<ThemeProviderClientProps> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderClient;
