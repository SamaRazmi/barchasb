// services/articleService.ts
import { Article } from "@/types/article";

const BASE_URL = "https://barchasb-server-admin.liara.run";

export async function fetchArticlesSummary(): Promise<Article[]> {
  const res = await fetch(`${BASE_URL}/public/articles/summary`);
  if (!res.ok) {
    throw new Error(`خطا در دریافت مقالات: ${res.status}`);
  }
  const data: Article[] = await res.json();
  return data;
}