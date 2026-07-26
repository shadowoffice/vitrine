import type { MetadataRoute } from "next";

import { guides, modules, siteUrl } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-26T00:00:00.000Z");
  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/projd", changeFrequency: "weekly", priority: 0.95 },
    { path: "/solutions", changeFrequency: "weekly", priority: 0.9 },
    { path: "/modules", changeFrequency: "weekly", priority: 0.9 },
    { path: "/tarifs", changeFrequency: "weekly", priority: 0.85 },
    { path: "/demo", changeFrequency: "weekly", priority: 0.85 },
    { path: "/ressources", changeFrequency: "weekly", priority: 0.78 },
    { path: "/documentation", changeFrequency: "weekly", priority: 0.78 },
    { path: "/guides", changeFrequency: "weekly", priority: 0.76 },
    { path: "/presentation", changeFrequency: "weekly", priority: 0.8 },
    { path: "/securite", changeFrequency: "monthly", priority: 0.62 },
    { path: "/confidentialite", changeFrequency: "yearly", priority: 0.45 },
    { path: "/conditions", changeFrequency: "yearly", priority: 0.42 },
    { path: "/commander", changeFrequency: "weekly", priority: 0.8 },
    { path: "/statut", changeFrequency: "weekly", priority: 0.5 },
  ] as const;

  const moduleRoutes = modules.map((module) => ({
    path: `/modules/${module.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const guideRoutes = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));

  return [...routes, ...moduleRoutes, ...guideRoutes].map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
