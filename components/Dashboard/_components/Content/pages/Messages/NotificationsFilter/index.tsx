"use client";
import React from "react";
import { SuggestionsProvider } from "@/context/SuggestionsContext";
import Settings from "./Settings";

export default function NotificationsFilter() {
  return (
    <SuggestionsProvider>
      <div className="w-full flex flex-col items-center">
        <Settings />
      </div>
    </SuggestionsProvider>
  );
}
