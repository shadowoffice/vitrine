"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { trackFunnelEvent } from "../_components/PrivacyAnalytics";
import {
  isProposalResponse,
  proposalPriorities,
  proposalPriorityLabels,
  proposalTeamSizes,
  type ProposalResponse,
} from "@/lib/proposal";
import { pricingPlanCodes, type PricingPlanCode } from "@/lib/pricing";

type ModuleOption = {
  slug: string;
  label: string;
};

type ProposalFormProps = {
  bookingUrl?: string;
  initialModuleSlugs?: string[];
  initialPlanCode?: string;
  moduleOptions: ModuleOption[];
  sourceContext?: string;
};

type ProposalState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; response: ProposalResponse }
  | { status: "error"; message: string };

type FieldName =
  | "teamSize"
  | "priority"
  | "companyName"
  | "contactName"
  | "email"
  | "acceptsContact";

type FieldErrors = Partial<Record<FieldName, string>>;

const currentToolOptions = [
  "Procore",
  "SharePoint / Microsoft 365",
  "Excel",
  "ERP comptable existant",
  "Processus surtout manuel",
] as const;

const isPricingPlanCode = (
  value: string | undefined,
): value is PricingPlanCode =>
  pricingPlanCodes.some((code) => code === value);

const readText = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const validateNeeds = (formData: FormData): FieldErrors => {
  const errors: FieldErrors = {};
  if (!readText(formData, "teamSize")) {
    errors.teamSize = "Choisissez une taille d’équipe.";
  }
  if (!readText(formData, "priority")) {
    errors.priority = "Choisissez le premier flux à présenter.";
  }
  return errors;
};

const validateContact = (form: HTMLFormElement): FieldErrors => {
  const formData = new FormData(form);
  const errors: FieldErrors = {};
  if (readText(formData, "companyName").length < 2) {
    errors.companyName = "Entrez le nom de l’entreprise.";
  }
  if (readText(formData, "contactName").length < 2) {
    errors.contactName = "Entrez le nom de la personne à contacter.";
  }

  const email = form.elements.namedItem("email");
  if (
    !(email instanceof HTMLInputElement) ||
    !email.value.trim() ||
    !email.validity.valid
  ) {
    errors.email = "Entrez une adresse courriel valide.";
  }
  if (formData.get("acceptsContact") !== "on") {
    errors.acceptsContact = "L’autorisation de contact est requise.";
  }
  return errors;
};

const firstErrorName = (errors: FieldErrors): FieldName | undefined =>
  (
    [
      "teamSize",
      "priority",
      "companyName",
      "contactName",
      "email",
      "acceptsContact",
    ] satisfies FieldName[]
  ).find((name) => Boolean(errors[name]));

