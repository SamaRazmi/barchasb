import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function SearchAdsPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">در حال بارگذاری...</div>}
    >
      <SearchResults />
    </Suspense>
  );
}
