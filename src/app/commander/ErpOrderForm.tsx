"use client";

import { useId, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  ficheroErpDomainSuffix,
  isCheckoutResponse,
  normalizeDesiredErpPrefix,
  normalizePromoCode,
  type CheckoutResponse,
} from "@/lib/erp-order";
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
    "Je confirme vouloir commander ProJD et j'autorise l'équipe à préparer le dossier client, la licence et l'activation.",
  submitIdle: "Commander ProJD",
  submitBusy: "Traitement",
  secondaryHref: demoErpUrl,
  secondaryLabel: "Visiter la démo publique",
} as const;

const checkoutProviderLabel = (provider: CheckoutResponse["provider"]): string => {
  if (provider === "promo_code") {
    return "Code promo";
  }

  return provider === "stripe" ? "Stripe" : "PayPal";
};

const getFormText = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const toOrderPayload = (formData: FormData) => {
  const estimatedUsers = getFormText(formData, "estimatedUsers");
  const desiredSubdomain = normalizeDesiredErpPrefix(getFormText(formData, "desiredSubdomain"));
  const promoCode = normalizePromoCode(getFormText(formData, "promoCode"));
  return {
    requestType: getFormText(formData, "requestType"),
    paymentProvider: getFormText(formData, "paymentProvider"),
    companyName: getFormText(formData, "companyName"),
    contactName: getFormText(formData, "contactName"),
    email: getFormText(formData, "email"),
    phone: getFormText(formData, "phone"),
    businessAddressLine1: getFormText(formData, "businessAddressLine1"),
    businessAddressLine2: getFormText(formData, "businessAddressLine2"),
    businessCity: getFormText(formData, "businessCity"),
    businessProvince: getFormText(formData, "businessProvince"),
    businessPostalCode: getFormText(formData, "businessPostalCode"),
    businessCountry: getFormText(formData, "businessCountry"),
    gstNumber: getFormText(formData, "gstNumber"),
    qstNumber: getFormText(formData, "qstNumber"),
    businessRegistrationNumber: getFormText(formData, "businessRegistrationNumber"),
    website: getFormText(formData, "website"),
    industry: getFormText(formData, "industry"),
    companySize: getFormText(formData, "companySize"),
    plan: getFormText(formData, "plan"),
    estimatedUsers: estimatedUsers ? Number(estimatedUsers) : undefined,
    desiredSubdomain: desiredSubdomain || undefined,
    promoCode: promoCode || undefined,
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
  const [desiredDomainInput, setDesiredDomainInput] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const baseId = useId();
  const disabled = state.status === "submitting";
  const copy = orderCopy;
  const cart = useMemo(() => buildPricingCart(planCode, seatCount), [planCode, seatCount]);
  const normalizedPromoCode = useMemo(() => normalizePromoCode(promoCodeInput), [promoCodeInput]);
  const hasPromoCode = normalizedPromoCode.length >= 4;
  const normalizedDesiredPrefix = useMemo(
    () => normalizeDesiredErpPrefix(desiredDomainInput),
    [desiredDomainInput],
  );
  const desiredDomainPreview = normalizedDesiredPrefix
    ? `${normalizedDesiredPrefix}.${ficheroErpDomainSuffix}`
    : `client1.${ficheroErpDomainSuffix}`;

  const statusMessage = useMemo(() => {
    if (state.status === "submitting") {
      return "Préparation du panier et du paiement...";
    }

    if (state.status === "error") {
      return state.message;
    }

    if (state.status === "success") {
      if (state.response.status === "promo_activated") {
        return `${state.response.safeSummary} Aucun paiement externe à faire.`;
      }

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
      if (!response.ok || !isCheckoutResponse(body)) {
        const message = isCheckoutResponse(body) && body.safeError
          ? body.safeError
          : "Le paiement n'a pas pu être préparé.";
        setState({ status: "error", message });
        return;
      }

      if (body.status === "promo_activated") {
        setState({ status: "success", response: body });
        return;
      }

      if (body.status !== "created" || !body.checkoutUrl) {
        setState({
          status: "error",
          message: body.safeError ?? "Le paiement n'a pas pu être préparé.",
        });
        return;
      }

      let checkoutUrl: URL;
      try {
        checkoutUrl = new URL(body.checkoutUrl);
      } catch {
        setState({ status: "error", message: "L'adresse du service de paiement est invalide." });
        return;
      }

      if (checkoutUrl.protocol !== "https:") {
        setState({ status: "error", message: "La redirection de paiement n'est pas sécurisée." });
        return;
      }

      setState({ status: "success", response: body });
      window.location.assign(checkoutUrl.toString());
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
          <span>Préfixe ERP</span>
          <input
            name="desiredSubdomain"
            placeholder="ex: client1"
            maxLength={120}
            value={desiredDomainInput}
            onChange={(event) => setDesiredDomainInput(event.currentTarget.value)}
            disabled={disabled}
          />
          <small className="field-hint">Domaine final: {desiredDomainPreview}</small>
        </label>
      </div>

      <details className="business-details">
        <summary>
          <span>Détails administratifs</span>
          <small>Optionnels à cette étape</small>
        </summary>
        <div className="form-grid">
          <label className="field-wide">
            <span>Adresse entreprise</span>
            <input
              name="businessAddressLine1"
              autoComplete="address-line1"
              maxLength={180}
              disabled={disabled}
            />
          </label>
          <label className="field-wide">
            <span>Suite ou bureau</span>
            <input name="businessAddressLine2" autoComplete="address-line2" maxLength={180} disabled={disabled} />
          </label>
          <label>
            <span>Ville</span>
            <input name="businessCity" autoComplete="address-level2" maxLength={120} disabled={disabled} />
          </label>
          <label>
            <span>Province</span>
            <input
              name="businessProvince"
              autoComplete="address-level1"
              maxLength={80}
              defaultValue="Québec"
              disabled={disabled}
            />
          </label>
          <label>
            <span>Code postal</span>
            <input name="businessPostalCode" autoComplete="postal-code" maxLength={24} disabled={disabled} />
          </label>
          <label>
            <span>Pays</span>
            <input
              name="businessCountry"
              autoComplete="country-name"
              maxLength={80}
              defaultValue="Canada"
              disabled={disabled}
            />
          </label>
          <label>
            <span>TPS</span>
            <input name="gstNumber" placeholder="123456789 RT0001" maxLength={40} disabled={disabled} />
          </label>
          <label>
            <span>TVQ</span>
            <input name="qstNumber" placeholder="1234567890 TQ0001" maxLength={40} disabled={disabled} />
          </label>
          <label>
            <span>NEQ</span>
            <input name="businessRegistrationNumber" maxLength={80} disabled={disabled} />
          </label>
          <label>
            <span>Site web</span>
            <input name="website" type="text" inputMode="url" maxLength={200} disabled={disabled} />
          </label>
          <label>
            <span>Secteur</span>
            <input name="industry" maxLength={120} disabled={disabled} />
          </label>
          <label>
            <span>Taille</span>
            <input name="companySize" placeholder="ex: 10-25" maxLength={80} disabled={disabled} />
          </label>
        </div>
      </details>

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

      <section className="promo-panel" aria-labelledby={`${baseId}-promo-title`}>
        <div>
          <h3 id={`${baseId}-promo-title`}>Code promo</h3>
          <p>Si un code vous a été fourni, il sera vérifié côté serveur avant tout ajustement.</p>
        </div>
        <label>
          <span>Code promo</span>
          <input
            name="promoCode"
            placeholder="Code promo"
            maxLength={80}
            value={promoCodeInput}
            onChange={(event) => setPromoCodeInput(event.currentTarget.value.toUpperCase())}
            autoComplete="off"
            disabled={disabled}
          />
          <small className="field-hint">
            {hasPromoCode
              ? "Code prêt à être vérifié. Aucun rabais n'est présumé."
              : "Laisse vide pour payer avec Stripe ou PayPal."}
          </small>
        </label>
      </section>

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
        {hasPromoCode && (
          <div>
            <span>Code promo</span>
            <strong>À valider</strong>
          </div>
        )}
        <div className="cart-total">
          <span>Total catalogue</span>
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
          {disabled ? copy.submitBusy : hasPromoCode ? "Commander avec code promo" : copy.submitIdle}
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
              <dd>{checkoutProviderLabel(state.response.provider)}</dd>
            </div>
          </dl>
        )}
      </div>
    </form>
  );
}
