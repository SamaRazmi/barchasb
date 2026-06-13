"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getEmployerAds,
  getJobSeekerAds,
  getSellerAds,
  getDigitalAds,
} from "@/api/apiGetFormsAds";

/* ================= TYPES ================= */
export interface CardItem {
  id: string; // 🔁 تغییر: از number به string
  category: "EmployerAd" | "JobSeekerAd" | "SellerAd";
  title: string;
  personName?: string;
  experience?: string;
  contactName?: string;
  positions?: string;
  skills?: string;
  salary?: string;
  location?: string;
  details?: string;
  jobType?: string;
  img: string;
}

interface CardsContextType {
  jobSeekers: CardItem[];
  employers: CardItem[];
  ads: CardItem[];
}

/* ================= CONTEXT ================= */
const CardsContext = createContext<CardsContextType | null>(null);

export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within CardsProvider");
  }
  return context;
};

const defaultImg = "/images/user.png";

/* ================= PROVIDER ================= */
export const CardsProvider = ({ children }: { children: ReactNode }) => {
  /* ---------- queries ---------- */
  const { data: jobSeekerAds = [] } = useQuery({
    queryKey: ["jobSeekerAds"],
    queryFn: getJobSeekerAds,
  });

  const { data: employerAds = [] } = useQuery({
    queryKey: ["employerAds"],
    queryFn: getEmployerAds,
  });

  const { data: sellerAds = [] } = useQuery({
    queryKey: ["sellerAds"],
    queryFn: getSellerAds,
  });

  const { data: digitalAds = [] } = useQuery({
    queryKey: ["digitalAds"],
    queryFn: getDigitalAds,
  });

  /* ================= MAPPINGS ================= */

  /* ---------- job seekers ---------- */
  const jobSeekers: CardItem[] = jobSeekerAds
    .filter((ad: any) => ad.adStatus === "approved")
    .map((ad: any) => ({
      // 🔁 حذف index
      id: ad._id, // 🔁 استفاده از _id واقعی
      category: "JobSeekerAd",
      title: ad.name,
      experience: ad.education ?? "—",
      skills: ad.skills?.join("، "),
      jobType: ad.jobType ?? "—",
      img: ad.images?.find((i: any) => i.isMain)?.url || defaultImg,
    }));

  /* ---------- employers ---------- */
  const employers: CardItem[] = employerAds
    .filter((ad: any) => ad.adStatus === "approved")
    .map((ad: any) => ({
      // 🔁 حذف index
      id: ad._id, // 🔁 استفاده از _id واقعی
      category: "EmployerAd",
      title: ad.title,
      contactName: ad.name,
      positions: ad.category ?? "—",
      skills: ad.benefits ?? "—",
      img: ad.images?.find((i: any) => i.isMain)?.url || defaultImg,
    }));

  /* ---------- ads (seller + digital) ---------- */
  const ads: CardItem[] = [...sellerAds, ...digitalAds]
    .filter((ad: any) => ad.adStatus === "approved")
    .map((ad: any) => ({
      // 🔁 حذف index
      id: ad._id, // 🔁 استفاده از _id واقعی
      category: "SellerAd",
      title: ad.title,
      salary: ad.priceIRT || ad.minBudget ? `توافقی` : "—",
      location: ad.state && ad.city ? `${ad.state} - ${ad.city}` : "—",
      img: ad.images?.find((i: any) => i.isMain)?.url || defaultImg,
    }));

  return (
    <CardsContext.Provider value={{ jobSeekers, employers, ads }}>
      {children}
    </CardsContext.Provider>
  );
};
