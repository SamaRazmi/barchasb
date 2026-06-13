import React, { ReactNode } from "react";

interface ResultLayoutProps {
  children: ReactNode;
}

export default function ResultLayout({ children }: ResultLayoutProps) {
  return <div className="max-w-4xl mx-auto p-6">{children}</div>;
}
