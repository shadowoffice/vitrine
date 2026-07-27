import type { Metadata } from "next";

import { PaymentReturnClient } from "./PaymentReturnClient";

export const metadata: Metadata = {
  title: "Retour paiement ProJD",
  description: "Confirmation du paiement ProJD et préparation de l'activation.",
  robots: {
    index: false,
    follow: false,
  },
};

type PaymentReturnPageProps = {
  searchParams?: Promise<{
    provider?: string | string[];
    session_id?: string | string[];
    status?: string | string[];
    token?: string | string[];
  }>;
};

const firstQueryValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="site-main">
      <PaymentReturnClient
        provider={firstQueryValue(params.provider)}
        paymentStatus={firstQueryValue(params.status)}
        paypalOrderId={firstQueryValue(params.token)}
        stripeSessionId={firstQueryValue(params.session_id)}
      />
    </main>
  );
}
