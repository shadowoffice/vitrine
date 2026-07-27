import type { Metadata } from "next";
import Link from "next/link";

import { ErpOrderForm } from "../ErpOrderForm";
import { maxQuoteTokenLength } from "@/lib/erp-order";
import {
  getCheckoutConfigurationIssues,
  getServerEnv,
} from "@/lib/server/env";

export const dynamic = "force-dynamic";

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
    quoteToken?: string | string[];
  }>;
};

const firstQueryValue = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

const boundedQuoteToken = (
  value: string | undefined,
): string | undefined => {
  const candidate = value?.trim();
  if (
    !candidate ||
    candidate.length > maxQuoteTokenLength ||
    !/^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(candidate)
  ) {
    return undefined;
  }
  return candidate;
};

const checkoutAvailability = (): "enabled" | "disabled" | "misconfigured" => {
  try {
    const env = getServerEnv();
    if (!env.enableCheckout) {
      return "disabled";
    }
    return getCheckoutConfigurationIssues(env).length === 0
      ? "enabled"
      : "misconfigured";
  } catch {
    return "misconfigured";
  }
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialPlanCode = firstQueryValue(params.plan);
  const paymentState = firstQueryValue(params.payment);
  const quoteToken = boundedQuoteToken(firstQueryValue(params.quoteToken));
  const availability = checkoutAvailability();
  const canCheckout = availability === "enabled" && Boolean(quoteToken);

  return (
    <main id="contenu">
      <section className="checkout-intro">
        <div>
          <p className="eyebrow">
            {canCheckout ? "Commande validée" : "Vente assistée"}
          </p>
          <h1>
            {canCheckout
              ? "Finaliser le dossier ProJD."
              : "Commencer par une proposition approuvée."}
          </h1>
          <p>
            {canCheckout
              ? "Cette étape recueille les détails administratifs et prépare le paiement. L’activation reste confirmée par les services serveur et l’équipe ProJD."
              : "Aucun paiement direct n’est proposé sans checkout activé et devis signé. L’équipe ProJD prépare d’abord le périmètre avec vous."}
          </p>
        </div>
        <ol>
          <li className={canCheckout ? "is-complete" : "is-active"}>
            Proposition
          </li>
          <li className={canCheckout ? "is-active" : undefined}>Commande</li>
          <li>Paiement</li>
          <li>Validation</li>
        </ol>
      </section>

      {canCheckout && paymentState === "cancelled" && (
        <div className="checkout-notice" role="status">
          Le paiement a été annulé. Aucun état d’activation n’a été modifié.
        </div>
      )}

      <section className="checkout-form-section">
        <div className="checkout-form-heading">
          <p className="eyebrow">
            {canCheckout ? "Détails de la commande" : "Paiement assisté"}
          </p>
          <h2>
            {canCheckout
              ? "Vérifier avant le paiement."
              : "Le checkout direct n’est pas ouvert."}
          </h2>
          <p>
            {availability === "disabled"
              ? "La commande en ligne reste fermée par défaut. L’équipe ProJD doit d’abord cadrer et approuver un devis."
              : availability === "misconfigured"
                ? "La configuration sécurisée du paiement est incomplète. Aucun checkout ne peut être créé."
                : !quoteToken
                  ? "Ce lien ne contient pas de devis signé valide. Demandez un nouveau lien à l’équipe ProJD."
                  : "Si le périmètre n’est pas encore confirmé, retournez à la demande de proposition."}
          </p>
          <Link className="text-link" href="/commander">
            Retour à la proposition <span aria-hidden="true">←</span>
          </Link>
        </div>
        {canCheckout && quoteToken && (
          <ErpOrderForm
            initialPlanCode={initialPlanCode}
            quoteToken={quoteToken}
          />
        )}
      </section>
    </main>
  );
}
