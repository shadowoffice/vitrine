import { ImageResponse } from "next/og";

export const alt =
  "ProJD par Fichero — ERP construction pour entrepreneurs québécois";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
          padding: "58px 68px",
          background: "#0d1926",
          color: "#f8fafc",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-120px",
            bottom: "-190px",
            width: "620px",
            height: "620px",
            display: "flex",
            border: "72px solid rgba(43, 181, 143, 0.13)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "66px",
                height: "66px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "18px",
                borderRadius: "14px",
                background: "#f8fafc",
                color: "#0d1926",
                fontSize: "36px",
                fontWeight: 800,
              }}
            >
              P
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1,
              }}
            >
              <span style={{ fontSize: "34px", fontWeight: 800 }}>ProJD</span>
              <span
                style={{
                  marginTop: "9px",
                  color: "#91a2b5",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                }}
              >
                PAR FICHERO
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(134, 239, 206, 0.45)",
              borderRadius: "999px",
              padding: "12px 22px",
              color: "#86efce",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            ERP CONSTRUCTION · QUÉBEC
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "940px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#86efce",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Projets · Finance · Appels d’offres
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "18px",
              fontSize: "66px",
              fontWeight: 800,
              lineHeight: 1.03,
              letterSpacing: "-0.045em",
            }}
          >
            Les opérations chantier, réunies.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "22px",
              maxWidth: "850px",
              color: "#cbd5e1",
              fontSize: "26px",
              lineHeight: 1.35,
            }}
          >
            Un environnement de gestion moderne pour les entrepreneurs
            québécois.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#91a2b5",
            fontSize: "17px",
            fontWeight: 700,
          }}
        >
          <span style={{ display: "flex" }}>fichero.cloud</span>
          <span style={{ display: "flex" }}>
            Projets · Budgets · BID · Partenaires · Rapports
          </span>
        </div>
      </div>
    ),
    size,
  );
}
