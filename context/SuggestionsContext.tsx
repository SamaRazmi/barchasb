"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { SuggestionItem, fetchSuggestions } from "@/api/apiSuggestion";

interface SuggestionsContextType {
  suggestions: SuggestionItem[];
  used: number;
  remaining: number;
  isLoading: boolean;
  error: string | null;
  fetchAndSetSuggestions: (
    search: string,
    count: number,
    adTypes?: string,
  ) => Promise<void>;
  resetSuggestions: () => void;
  clearError: () => void;
}

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(
  undefined,
);

export const SuggestionsProvider = ({ children }: { children: ReactNode }) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [used, setUsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetSuggestions = async (
    search: string,
    count: number,
    adTypes?: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSuggestions(search, count, adTypes);
      setSuggestions(result.suggestions);
      setUsed(result.used);
      setRemaining(result.remaining);
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      setError(message);
      setSuggestions([]);
      setUsed(0);
      setRemaining(0);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSuggestions = () => {
    setSuggestions([]);
    setUsed(0);
    setRemaining(0);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <SuggestionsContext.Provider
      value={{
        suggestions,
        used,
        remaining,
        isLoading,
        error,
        fetchAndSetSuggestions,
        resetSuggestions,
        clearError,
      }}
    >
      {children}
    </SuggestionsContext.Provider>
  );
};

export const useSuggestions = () => {
  const context = useContext(SuggestionsContext);
  if (!context) {
    throw new Error("useSuggestions must be used within a SuggestionsProvider");
  }
  return context;
};
