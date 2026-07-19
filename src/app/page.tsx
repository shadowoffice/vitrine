const navigation = [
  { label: "Plateforme", href: "#plateforme" },
  { label: "Modules", href: "#modules" },
  { label: "Forfaits", href: "#forfaits" },
  { label: "Contact", href: "#contact" },
];

const indicators = [
  { value: "24/7", label: "état des instances" },
  { value: "TLS", label: "domaines prêts" },
  { value: "ERP", label: "tenants isolés" },
  { value: "QC", label: "construction" },
];

const productPillars = [
  {
    title: "Vitrine publique",
    text: "Une entrée claire pour présenter l’offre, qualifier les prospects et guider les demandes de démo.",
  },
  {
    title: "Fondation SaaS",
    text: "Un plan de contrôle pour les clients, les domaines, le TLS, les environnements et les opérations.",
  },
  {
    title: "ERP ProJD",
    text: "Des instances ERP dédiées pour les projets, les coûts, les contacts, les documents et les suivis chantier.",
  },
];

const modules = [
  "Clients et tenants",
  "Projets et budgets",
  "Documents et SharePoint",
  "Factures et coûts",
  "Domaines et certificats",
  "Audit et opérations",
  "Portail partenaires",
  "Rapports exécutifs",
];

const workflow = [
  "Qualifier le client",
  "Préparer son instance ERP",
  "Brancher domaine et TLS",
  "Activer les modules",
  "Suivre santé et coûts",
];

const packages = [
  {
    name: "Départ",
    price: "Sur mesure",
    description: "Pour valider le fit avec une première instance ERP et un domaine dédié.",
    items: ["Démo guidée", "Environnement de test", "Plan d’implantation"],
  },
  {
    name: "Croissance",
    price: "Équipe projet",
    description: "Pour centraliser les opérations d’une entreprise de construction active.",
    items: ["ERP multi-projets", "Routage domaines", "Tableaux de bord"],
    featured: true,
  },
  {
    name: "Plateforme",
    price: "Multi-clients",
    description: "Pour opérer plusieurs tenants, environnements et flux d’intégration.",
    items: ["Provisioning contrôlé", "Audit complet", "Connecteurs avancés"],
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Navigation principale">
        <a className="brand" href="#top" aria-label="Fichero accueil">
          <span className="brand-mark">F</span>
          <span>Fichero</span>
        </a>
        <nav>
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="mailto:contact@fichero.cloud?subject=Demande%20de%20démo%20Fichero">
          Démo
        </a>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-scene" aria-hidden="true">
          <div className="scene-board scene-board-main">
            <div className="scene-topline">
              <span>Fondation</span>
              <strong>Command Center</strong>
            </div>
            <div className="scene-grid">
              <span className="scene-stat strong"></span>
              <span className="scene-stat"></span>
              <span className="scene-stat accent"></span>
              <span className="scene-stat wide"></span>
            </div>
            <div className="scene-table">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="scene-board scene-board-side">
            <span className="scene-chip green">erp.demo</span>
            <span className="scene-chip amber">tls actif</span>
            <span className="scene-chip red">audit</span>
          </div>
        </div>

        <div className="hero-content">
          <p className="eyebrow">ERP construction Québec</p>
          <h1 id="hero-title">Fichero</h1>
          <p className="hero-lead">
            Une vitrine SaaS moderne pour présenter, vendre et activer des environnements ERP ProJD sans mélanger le marketing, l’administration et les données de production.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="mailto:contact@fichero.cloud?subject=Demande%20de%20démo%20Fichero">
              Demander une démo
            </a>
            <a className="button secondary" href="https://demo.erp.fichero.cloud">
              Voir un ERP
            </a>
          </div>
        </div>
      </section>

      <section id="plateforme" className="signal-strip" aria-label="Indicateurs Fichero">
        {indicators.map((indicator) => (
          <article key={indicator.label}>
            <strong>{indicator.value}</strong>
            <span>{indicator.label}</span>
          </article>
        ))}
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Architecture claire</p>
          <h2>La bonne app au bon endroit</h2>
          <p>
            Fichero sert d’entrée publique. Fondation orchestre les tenants et les opérations. ProJD livre l’ERP métier. Chaque couche garde sa responsabilité, son rythme de déploiement et sa sécurité.
          </p>
        </div>
        <div className="pillar-grid">
          {productPillars.map((pillar) => (
            <article className="card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="modules" className="section">
        <div className="section-heading">
          <p className="eyebrow">Modules</p>
          <h2>Une suite conçue pour les entrepreneurs qui veulent suivre les opérations, pas seulement les fichiers.</h2>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <span key={module}>{module}</span>
          ))}
        </div>
      </section>

      <section className="section workflow-section">
        <div className="section-heading">
          <p className="eyebrow">Déploiement</p>
          <h2>Du premier contact à l’instance ERP active.</h2>
        </div>
        <ol className="workflow-list">
          {workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section id="forfaits" className="section">
        <div className="section-heading">
          <p className="eyebrow">Forfaits</p>
          <h2>Un positionnement simple pour démarrer les conversations commerciales.</h2>
        </div>
        <div className="pricing-grid">
          {packages.map((plan) => (
            <article className={plan.featured ? "card pricing-card featured" : "card pricing-card"} key={plan.name}>
              <p>{plan.name}</p>
              <h3>{plan.price}</h3>
              <span>{plan.description}</span>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Préparer une démo Fichero</h2>
          <p>
            La première version publique peut déjà diriger les prospects vers une discussion, une démo ERP et l’onboarding Fondation.
          </p>
        </div>
        <div className="contact-actions">
          <a className="button primary" href="mailto:contact@fichero.cloud?subject=Demande%20de%20démo%20Fichero">
            Écrire à Fichero
          </a>
          <a className="button secondary" href="https://test.erp.fichero.cloud">
            Ouvrir le tenant test
          </a>
        </div>
      </section>
    </main>
  );
}
