const budgetRows = [
  { code: "03-200", trade: "Béton", budget: "184 500 $", actual: "96 280 $", status: "Suivi" },
  { code: "06-100", trade: "Charpente", budget: "267 900 $", actual: "211 440 $", status: "À valider" },
  { code: "09-500", trade: "Gypse", budget: "142 700 $", actual: "48 030 $", status: "Ouvert" },
];

const bidItems = ["Électricité", "Ventilation", "Revêtements", "Toiture"];
const portalItems = ["Documents partagés", "Réponses reçues", "Demandes en attente", "Accès API"];

export function ErpPreview() {
  return (
    <figure className="erp-preview" aria-label="Maquette du tableau de bord ERP ProJD">
      <div className="erp-preview-topbar">
        <div>
          <span>ProJD</span>
          <strong>Construction Nord ERP</strong>
        </div>
        <span className="preview-badge">Instance dédiée</span>
      </div>

      <div className="erp-preview-layout">
        <aside className="preview-sidebar" aria-label="Navigation ERP">
          <span className="active">Vue projet</span>
          <span>Budget</span>
          <span>Appels d’offres</span>
          <span>Portail</span>
          <span>Documents</span>
          <span>API</span>
        </aside>

        <div className="preview-main">
          <div className="preview-metrics">
            <article>
              <span>Projets actifs</span>
              <strong>18</strong>
            </article>
            <article>
              <span>Soumissions</span>
              <strong>24</strong>
            </article>
            <article>
              <span>Partenaires portail</span>
              <strong>42</strong>
            </article>
          </div>

          <div className="preview-panel">
            <div className="preview-panel-heading">
              <strong>Coûts par division</strong>
              <span>Budget vs réel</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Division</th>
                  <th>Budget</th>
                  <th>Réel</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {budgetRows.map((row) => (
                  <tr key={row.code}>
                    <td>{row.code}</td>
                    <td>{row.trade}</td>
                    <td>{row.budget}</td>
                    <td>{row.actual}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="preview-footer-grid">
            <div className="preview-panel">
              <div className="preview-panel-heading">
                <strong>Appels d&apos;offres</strong>
                <span>4 lots actifs</span>
              </div>
              <div className="bid-list">
                {bidItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="preview-panel sync-panel">
              <div className="preview-panel-heading">
                <strong>Portail et API</strong>
                <span>Collaboration contrôlée</span>
              </div>
              {portalItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
