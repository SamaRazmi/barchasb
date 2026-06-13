"use client";

import GardnerResult from "./psychology/GardnerResult";
import MBTIResult from "./psychology/MBTIResult";
import NEOResult from "./psychology/NEOResult";
import HollandResult from "./psychology/HollandResult";
import EmotionIntelligenceResult from "./psychology/EmotionIntelligenceResult";
import SkillResult from "./skill/SkillResult";

/* =========================================
   Base Types
========================================= */

interface BaseResultData {
  results?: {
    profile?: Record<string, unknown>;
    Neuroticism?: unknown;
    topThreeCode?: unknown;
    type?: string;
    detailedResult?: {
      baseInfo?: {
        category?: string;
      };
    };

    [key: string]: unknown;
  };

  totalScore?: number;

  [key: string]: unknown;
}

interface ResultFactoryProps {
  subcategory?: string;
  data: BaseResultData;
}

/* =========================================
   Type Guards
========================================= */

function isSkillResult(data: BaseResultData): boolean {
  const category = normalizeCategory(
    data?.results?.detailedResult?.baseInfo?.category,
  );

  return category.includes("مهارتی") || category.includes("زبان");
}

function isGardnerResult(data: BaseResultData): boolean {
  return !!(
    data?.results?.profile &&
    typeof data.results.profile === "object" &&
    Object.keys(data.results.profile).length > 0
  );
}

function isNEOResult(data: BaseResultData): boolean {
  return !!data?.results?.Neuroticism;
}

function isHollandResult(data: BaseResultData): boolean {
  return !!data?.results?.topThreeCode;
}

function isMBTIResult(data: BaseResultData): boolean {
  return !!(
    data?.results?.type &&
    typeof data.results.type === "string" &&
    data.results.type.length === 4
  );
}

function isEQResult(data: BaseResultData): boolean {
  return !!(
    data?.totalScore !== undefined &&
    data?.results &&
    Object.keys(data.results).length > 0
  );
}

/* =========================================
   Helpers
========================================= */

function normalizeCategory(cat?: string): string {
  if (!cat) return "";

  return String(cat)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim();
}

/* =========================================
   Component
========================================= */

export default function ResultFactory({
  subcategory,
  data,
}: ResultFactoryProps) {
  console.log("ResultFactory data:", data);

  // Skill
  if (isSkillResult(data)) {
    return <SkillResult data={data as any} />;
  }

  // Gardner
  if (isGardnerResult(data)) {
    return <GardnerResult data={data as any} />;
  }

  // NEO
  if (isNEOResult(data)) {
    return <NEOResult data={data as any} />;
  }

  // Holland
  if (isHollandResult(data)) {
    return <HollandResult data={data as any} />;
  }

  // MBTI
  if (isMBTIResult(data)) {
    return <MBTIResult data={data as any} />;
  }

  // EQ
  if (isEQResult(data)) {
    return <EmotionIntelligenceResult data={data as any} />;
  }

  // Fallback
  return (
    <div className="p-5 text-center text-gray-600">
      نتیجه‌ای برای این آزمون یافت نشد.
    </div>
  );
}
