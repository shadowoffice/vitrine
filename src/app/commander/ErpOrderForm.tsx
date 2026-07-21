"use client";

import { useId, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { isCheckoutResponse, type CheckoutResponse } from "@/lib/erp-order";
import {
  buildPricingCart,
  formatMoney,
  getPricingPlan,
  pricingPlans,
  type PricingPlanCode,
} from "@/lib/pricing";
import { demoErpUrl } from "@/lib/site-content";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; response: CheckoutResponse }
  | { status: "error"; message: string };

const orderCopy = {
  notesLabel: "Notes d'achat",
  notesPlaceholder: "Contexte du client, modules visés, contraintes de domaine, facturation ou intégrations à prévoir.",
  consent:
    "Je confirme vouloir acheter ProJD et j'autorise l'équipe à préparer le dossier client, la licence et le paiement.",
  submitIdle: "Acheter ProJD",
  submitBusy: "Traitement",
  secondaryHref: demoErpUrl,
  secondaryLabel: "Visiter la démo publique",
} as const;

const getFormText = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const toOrderPayload = (formData: FormData) => {
  const estimatedUsers = getFormText(formData, "estimatedUsers");
  return {
    requestType: getFormText(formData, "requestType"),
    paymentProvider: getFormText(formData, "paymentProvider"),
    companyName: getFormText(formData, "companyName"),
    contactName: getFormText(formData, "contactName"),
    email: getFormText(formData, "email"),
    phone: getFormText(formData, "phone"),
    plan: getFormText(formData, "plan"),
    estimatedUsers: estimatedUsers ? Number(estimatedUsers) : undefined,
    desiredSubdomain: getFormText(formData, "desiredSubdomain"),
    message: getFormText(formData, "message"),
    acceptsContact: formData.get("acceptsContact") === "on",
  };
};

type ErpOrderFormProps = {
  initialPlanCode?: string | null;
};

