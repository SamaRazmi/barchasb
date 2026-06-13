export interface DigitalAd {
  _id: string;
  title: string;
  description: string;
  minBudget?: string;
  maxBudget?: string;
  projectNames?: string[];
  projectDescriptions?: string[];
  createdAt: string;
  requiredSkills?: { name: string }[];
  person?: "self" | "other";
  tags?: string[];
}
