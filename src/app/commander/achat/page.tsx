import type { Metadata } from "next";
import Link from "next/link";

import { ErpOrderForm } from "../ErpOrderForm";

export const metadata: Metadata = {
  title: "Finaliser une commande",
  description:
    "Finalisation d’une commande ProJD déjà cadrée avec l’équipe d’implantation.",
  robots: {
    index: false,
    follow: false,
  },
};

type CheckoutPageProps = {
  searchParams?: Promise<{
    plan?: string | string[];
    payment?: string | string[];
  }>;
};

const firstQueryValue = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialPlanCode = firstQueryValue(params.plan);
  const paymentState = firstQueryValue(params.payment);

  return (
    <main id="contenu">
      <section className="checkout-intro">
        <div>
          <p className="eyebrow">Commande validée</p>
          <h1>Finaliser le dossier ProJD.</h1>
          <p>
            Cette étape recueille les détails administratifs et prépare le
            paiement. L’activation reste confirmée par les services serveur et
            l’équipe ProJD.
          </p>
        </div>
        <ol>
          <li className="is-complete">Proposition</li>
          <li className="is-active">Commande</li>
          <li>Paiement</li>
          <li>Validation</li>
        </ol>
      </section>

      {paymentState === "cancelled" && (
        <div className="checkout-notice" role="status">
          Le paiement a été annulé. Aucun état d’activation n’a été modifié.
        </div>
      )}

      <section className="checkout-form-section">
        <div className="checkout-form-heading">
          <p className="eyebrow">Détails de la commande</p>
          <h2>Vérifier avant le paiement.</h2>
          <p>
            Si le périmètre n’est pas encore confirmé, retournez à la demande
            de proposition.
          </p>
          <Link className="text-link" href="/commander">
            Retour à la proposition <span aria-hidden="true">←</span>
          </Link>
        </div>
        <ErpOrderForm initialPlanCode={initialPlanCode} />
      </section>
    </main>
  );
}