export function ErpOrderForm({ initialPlanCode }: ErpOrderFormProps) {
  const initialPlan = getPricingPlan(initialPlanCode);
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [planCode, setPlanCode] = useState<PricingPlanCode>(initialPlan.code);
  const [seatCount, setSeatCount] = useState(initialPlan.includedSeats);
  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "paypal">("stripe");
  const baseId = useId();
  const disabled = state.status === "submitting";
  const copy = orderCopy;
  const cart = useMemo(() => buildPricingCart(planCode, seatCount), [planCode, seatCount]);

  const statusMessage = useMemo(() => {
    if (state.status === "submitting") {
      return "Préparation du panier et du paiement...";
    }

    if (state.status === "error") {
      return state.message;
    }

    if (state.status === "success") {
      return `${state.response.safeSummary} Redirection vers le paiement...`;
    }

    return "";
  }, [state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "submitting" });

    const payload = toOrderPayload(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json();
      if (!response.ok || !isCheckoutResponse(body) || body.status !== "created" || !body.checkoutUrl) {
        const message = isCheckoutResponse(body) && body.safeError
          ? body.safeError
          : "Le paiement n'a pas pu être préparé.";
        setState({ status: "error", message });
        return;
      }

      setState({ status: "success", response: body });
      window.location.assign(body.checkoutUrl);
    } catch {
      setState({ status: "error", message: "La connexion au service de paiement est indisponible." });
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <input name="requestType" type="hidden" value="software_purchase" />
      <div className="form-grid">
        <label>
          <span>Entreprise</span>
          <input name="companyName" autoComplete="organization" required maxLength={200} disabled={disabled} />
        </label>
        <label>
          <span>Contact</span>
          <input name="contactName" autoComplete="name" required maxLength={160} disabled={disabled} />
        </label>
        <label>
          <span>Courriel</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} disabled={disabled} />
        </label>
        <label>
          <span>Téléphone</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={80} disabled={disabled} />
        </label>
        <label>
          <span>Utilisateurs</span>
          <input
            name="estimatedUsers"
            type="number"
            min={1}
            max={5000}
            inputMode="numeric"
            value={seatCount}
            onChange={(event) => {
              const nextSeatCount = Number(event.currentTarget.value);
              setSeatCount(Number.isFinite(nextSeatCount) ? nextSeatCount : 1);
            }}
            disabled={disabled}
          />
        </label>
        <label>
          <span>Sous-domaine ERP</span>
          <input name="desiredSubdomain" placeholder="ex: client-1" maxLength={80} disabled={disabled} />
        </label>
      </div>

      <fieldset className="plan-picker">
        <legend>Forfait</legend>
        {pricingPlans.map((plan) => (
          <label key={plan.code} htmlFor={`${baseId}-${plan.code}`}>
            <input
              id={`${baseId}-${plan.code}`}
              name="plan"
              type="radio"
              value={plan.code}
              checked={planCode === plan.code}
              onChange={() => {
                setPlanCode(plan.code);
                setSeatCount(Math.max(seatCount, plan.includedSeats));
              }}
              disabled={disabled}
            />
            <span>
              <strong>{plan.publicName}</strong>
              <small>
                {formatMoney(plan.monthlyPriceCents)}/mois, {plan.includedSeats} sièges inclus
              </small>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="payment-picker">
        <legend>Paiement</legend>
        <label htmlFor={`${baseId}-stripe`}>
          <input
            id={`${baseId}-stripe`}
            name="paymentProvider"
            type="radio"
            value="stripe"
            checked={paymentProvider === "stripe"}
            onChange={() => setPaymentProvider("stripe")}
            disabled={disabled}
          />
          <span>Carte bancaire avec Stripe</span>
        </label>
        <label htmlFor={`${baseId}-paypal`}>
          <input
            id={`${baseId}-paypal`}
            name="paymentProvider"
            type="radio"
            value="paypal"
            checked={paymentProvider === "paypal"}
            onChange={() => setPaymentProvider("paypal")}
            disabled={disabled}
          />
          <span>PayPal</span>
        </label>
      </fieldset>

      <aside className="cart-summary" aria-label="Panier ProJD">
        <div>
          <span>Forfait</span>
          <strong>{cart.plan.publicName}</strong>
        </div>
        <div>
          <span>Sièges</span>
          <strong>{cart.seatCount}</strong>
        </div>
        <div>
          <span>Mise en route</span>
          <strong>{formatMoney(cart.setupFeeCents)}</strong>
        </div>
        <div>
          <span>Mensuel</span>
          <strong>{formatMoney(cart.monthlySubtotalCents)}</strong>
        </div>
        <div className="cart-total">
          <span>Paiement initial</span>
          <strong>{formatMoney(cart.dueTodayCents)}</strong>
        </div>
      </aside>

      <label>
        <span>{copy.notesLabel}</span>
        <textarea name="message" rows={5} maxLength={4000} placeholder={copy.notesPlaceholder} disabled={disabled} />
      </label>

      <label className="checkbox-row">
        <input name="acceptsContact" type="checkbox" required disabled={disabled} />
        <span>{copy.consent}</span>
      </label>

      <div className="form-actions">
        <button className="button primary" type="submit" disabled={disabled}>
          {disabled ? copy.submitBusy : copy.submitIdle}
        </button>
        <a className="button secondary" href={copy.secondaryHref}>
          {copy.secondaryLabel}
        </a>
      </div>

      <div className={state.status === "error" ? "form-status error" : "form-status"} role="status" aria-live="polite">
        {statusMessage}
        {state.status === "success" && (
          <dl>
            <div>
              <dt>Référence</dt>
              <dd>{state.response.orderRef}</dd>
            </div>
            {state.response.primaryDomain && (
              <div>
                <dt>Domaine prévu</dt>
                <dd>{state.response.primaryDomain}</dd>
              </div>
            )}
            <div>
              <dt>Paiement</dt>
              <dd>{state.response.provider === "stripe" ? "Stripe" : "PayPal"}</dd>
            </div>
          </dl>
        )}
      </div>
    </form>
  );
}
