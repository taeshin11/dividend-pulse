import { MetadataRoute } from "next";
import dividendsData from "@/data/dividends-fallback.json";
import sectorsData from "@/data/sectors-fallback.json";

const SITE_URL = "https://dividend-pulse.vercel.app";
const locales = ["en", "ko", "ja", "zh", "es", "fr", "de", "pt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage + static pages for each locale
  const staticPaths = ["", "/stocks", "/sectors", "/calendar", "/calculator"];
  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" || path === "/calendar" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  // Stock pages
  for (const stock of dividendsData as { ticker: string }[]) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/stocks/${stock.ticker}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  // Sector pages
  for (const sector of sectorsData as { slug: string }[]) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/sectors/${sector.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
