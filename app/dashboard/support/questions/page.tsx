"use client";

import DeskDashboard from "@/components/Dashboard/DeskDashboard";
import ResDashboard from "@/components/Dashboard/ResDashboard";

export default function supportQuestionsPage() {
  return (
    <div className="flex w-full h-[100vh]">
      <DeskDashboard initialTab="supportQuestions" />
      <ResDashboard initialTab="supportQuestions" />
    </div>
  );
}
 