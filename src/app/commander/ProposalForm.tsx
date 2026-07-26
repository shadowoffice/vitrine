"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import {
  isProposalResponse,
  proposalPriorities,
  proposalPriorityLabels,
  proposalTeamSizes,
  type ProposalResponse,
} from "@/lib/proposal";
import { pricingPlanCodes, type PricingPlanCode } from "@/lib/pricing";

type ProposalFormProps = {
  initialPlanCode?: string;
};

type ProposalState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; response: ProposalResponse }
  | { status: "error"; message: string };

const currentToolOptions = [
  "Procore",
  "SharePoint / Microsoft 365",
  "Excel",
  "ERP comptable existant",
] as const;

const isPricingPlanCode = (value: string | undefined): value is PricingPlanCode =>
  pricingPlanCodes.some((code) => code === value);

const readText = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export function ProposalForm({ initialPlanCode }: ProposalFormProps) {
  const [state, setState] = useState<ProposalState>({ status: "idle" });
  const baseId = useId();
  const disabled = state.status === "submitting";
  const normalizedPlan = isPricingPlanCode(initialPlanCode)
    ? initialPlanCode
    : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      companyName: readText(formData, "companyName"),
      contactName: readText(formData, "contactName"),
      email: readText(formData, "email"),
      phone: readText(formData, "phone"),
      teamSize: readText(formData, "teamSize"),
      priority: readText(formData, "priority"),
      currentTools: formData
        .getAll("currentTools")
        .filter((value): value is string => typeof value === "string"),
      plan: normalizedPlan,
      message: readText(formData, "message"),
      acceptsContact: formData.get("acceptsContact") === "on",
      websiteConfirmation: readText(formData, "websiteConfirmation"),
    };

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json();

      if (!response.ok || !isProposalResponse(body) || body.status !== "accepted") {
        const message =
          isProposalResponse(body) && body.safeError
            ? body.safeError
            : "La demande n’a pas pu être enregistrée.";
        setState({ status: "error", message });
        return;
      }

      setState({ status: "success", response: body });
      form.reset();
    } catch {
      setState({
        status: "error",
        message: "Le service de réception est temporairement indisponible.",
      });
    }
  };

  if (state.status === "success") {
    return (
      <section className="proposal-success" role="status">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">Demande enregistrée</p>
        <h2>Le contexte de départ est prêt.</h2>
        <p>{state.response.safeSummary}</p>
        <dl>
          <div>
            <dt>Référence</dt>
            <dd>{state.response.reference}</dd>
          </div>
          {normalizedPlan && (
            <div>
              <dt>Forfait exploré</dt>
              <dd>{normalizedPlan}</dd>
            </div>
          )}
        </dl>
        <button
          className="text-button"
          onClick={() => setState({ status: "idle" })}
          type="button"
        >
          Envoyer une autre demande
        </button>
      </section>
    );
  }

  return (
    <form className="proposal-form" onSubmit={handleSubmit}>
      {normalizedPlan && <input name="plan" type="hidden" value={normalizedPlan} />}
      <div className="proposal-honeypot" aria-hidden="true">
        <label htmlFor={`${baseId}-website-confirmation`}>Confirmation web</label>
        <input
          autoComplete="off"
          id={`${baseId}-website-confirmation`}
          name="websiteConfirmation"
          tabIndex={-1}
        />
      </div>

      <div className="form-grid">
        <label>
          <span>Entreprise</span>
          <input
            autoComplete="organization"
            disabled={disabled}
            maxLength={200}
            name="companyName"
            required
          />
        </label>
        <label>
          <span>Votre nom</span>
          <input
            autoComplete="name"
            disabled={disabled}
            maxLength={160}
            name="contactName"
            required
          />
        </label>
        <label>
          <span>Courriel</span>
          <input
            autoComplete="email"
            disabled={disabled}
            maxLength={254}
            name="email"
            required
            type="email"
          />
        </label>
        <label>
          <span>Téléphone <small>optionnel</small></span>
          <input
            autoComplete="tel"
            disabled={disabled}
            maxLength={80}
            name="phone"
            type="tel"
          />
        </label>
        <label>
          <span>Taille de l’équipe</span>
          <select defaultValue="" disabled={disabled} name="teamSize" required>
            <option disabled value="">
              Choisir
            </option>
            {proposalTeamSizes.map((size) => (
              <option key={size} value={size}>
                {size} personnes
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Priorité à présenter</span>
          <select defaultValue="" disabled={disabled} name="priority" required>
            <option disabled value="">
              Choisir
            </option>
            {proposalPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {proposalPriorityLabels[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="tool-picker">
        <legend>Outils déjà utilisés <small>optionnel</small></legend>
        <div>
          {currentToolOptions.map((tool) => (
            <label key={tool}>
              <input
                disabled={disabled}
                name="currentTools"
                type="checkbox"
                value={tool}
              />
              <span>{tool}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        <span>Contexte <small>optionnel</small></span>
        <textarea
          disabled={disabled}
          maxLength={2000}
          name="message"
          placeholder="Projet pilote, problème prioritaire, intégration ou échéance à considérer."
          rows={4}
        />
      </label>

      <label className="checkbox-row">
        <input disabled={disabled} name="acceptsContact" required type="checkbox" />
        <span>
          J’autorise l’équipe ProJD à me contacter au sujet de cette demande.
        </span>
      </label>

      <div className="proposal-form-footer">
        <button className="button primary" disabled={disabled} type="submit">
          {disabled ? "Enregistrement…" : "Préparer ma proposition"}
        </button>
        <small>Aucun paiement n’est demandé à cette étape.</small>
      </div>

      <p
        className={state.status === "error" ? "form-status error" : "form-status"}
        role="status"
      >
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
