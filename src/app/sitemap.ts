import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    { path: "", priority: 1 },
    { path: "/projd", priority: 0.9 },
    { path: "/fondation", priority: 0.9 },
    { path: "/modules", priority: 0.86 },
    { path: "/tarifs", priority: 0.82 },
    { path: "/commander", priority: 0.92 },
    { path: "/statut", priority: 0.68 },
  ];

  return routes.map((route) => ({
    url: `https://fichero.cloud${route.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
