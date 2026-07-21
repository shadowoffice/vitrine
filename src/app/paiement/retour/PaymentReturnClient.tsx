"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { isCheckoutCaptureResponse, type CheckoutCaptureResponse } from "@/lib/erp-order";

type ReturnState =
  | { status: "processing"; message: string }
  | { status: "success"; message: string; primaryDomain?: string | null }
  | { status: "error"; message: string };

type PaymentReturnClientProps = {
  provider?: string;
  paymentStatus?: string;
  paypalOrderId?: string;
};

const getInitialState = ({ provider, paymentStatus, paypalOrderId }: PaymentReturnClientProps): ReturnState => {
  if (provider === "stripe") {
    return {
      status: paymentStatus === "cancelled" ? "error" : "success",
      message:
        paymentStatus === "cancelled"
          ? "Le paiement Stripe a été annulé."
          : "Paiement Stripe reçu. L'équipe ProJD confirme l'activation dès que la transaction est validée.",
    };
  }

  if (provider === "paypal" && paypalOrderId) {
    return { status: "processing", message: "Capture du paiement PayPal..." };
  }

  return {
    status: "error",
    message: "Retour paiement incomplet.",
  };
};

export function PaymentReturnClient(props: PaymentReturnClientProps) {
  const [state, setState] = useState<ReturnState>(() => getInitialState(props));
  const { provider, paypalOrderId } = props;

  useEffect(() => {
    if (provider !== "paypal" || !paypalOrderId) {
      return;
    }

    let cancelled = false;
    const capture = async () => {
      try {
        const response = await fetch("/api/checkout/capture", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            provider: "paypal",
            providerOrderId: paypalOrderId,
          }),
        });
        const body: unknown = await response.json();
        if (cancelled) {
          return;
        }

        if (!response.ok || !isCheckoutCaptureResponse(body) || body.status !== "captured") {
          const message = isCheckoutCaptureResponse(body) && body.safeError
            ? body.safeError
            : "Le paiement PayPal n'a pas pu être capturé.";
          setState({ status: "error", message });
          return;
        }

        const captureBody = body as CheckoutCaptureResponse;
        setState({
          status: "success",
          message: captureBody.safeSummary,
          primaryDomain: captureBody.primaryDomain,
        });
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "La capture PayPal est indisponible." });
        }
      }
    };

    void capture();
    return () => {
      cancelled = true;
    };
  }, [provider, paypalOrderId]);

  return (
    <section className="page-hero payment-return">
      <p className="eyebrow">Paiement</p>
      <h1>{state.status === "error" ? "Paiement à vérifier" : "Paiement ProJD"}</h1>
      <p>{state.message}</p>
      {state.status === "success" && state.primaryDomain && (
        <p className="payment-domain">Domaine prévu: {state.primaryDomain}</p>
      )}
      <div className="hero-actions">
        <Link className="button primary" href="/commander">
          Retour au panier
        </Link>
        <Link className="button secondary" href="/statut">
          Voir le statut
        </Link>
      </div>
    </section>
  );
}
