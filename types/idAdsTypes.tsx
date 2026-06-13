export type AdType = "seller" | "employer" | "jobseeker";

export interface AdData {
  id: string;
  title: string;
  description?: string;
  city: string;
  rating?: string;
  price?: string;
  images: string[];
  typeWork?: string;
  category?: string;
}
