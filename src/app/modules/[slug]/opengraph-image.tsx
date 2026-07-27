import {
  createProductOpenGraphImage,
  openGraphImageSize,
} from "../../_components/ProductOpenGraphImage";
import { getModuleBySlug } from "@/lib/site-content";

export const alt = "Présentation d’un module ProJD";
export const size = openGraphImageSize;
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const moduleContent = getModuleBySlug(slug);

  return createProductOpenGraphImage({
    category: moduleContent?.eyebrow ?? "Module ProJD",
    title: moduleContent?.name ?? "Module ERP construction",
    description:
      moduleContent?.summary ??
      "Découvrez un workflow ERP conçu pour la construction.",
  });
}
