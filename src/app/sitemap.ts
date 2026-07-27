import type { MetadataRoute } from "next";

import {
  comparisons,
  contentLastModified,
  guides,
  modules,
  sectors,
  siteUrl,
  solutionRoles,
} from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", lastModified: contentLastModified.core, changeFrequency: "weekly", priority: 1 },
    { path: "/projd", lastModified: contentLastModified.product, changeFrequency: "weekly", priority: 0.95 },
    { path: "/solutions", lastModified: contentLastModified.resources, changeFrequency: "weekly", priority: 0.9 },
    { path: "/secteurs", lastModified: contentLastModified.resources, changeFrequency: "monthly", priority: 0.84 },
    { path: "/modules", lastModified: contentLastModified.product, changeFrequency: "weekly", priority: 0.9 },
    { path: "/tarifs", lastModified: contentLastModified.pricing, changeFrequency: "weekly", priority: 0.85 },
    { path: "/demo", lastModified: contentLastModified.resources, changeFrequency: "weekly", priority: 0.85 },
    { path: "/ressources", lastModified: contentLastModified.resources, changeFrequency: "weekly", priority: 0.78 },
    { path: "/documentation", lastModified: contentLastModified.resources, changeFrequency: "weekly", priority: 0.78 },
    { path: "/guides", lastModified: contentLastModified.resources, changeFrequency: "weekly", priority: 0.76 },
    { path: "/comparer", lastModified: contentLastModified.resources, changeFrequency: "monthly", priority: 0.72 },
    { path: "/glossaire", lastModified: contentLastModified.resources, changeFrequency: "monthly", priority: 0.7 },
    { path: "/scenarios", lastModified: contentLastModified.resources, changeFrequency: "monthly", priority: 0.74 },
    { path: "/presentation", lastModified: contentLastModified.product, changeFrequency: "weekly", priority: 0.8 },
    { path: "/securite", lastModified: contentLastModified.policies, changeFrequency: "monthly", priority: 0.62 },
    { path: "/confidentialite", lastModified: contentLastModified.policies, changeFrequency: "yearly", priority: 0.45 },
    { path: "/conditions", lastModified: contentLastModified.policies, changeFrequency: "yearly", priority: 0.42 },
    { path: "/commander", lastModified: contentLastModified.pricing, changeFrequency: "weekly", priority: 0.8 },
    { path: "/statut", lastModified: contentLastModified.core, changeFrequency: "weekly", priority: 0.5 },
  ] as const;

  const moduleRoutes = modules.map((module) => ({
    path: `/modules/${module.slug}`,
    lastModified: contentLastModified.product,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const guideRoutes = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    lastModified: contentLastModified.resources,
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));

  const roleRoutes = solutionRoles.map((solution) => ({
    path: `/solutions/${solution.slug}`,
    lastModified: contentLastModified.resources,
    changeFrequency: "monthly" as const,
    priority: 0.76,
  }));

  const sectorRoutes = sectors.map((sector) => ({
    path: `/secteurs/${sector.slug}`,
    lastModified: contentLastModified.resources,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  const comparisonRoutes = comparisons.map((comparison) => ({
    path: `/comparer/${comparison.slug}`,
    lastModified: contentLastModified.resources,
    changeFrequency: "monthly" as const,
    priority: 0.66,
  }));

  return [
    ...routes,
    ...moduleRoutes,
    ...guideRoutes,
    ...roleRoutes,
    ...sectorRoutes,
    ...comparisonRoutes,
  ].map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
