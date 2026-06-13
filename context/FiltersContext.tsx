"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type Filters = {
  karjo: {
    selectedTime: string[];
    selectedPortfolio: string | null;
    selectedCities: string[];
    searchText: string;
    selectedGender: string | null;
    minAge: string;
    maxAge: string;
    selectedCategory: string[];
    // اضافه شده:
    selectedStates: string[]; // آرایه‌ای از استان‌ها
    hasWorkExperience?: boolean; // سابقه کاری (اختیاری)
  };
  karfarma: {
    selectedTime: string | null;
    selectedTypeWork: string | null;
    selectedCategory: string[];
    searchText: string;
    selectedCities: string[];
  };
  kiosk: {
    selectedPrice: { min: string; max: string };
    selectedTime: string | null;
    selectedCategory: string[];
    selectedCities: string[];
    searchText: string;
  };
};

interface FiltersContextType {
  activeTab: "karjo" | "karfarma" | "agahi";
  setActiveTab: (tab: "karjo" | "karfarma" | "agahi") => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  updateFiltersFromQuery: (
    tab: "karjo" | "karfarma" | "agahi",
    query: { q?: string; state?: string },
  ) => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<"karjo" | "karfarma" | "agahi">(
    "karjo",
  );
  const [filters, setFilters] = useState<Filters>({
    karjo: {
      selectedTime: [],
      selectedPortfolio: null,
      selectedCities: [],
      searchText: "",
      selectedGender: null,
      minAge: "",
      maxAge: "",
      selectedCategory: [],
      selectedStates: [], // مقدار اولیه
      hasWorkExperience: undefined, // مقدار اولیه
    },
    karfarma: {
      selectedTime: null,
      selectedTypeWork: null,
      selectedCategory: [],
      searchText: "",
      selectedCities: [],
    },
    kiosk: {
      selectedPrice: { min: "", max: "" },
      selectedTime: null,
      selectedCategory: [],
      selectedCities: [],
      searchText: "",
    },
  });

  const updateFiltersFromQuery = useCallback(
    (
      tab: "karjo" | "karfarma" | "agahi",
      query: { q?: string; state?: string },
    ) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (tab === "karjo") {
          newFilters.karjo = {
            ...prev.karjo,
            searchText: query.q || "",
            // در صورت نیاز، state را می‌توان به selectedCities یا selectedStates نگاشت
            // طبق منطق قبلی، state به selectedCities می‌رود. در صورت تمایل می‌توانید تغییر دهید
            selectedCities: query.state
              ? [query.state]
              : prev.karjo.selectedCities,
          };
        } else if (tab === "karfarma") {
          newFilters.karfarma = {
            ...prev.karfarma,
            searchText: query.q || "",
            selectedCities: query.state
              ? [query.state]
              : prev.karfarma.selectedCities,
          };
        } else if (tab === "agahi") {
          newFilters.kiosk = {
            ...prev.kiosk,
            searchText: query.q || "",
            selectedCities: query.state
              ? [query.state]
              : prev.kiosk.selectedCities,
          };
        }
        return newFilters;
      });
    },
    [],
  );

  return (
    <FiltersContext.Provider
      value={{
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        updateFiltersFromQuery,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context)
    throw new Error("useFilters must be used within FiltersProvider");
  return context;
};
