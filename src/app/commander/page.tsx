import { SiteHeader } from "../_components/SiteHeader";
import { ErpOrderForm } from "./ErpOrderForm";
import { demoErpUrl } from "@/lib/site-content";

export const metadata = {
  title: "Acheter ProJD",
  description: "Acheter ProJD et préparer un espace ERP construction pour une première équipe projet.",
};

type OrderPageProps = {
  searchParams?: Promise<{
    plan?: string | string[];
  }>;
};

const firstQueryValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialPlanCode = firstQueryValue(params.plan);

  return (
    <main>
      <SiteHeader ctaHref={demoErpUrl} ctaLabel="Voir la démo ERP" />

      <section className="order-hero" aria-labelledby="order-title">
        <div>
          <p className="eyebrow">Achat ERP</p>
          <h1 id="order-title">Acheter ProJD</h1>
          <p>
            L’achat prépare l’espace ProJD, les licences et la première activation. Dès que le
            paiement est confirmé, l’équipe peut cadrer le forfait, les utilisateurs et les modules
            prioritaires.
          </p>
        </div>
        <div className="order-summary" aria-label="Processus de commande">
          <span>Client</span>
          <span>Paiement</span>
          <span>Licence</span>
          <span>Espace ERP</span>
          <span>Activation</span>
        </div>
      </section>

      <section className="order-section" aria-label="Formulaire de commande ERP">
        <div className="order-copy">
          <p className="eyebrow">Onboarding</p>
          <h2>Créer le bon dossier d’achat dès le départ</h2>
          <p>
            Le formulaire qualifie l’entreprise, le forfait, le nombre d’utilisateurs et le
            sous-domaine souhaité, par exemple client-1 ou client-2. Ces informations accélèrent la
            préparation du premier espace ProJD.
          </p>
        </div>
        <ErpOrderForm initialPlanCode={initialPlanCode} />
      </section>
    </main>
  );
}
