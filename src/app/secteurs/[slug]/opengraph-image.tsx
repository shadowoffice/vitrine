import {
  createProductOpenGraphImage,
  openGraphImageSize,
} from "../../_components/ProductOpenGraphImage";
import { getSectorBySlug } from "@/lib/site-content";

export const alt = "Solution ProJD par secteur de construction";
export const size = openGraphImageSize;
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  return createProductOpenGraphImage({
    category: sector?.name ?? "Secteur construction",
    title: sector?.headline ?? "ERP construction ProJD",
    description:
      sector?.summary ??
      "Un point de départ ERP à vérifier avec les équipes concernées.",
  });
}
