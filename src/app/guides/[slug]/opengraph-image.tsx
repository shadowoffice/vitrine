import {
  createProductOpenGraphImage,
  openGraphImageSize,
} from "../../_components/ProductOpenGraphImage";
import { getGuideBySlug } from "@/lib/site-content";

export const alt = "Guide pratique ProJD";
export const size = openGraphImageSize;
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  return createProductOpenGraphImage({
    category: guide ? `${guide.category} · ${guide.duration}` : "Guide ProJD",
    title: guide?.title ?? "Guide ERP construction",
    description:
      guide?.summary ??
      "Un parcours pratique pour vérifier un workflow ProJD.",
  });
}
