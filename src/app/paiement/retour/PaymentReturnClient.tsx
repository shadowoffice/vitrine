"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { trackFunnelEvent } from "../../_components/PrivacyAnalytics";
import {
  isCheckoutCaptureResponse,
  isCheckoutStatusResponse,
  type CheckoutStatusResponse,
} from "@/lib/erp-order";

type ReturnState =
  | { status: "processing"; message: string }
  | { status: "success"; message: string; primaryDomain?: string | null }
  | { status: "deferred"; message: string }
  | { status: "error"; message: string };

type PaymentReturnClientProps = {
  provider?: string;
  paymentStatus?: string;
  paypalOrderId?: string;
  stripeSessionId?: string;
};

const deferredMessage =
  "La vérification automatique n’est pas disponible pour le moment. Aucun paiement ni aucune activation ne sont présumés; conservez cette page et votre reçu fournisseur.";

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const getInitialState = ({
  provider,
  paymentStatus,
  paypalOrderId,
  stripeSessionId,
}: PaymentReturnClientProps): ReturnState => {
  if (paymentStatus === "cancelled") {
    return {
      status: "error",
      message:
        "Le paiement a été annulé. Aucun état d’activation n’a été modifié.",
    };
  }

  if (provider === "stripe" && stripeSessionId) {
    return {
      status: "processing",
      message:
        "Paiement transmis à Stripe. Fondation vérifie maintenant le statut serveur.",
    };
  }

  if (provider === "paypal" && paypalOrderId) {
    return {
      status: "processing",
      message:
        "La capture PayPal et sa confirmation serveur sont en cours de vérification.",
    };
  }

  return {
    status: "error",
    message: "Le retour de paiement ne contient pas un identifiant vérifiable.",
  };
};

const statusMessage = (body: CheckoutStatusResponse): ReturnState => {
  if (body.status === "paid") {
    return {
      status: "success",
      message:
        body.safeSummary ||
        "Le paiement est confirmé par le service serveur. L’activation demeure une étape distincte.",
      primaryDomain: body.primaryDomain,
    };
  }

  if (
    body.status === "failed" ||
    body.status === "cancelled" ||
    body.status === "expired"
  ) {
    return {
      status: "error",
      message:
        body.safeError ||
        body.safeSummary ||
        "Le fournisseur n’a pas confirmé le paiement.",
    };
  }

  if (body.status === "unavailable") {
    return {
      status: "deferred",
      message: body.safeError || body.safeSummary || deferredMessage,
    };
  }

  return {
    status: "processing",
    message: body.safeSummary || "Le paiement est encore en traitement.",
  };
};

