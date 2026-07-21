import { SiteHeader } from "../../_components/SiteHeader";
import { PaymentReturnClient } from "./PaymentReturnClient";

export const metadata = {
  title: "Retour paiement ProJD",
  description: "Confirmation du paiement ProJD et activation du dossier client Fondation.",
};

type PaymentReturnPageProps = {
  searchParams?: Promise<{
    provider?: string | string[];
    status?: string | string[];
    token?: string | string[];
  }>;
};

const firstQueryValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />
      <PaymentReturnClient
        provider={firstQueryValue(params.provider)}
        paymentStatus={firstQueryValue(params.status)}
        paypalOrderId={firstQueryValue(params.token)}
      />
    </main>
  );
}
