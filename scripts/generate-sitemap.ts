// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Slugs are kept in sync manually with src/content/info-articles/articles/*.ts to avoid
// importing TS files that pull in image assets at script time.
import { writeFileSync, readdirSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://steinbockchalets.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/galerie", changefreq: "monthly", priority: "0.8" },
  { path: "/galerie/info", changefreq: "monthly", priority: "0.7" },
  { path: "/gallery", changefreq: "monthly", priority: "0.8" },
  { path: "/gallery/info", changefreq: "monthly", priority: "0.7" },
  { path: "/region", changefreq: "monthly", priority: "0.8" },
  { path: "/anfahrt", changefreq: "yearly", priority: "0.7" },
  { path: "/directions", changefreq: "yearly", priority: "0.6" },
];

// Derive article slugs from filenames in the articles directory.
const articleSlugs = readdirSync(resolve("src/content/info-articles/articles"))
  .filter((f) => f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

const articleEntries: SitemapEntry[] = articleSlugs.map((slug) => ({
  path: `/region/${slug}`,
  changefreq: "monthly",
  priority: "0.6",
}));

const entries = [...staticEntries, ...articleEntries];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