export function ProposalForm({
  bookingUrl,
  initialModuleSlugs = [],
  initialPlanCode,
  moduleOptions,
  sourceContext,
}: ProposalFormProps) {
  const [state, setState] = useState<ProposalState>({ status: "idle" });
  const [step, setStep] = useState<1 | 2>(1);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKeyRef = useRef<string | null>(null);
  const interactionTrackedRef = useRef(false);
  const baseId = useId();
  const disabled = state.status === "submitting";
  const normalizedPlan = isPricingPlanCode(initialPlanCode)
    ? initialPlanCode
    : undefined;
  const initialModuleSet = new Set(initialModuleSlugs);

  const focusField = (name: FieldName): void => {
    requestAnimationFrame(() => {
      const control = formRef.current?.elements.namedItem(name);
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement
      ) {
        control.focus();
      }
    });
  };

  const errorId = (name: FieldName): string => `${baseId}-${name}-error`;

  const startInteractionTracking = (): void => {
    if (!interactionTrackedRef.current) {
      interactionTrackedRef.current = true;
      trackFunnelEvent("proposal_started", sourceContext);
    }
  };

  const continueToContact = (): void => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const errors = validateNeeds(new FormData(form));
    setFieldErrors((current) => ({
      ...current,
      teamSize: errors.teamSize,
      priority: errors.priority,
    }));
    const firstError = firstErrorName(errors);
    if (firstError) {
      focusField(firstError);
      return;
    }

    setStep(2);
    trackFunnelEvent("proposal_step", "step:contact");
    requestAnimationFrame(() => {
      const companyName = form.elements.namedItem("companyName");
      if (companyName instanceof HTMLInputElement) {
        companyName.focus();
      }
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const needsErrors = validateNeeds(new FormData(form));
    const contactErrors = validateContact(form);
    const errors = { ...needsErrors, ...contactErrors };
    setFieldErrors(errors);

    const firstError = firstErrorName(errors);
    if (firstError) {
      if (firstError === "teamSize" || firstError === "priority") {
        setStep(1);
      } else {
        setStep(2);
      }
      focusField(firstError);
      return;
    }

    setState({ status: "submitting" });
    trackFunnelEvent("proposal_submit", sourceContext);

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
      selectedModules: formData
        .getAll("selectedModules")
        .filter((value): value is string => typeof value === "string"),
      sourceContext,
      plan: normalizedPlan,
      message: readText(formData, "message"),
      acceptsContact: formData.get("acceptsContact") === "on",
      websiteConfirmation: readText(formData, "websiteConfirmation"),
    };

    idempotencyKeyRef.current ??= window.crypto.randomUUID();

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json();

      if (
        !response.ok ||
        !isProposalResponse(body) ||
        body.status !== "accepted"
      ) {
        const message =
          isProposalResponse(body) && body.safeError
            ? body.safeError
            : "La demande n’a pas pu être enregistrée.";
        setState({ status: "error", message });
        trackFunnelEvent("proposal_error", `status:${response.status}`);
        return;
      }

      setState({ status: "success", response: body });
      trackFunnelEvent("proposal_success", sourceContext);
    } catch {
      setState({
        status: "error",
        message: "Le service de réception est temporairement indisponible.",
      });
      trackFunnelEvent("proposal_error", "status:network");
    }
  };

  if (state.status === "success") {
    return (
      <section className="proposal-success" role="status" tabIndex={-1}>
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
        <div className="proposal-next-step">
          <strong>Prochaine étape</strong>
          <p>
            L’équipe relira le périmètre transmis avant de confirmer une
            démonstration, les responsabilités et les conditions d’une
            proposition écrite.
          </p>
        </div>
        <div className="proposal-success-actions">
          {bookingUrl && (
            <a
              className="button primary"
              href={bookingUrl}
              rel="noreferrer"
              target="_blank"
            >
              Choisir un rendez-vous
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <Link className="button secondary" href="/scenarios">
            Préparer le scénario
          </Link>
          <button
            className="text-button"
            onClick={() => {
              idempotencyKeyRef.current = null;
              setState({ status: "idle" });
              setStep(1);
            }}
            type="button"
          >
            Envoyer une autre demande
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      className="proposal-form"
      noValidate
      onFocusCapture={startInteractionTracking}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <ol className="proposal-progress" aria-label="Progression du formulaire">
        <li aria-current={step === 1 ? "step" : undefined}>
          <span>1</span> Besoin
        </li>
        <li aria-current={step === 2 ? "step" : undefined}>
          <span>2</span> Contact
        </li>
      </ol>
      {normalizedPlan && (
        <input name="plan" type="hidden" value={normalizedPlan} />
      )}
      <div className="proposal-honeypot" aria-hidden="true">
        <label htmlFor={`${baseId}-website-confirmation`}>
          Confirmation web
        </label>
        <input
          autoComplete="off"
          id={`${baseId}-website-confirmation`}
          name="websiteConfirmation"
          tabIndex={-1}
        />
      </div>

      <section
        aria-labelledby={`${baseId}-needs-title`}
        hidden={step !== 1}
      >
        <div className="proposal-step-heading">
          <p className="eyebrow">Étape 1 sur 2</p>
          <h2 id={`${baseId}-needs-title`}>Cadrer le premier workflow.</h2>
          <p>Les modules sont une sélection de départ, pas un engagement.</p>
        </div>

        <div className="form-grid">
          <label>
            <span>Taille de l’équipe</span>
            <select
              aria-describedby={
                fieldErrors.teamSize ? errorId("teamSize") : undefined
              }
              aria-invalid={Boolean(fieldErrors.teamSize)}
              defaultValue=""
              disabled={disabled}
              name="teamSize"
              required
            >
              <option disabled value="">
                Choisir
              </option>
              {proposalTeamSizes.map((size) => (
                <option key={size} value={size}>
                  {size} personnes
                </option>
              ))}
            </select>
            {fieldErrors.teamSize && (
              <small className="field-error" id={errorId("teamSize")}>
                {fieldErrors.teamSize}
              </small>
            )}
          </label>
          <label>
            <span>Priorité à présenter</span>
            <select
              aria-describedby={
                fieldErrors.priority ? errorId("priority") : undefined
              }
              aria-invalid={Boolean(fieldErrors.priority)}
              defaultValue=""
              disabled={disabled}
              name="priority"
              required
            >
              <option disabled value="">
                Choisir
              </option>
              {proposalPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {proposalPriorityLabels[priority]}
                </option>
              ))}
            </select>
            {fieldErrors.priority && (
              <small className="field-error" id={errorId("priority")}>
                {fieldErrors.priority}
              </small>
            )}
          </label>
        </div>

        <fieldset className="module-picker">
          <legend>
            Modules à examiner <small>optionnel</small>
          </legend>
          <div>
            {moduleOptions.map((module) => (
              <label key={module.slug}>
                <input
                  defaultChecked={initialModuleSet.has(module.slug)}
                  disabled={disabled}
                  name="selectedModules"
                  type="checkbox"
                  value={module.slug}
                />
                <span>{module.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tool-picker">
          <legend>
            Outils déjà utilisés <small>optionnel</small>
          </legend>
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
          <span>
            Contexte <small>optionnel</small>
          </span>
          <textarea
            disabled={disabled}
            maxLength={2000}
            name="message"
            placeholder="Projet pilote, problème prioritaire, intégration ou échéance à considérer."
            rows={4}
          />
        </label>

        <div className="proposal-form-footer">
          <button
            className="button primary"
            disabled={disabled}
            onClick={continueToContact}
            type="button"
          >
            Continuer
          </button>
          <small>Aucun paiement n’est demandé à cette étape.</small>
        </div>
      </section>

      <section
        aria-labelledby={`${baseId}-contact-title`}
        hidden={step !== 2}
      >
        <div className="proposal-step-heading">
          <p className="eyebrow">Étape 2 sur 2</p>
          <h2 id={`${baseId}-contact-title`}>Où transmettre le suivi.</h2>
          <p>Les champs fiscaux et les données de paiement ne sont pas requis.</p>
        </div>

        <div className="form-grid">
          <label>
            <span>Entreprise</span>
            <input
              aria-describedby={
                fieldErrors.companyName ? errorId("companyName") : undefined
              }
              aria-invalid={Boolean(fieldErrors.companyName)}
              autoComplete="organization"
              disabled={disabled}
              maxLength={200}
              name="companyName"
              required
            />
            {fieldErrors.companyName && (
              <small className="field-error" id={errorId("companyName")}>
                {fieldErrors.companyName}
              </small>
            )}
          </label>
          <label>
            <span>Votre nom</span>
            <input
              aria-describedby={
                fieldErrors.contactName ? errorId("contactName") : undefined
              }
              aria-invalid={Boolean(fieldErrors.contactName)}
              autoComplete="name"
              disabled={disabled}
              maxLength={160}
              name="contactName"
              required
            />
            {fieldErrors.contactName && (
              <small className="field-error" id={errorId("contactName")}>
                {fieldErrors.contactName}
              </small>
            )}
          </label>
          <label>
            <span>Courriel</span>
            <input
              aria-describedby={
                fieldErrors.email ? errorId("email") : undefined
              }
              aria-invalid={Boolean(fieldErrors.email)}
              autoComplete="email"
              disabled={disabled}
              maxLength={254}
              name="email"
              required
              type="email"
            />
            {fieldErrors.email && (
              <small className="field-error" id={errorId("email")}>
                {fieldErrors.email}
              </small>
            )}
          </label>
          <label>
            <span>
              Téléphone <small>optionnel</small>
            </span>
            <input
              autoComplete="tel"
              disabled={disabled}
              maxLength={80}
              name="phone"
              type="tel"
            />
          </label>
        </div>

        <label className="checkbox-row">
          <input
            aria-describedby={
              fieldErrors.acceptsContact
                ? errorId("acceptsContact")
                : undefined
            }
            aria-invalid={Boolean(fieldErrors.acceptsContact)}
            disabled={disabled}
            name="acceptsContact"
            required
            type="checkbox"
          />
          <span>
            J’autorise l’équipe ProJD à me contacter au sujet de cette demande.
            {fieldErrors.acceptsContact && (
              <small className="field-error" id={errorId("acceptsContact")}>
                {fieldErrors.acceptsContact}
              </small>
            )}
          </span>
        </label>

        <div className="proposal-form-footer">
          <button
            className="button secondary"
            disabled={disabled}
            onClick={() => setStep(1)}
            type="button"
          >
            Retour
          </button>
          <button className="button primary" disabled={disabled} type="submit">
            {disabled ? "Enregistrement…" : "Préparer ma proposition"}
          </button>
        </div>
      </section>

      <p
        className={state.status === "error" ? "form-status error" : "form-status"}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
