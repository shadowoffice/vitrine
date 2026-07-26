const budgetRows = [
  { code: "03-200", trade: "Béton", committed: "72 %", state: "Dans la cible" },
  { code: "06-100", trade: "Charpente", committed: "84 %", state: "À revoir" },
  { code: "09-500", trade: "Gypse", committed: "38 %", state: "En cours" },
];

const workItems = [
  { label: "Directive CO-014", meta: "Échéance aujourd’hui", tone: "warning" },
  { label: "RFI-028 • Structure", meta: "Réponse Procore reçue", tone: "success" },
  { label: "Lot 26 00 00", meta: "3 offres à comparer", tone: "neutral" },
] as const;

export function ErpPreview() {
  return (
    <figure className="product-workspace" aria-label="Aperçu du cockpit ProJD">
      <div className="workspace-browser">
        <span />
        <span />
        <span />
        <strong>projd / projet / tableau de bord</strong>
      </div>

      <div className="workspace-shell">
        <aside className="workspace-nav" aria-label="Exemple de navigation ERP">
          <div className="workspace-logo">P</div>
          <span className="is-active">Vue projet</span>
          <span>Finance</span>
          <span>Contrats</span>
          <span>Appels d’offres</span>
          <span>Partenaires</span>
          <span>Rapports</span>
        </aside>

        <div className="workspace-main">
          <div className="workspace-heading">
            <div>
              <span>Projet 24-017</span>
              <strong>Complexe Saint-Laurent</strong>
            </div>
            <span className="workspace-status">
              <span aria-hidden="true" />
              Projet actif
            </span>
          </div>

          <div className="workspace-kpis">
            <article>
              <span>Budget révisé</span>
              <strong>4,82 M$</strong>
              <small>Source ERP</small>
            </article>
            <article>
              <span>Coûts engagés</span>
              <strong>3,31 M$</strong>
              <small>68,7 % du budget</small>
            </article>
            <article>
              <span>Actions ouvertes</span>
              <strong>14</strong>
              <small>3 à traiter cette semaine</small>
            </article>
          </div>

          <div className="workspace-content-grid">
            <section className="workspace-card workspace-finance-card">
              <div className="workspace-card-heading">
                <div>
                  <span>Lecture financière</span>
                  <strong>Engagement par division</strong>
                </div>
                <small>Mis à jour 08:42</small>
              </div>

              <div className="workspace-bars" aria-hidden="true">
                <span style={{ "--bar-size": "72%" } as React.CSSProperties} />
                <span style={{ "--bar-size": "84%" } as React.CSSProperties} />
                <span style={{ "--bar-size": "38%" } as React.CSSProperties} />
              </div>

              <div className="workspace-table" role="table" aria-label="Exemple de suivi budgétaire">
                {budgetRows.map((row) => (
                  <div role="row" key={row.code}>
                    <span role="cell">{row.code}</span>
                    <strong role="cell">{row.trade}</strong>
                    <span role="cell">{row.committed}</span>
                    <small role="cell">{row.state}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="workspace-card workspace-priority-card">
              <div className="workspace-card-heading">
                <div>
                  <span>Coordination</span>
                  <strong>À traiter</strong>
                </div>
                <small>3 éléments</small>
              </div>

              <div className="workspace-priority-list">
                {workItems.map((item) => (
                  <div key={item.label}>
                    <span className={`priority-dot priority-${item.tone}`} aria-hidden="true" />
                    <p>
                      <strong>{item.label}</strong>
                      <small>{item.meta}</small>
                    </p>
                  </div>
                ))}
              </div>

              <div className="workspace-progress">
                <span>Rapport hebdomadaire</span>
                <strong>Prêt à réviser</strong>
              </div>
            </section>
          </div>
        </div>
      </div>

      <figcaption>Données fictives présentées à titre de démonstration.</figcaption>
    </figure>
  );
}
