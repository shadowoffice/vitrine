"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { trackFunnelEvent } from "../_components/PrivacyAnalytics";
import {
  buildPricingCart,
  formatMoney,
  recommendPricingPlan,
  type PricingRecommendationInput,
} from "@/lib/pricing";

const initialInput: PricingRecommendationInput = {
  requestedSeats: 8,
  needsMultipleTeams: false,
  needsAdvancedIntegrations: false,
};

const normalizeSeatCount = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(500, Math.max(1, Math.trunc(value)));
};

export function PricingExplorer() {
  const [input, setInput] = useState<PricingRecommendationInput>(initialInput);
  const [estimateInput, setEstimateInput] =
    useState<PricingRecommendationInput>(initialInput);
  const recommendation = useMemo(
    () => recommendPricingPlan(estimateInput),
    [estimateInput],
  );
  const cart = useMemo(
    () =>
      buildPricingCart(
        recommendation.code,
        normalizeSeatCount(estimateInput.requestedSeats),
      ),
    [estimateInput.requestedSeats, recommendation.code],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedInput = {
      ...input,
      requestedSeats: normalizeSeatCount(input.requestedSeats),
    };
    const nextRecommendation = recommendPricingPlan(normalizedInput);
    setInput(normalizedInput);
    setEstimateInput(normalizedInput);
    trackFunnelEvent(
      "pricing_calculated",
      `seats:${normalizedInput.requestedSeats}`,
    );
    trackFunnelEvent(
      "plan_recommended",
      `plan:${nextRecommendation.code}`,
    );
  };

  return (
    <section
      className="compact-section pricing-explorer"
      aria-labelledby="pricing-explorer-title"
    >
      <div className="pricing-explorer-copy">
        <p className="eyebrow">Assistant de départ</p>
        <h2 id="pricing-explorer-title">
          Estimer un forfait sans transformer le catalogue en devis.
        </h2>
        <p>
          Indiquez la taille de l’équipe et la portée envisagée. Le résultat
          sert à orienter la discussion; la proposition approuvée demeure la
          référence commerciale.
        </p>
      </div>

      <form className="pricing-calculator" onSubmit={handleSubmit}>
        <div className="pricing-calculator-fields">
          <label htmlFor="pricing-seat-count">
            <span>Nombre d’accès envisagé</span>
            <input
              id="pricing-seat-count"
              inputMode="numeric"
              max={500}
              min={1}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  requestedSeats: Number(event.currentTarget.value),
                }))
              }
              required
              type="number"
              value={input.requestedSeats}
            />
          </label>

          <fieldset>
            <legend>Portée prévue</legend>
            <label>
              <input
                checked={input.needsMultipleTeams}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    needsMultipleTeams: event.currentTarget.checked,
                  }))
                }
                type="checkbox"
              />
              <span>Plusieurs équipes métier</span>
            </label>
            <label>
              <input
                checked={input.needsAdvancedIntegrations}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    needsAdvancedIntegrations: event.currentTarget.checked,
                  }))
                }
                type="checkbox"
              />
              <span>Intégrations ou API à cadrer</span>
            </label>
          </fieldset>
          <button className="button secondary" type="submit">
            Mettre à jour l’estimation
          </button>
        </div>

        <div className="pricing-estimate" aria-live="polite">
          <p className="eyebrow">Point de départ suggéré</p>
          <h3>{recommendation.publicName}</h3>
          <p>{recommendation.idealFor}</p>
          <dl>
            <div>
              <dt>Accès calculés</dt>
              <dd>{cart.seatCount}</dd>
            </div>
            <div>
              <dt>Accès additionnels</dt>
              <dd>{cart.extraSeats}</dd>
            </div>
            <div>
              <dt>Mensuel catalogue</dt>
              <dd>{formatMoney(cart.monthlySubtotalCents)}</dd>
            </div>
            <div>
              <dt>Mise en route</dt>
              <dd>{formatMoney(cart.setupFeeCents)}</dd>
            </div>
            <div>
              <dt>Estimation première année</dt>
              <dd>{formatMoney(cart.firstYearSubtotalCents)}</dd>
            </div>
          </dl>
          <p className="pricing-estimate-note">
            Avant taxes. Les échéances, intégrations, modalités et travaux hors
            périmètre sont confirmés dans la proposition.
          </p>
          <Link
            className="button primary"
            href={`/commander?plan=${recommendation.code}&context=pricing-assistant`}
          >
            Configurer ce point de départ
          </Link>
        </div>
      </form>
    </section>
  );
}