export function PaymentReturnClient(props: PaymentReturnClientProps) {
  const [state, setState] = useState<ReturnState>(() => getInitialState(props));
  const {
    paymentStatus,
    paypalOrderId,
    provider,
    stripeSessionId,
  } = props;

  useEffect(() => {
    if (paymentStatus === "cancelled") {
      trackFunnelEvent("checkout_return", "status:cancelled");
      return;
    }

    const sessionId =
      provider === "stripe"
        ? stripeSessionId
        : provider === "paypal"
          ? paypalOrderId
          : undefined;
    if (!sessionId || (provider !== "stripe" && provider !== "paypal")) {
      trackFunnelEvent("checkout_return", "status:invalid");
      return;
    }

    let cancelled = false;
    let activeController: AbortController | null = null;
    trackFunnelEvent("checkout_return", `provider:${provider}`);

    const capturePayPal = async (): Promise<boolean> => {
      if (provider !== "paypal") {
        return true;
      }

      try {
        const controller = new AbortController();
        activeController = controller;
        const timeout = window.setTimeout(() => controller.abort(), 5_000);
        const response = await fetch("/api/checkout/capture", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "idempotency-key": `paypal-capture-${sessionId}`,
          },
          body: JSON.stringify({
            provider: "paypal",
            providerOrderId: sessionId,
          }),
          signal: controller.signal,
        });
        window.clearTimeout(timeout);
        const body: unknown = await response.json().catch(() => null);
        if (cancelled) {
          return false;
        }

        if (response.status === 404 || response.status === 503) {
          setState({ status: "deferred", message: deferredMessage });
          trackFunnelEvent("checkout_status", "status:deferred");
          return false;
        }

        if (response.status === 409) {
          return true;
        }

        if (
          !response.ok ||
          !isCheckoutCaptureResponse(body) ||
          body.status !== "captured"
        ) {
          const message =
            isCheckoutCaptureResponse(body) && body.safeError
              ? body.safeError
              : "Le paiement PayPal n’a pas pu être capturé.";
          setState({ status: "error", message });
          trackFunnelEvent("checkout_status", "status:capture-error");
          return false;
        }

        setState({
          status: "processing",
          message:
            "PayPal a accepté la capture. Fondation vérifie maintenant le statut autoritaire.",
        });
        return true;
      } catch {
        if (!cancelled) {
          setState({ status: "deferred", message: deferredMessage });
          trackFunnelEvent("checkout_status", "status:deferred");
        }
        return false;
      }
    };

    const pollStatus = async (): Promise<void> => {
      const captured = await capturePayPal();
      if (!captured || cancelled) {
        return;
      }

      for (let attempt = 0; attempt < 6 && !cancelled; attempt += 1) {
        try {
          const controller = new AbortController();
          activeController = controller;
          const timeout = window.setTimeout(() => controller.abort(), 5_000);
          const query = new URLSearchParams({
            provider,
            sessionId,
          });
          const response = await fetch(`/api/checkout/status?${query}`, {
            cache: "no-store",
            headers: { accept: "application/json" },
            signal: controller.signal,
          });
          window.clearTimeout(timeout);
          const body: unknown = await response.json().catch(() => null);
          if (cancelled) {
            return;
          }

          if (response.status === 404 || response.status === 503) {
            setState({ status: "deferred", message: deferredMessage });
            trackFunnelEvent("checkout_status", "status:deferred");
            return;
          }

          if (!response.ok || !isCheckoutStatusResponse(body)) {
            if (attempt === 5) {
              setState({ status: "deferred", message: deferredMessage });
              trackFunnelEvent("checkout_status", "status:deferred");
              return;
            }
          } else {
            const nextState = statusMessage(body);
            setState(nextState);
            if (nextState.status !== "processing") {
              trackFunnelEvent(
                "checkout_status",
                `status:${nextState.status}`,
              );
              return;
            }
          }
        } catch {
          if (attempt === 5 && !cancelled) {
            setState({ status: "deferred", message: deferredMessage });
            trackFunnelEvent("checkout_status", "status:deferred");
            return;
          }
        }

        await wait(1_800);
      }
    };

    void pollStatus();
    return () => {
      cancelled = true;
      activeController?.abort();
    };
  }, [
    paymentStatus,
    paypalOrderId,
    provider,
    stripeSessionId,
  ]);

  return (
    <section
      className={`page-hero payment-return payment-return-${state.status}`}
      aria-live="polite"
    >
      <p className="eyebrow">Paiement</p>
      <h1>
        {state.status === "success"
          ? "Paiement confirmé"
          : state.status === "error"
            ? "Paiement à vérifier"
            : state.status === "deferred"
              ? "Vérification différée"
              : "Vérification du paiement"}
      </h1>
      <p>{state.message}</p>
      {state.status === "processing" && (
        <p className="payment-polling-note">
          Cette vérification est limitée dans le temps. Ne fermez pas votre
          reçu fournisseur.
        </p>
      )}
      {state.status === "success" && state.primaryDomain && (
        <p className="payment-domain">
          Domaine prévu après activation distincte : {state.primaryDomain}
        </p>
      )}
      <div className="hero-actions">
        <Link className="button primary" href="/statut">
          Voir les points d’accès
        </Link>
        <Link className="button secondary" href="/commander">
          Retour au dossier
        </Link>
      </div>
    </section>
  );
}
