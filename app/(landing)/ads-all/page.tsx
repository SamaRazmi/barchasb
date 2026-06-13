import { Suspense } from "react";
import AdsPage from "./AdsPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          در حال بارگذاری...
        </div>
      }
    >
      <AdsPage />
    </Suspense>
  );
}
