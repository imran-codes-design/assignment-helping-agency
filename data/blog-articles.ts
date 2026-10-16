export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  status: "draft" | "published";
}

export const blogArticles: BlogArticle[] = [];
