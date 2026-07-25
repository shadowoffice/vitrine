import { SiteHeader } from "../_components/SiteHeader";
import { ErpOrderForm } from "./ErpOrderForm";
import { demoErpUrl } from "@/lib/site-content";

export const metadata = {
  title: "Commander ProJD",
  description:
    "Commander une instance ProJD ERP pour une compagnie de construction avec portail, modules et activation Fondation.",
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
          <p className="eyebrow">Commande ERP</p>
          <h1 id="order-title">Commander une instance ProJD</h1>
          <p>
            La commande prépare l&apos;espace ProJD de la compagnie, les licences, le portail
            collaboratif, les modules et la première activation. Un paiement Stripe ou PayPal
            déclenche le flux fournisseur; un code promo Fondation valide active le tenant gratuit
            comme une commande déjà payée.
          </p>
        </div>
        <div className="order-summary" aria-label="Processus de commande">
          <span>Client</span>
          <span>Forfait</span>
          <span>Portail et modules</span>
          <span>Paiement</span>
          <span>Licence</span>
          <span>ERP Docker</span>
        </div>
      </section>

      <section className="order-section" aria-label="Formulaire de commande ERP">
        <div className="order-copy">
          <p className="eyebrow">Onboarding</p>
          <h2>Créer le bon dossier d’achat dès le départ</h2>
          <p>
            Le formulaire qualifie l’entreprise, le forfait, le nombre d’utilisateurs et le
            préfixe ERP souhaité, par exemple client1 pour client1.erp.fichero.cloud. Fondation
            pourra ensuite préparer le tenant, le domaine, les accès, les licences, les sauvegardes
            et les prochaines étapes d&apos;intégration.
          </p>
        </div>
        <ErpOrderForm initialPlanCode={initialPlanCode} />
      </section>
    </main>
  );
}
