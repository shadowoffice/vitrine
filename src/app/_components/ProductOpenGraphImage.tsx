import { ImageResponse } from "next/og";

type ProductOpenGraphImageProps = {
  category: string;
  description: string;
  title: string;
};

export const openGraphImageSize = {
  width: 1200,
  height: 630,
} as const;

export const createProductOpenGraphImage = ({
  category,
  description,
  title,
}: ProductOpenGraphImageProps): ImageResponse =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f2eb",
          color: "#10221e",
          padding: "64px 72px",
          borderTop: "18px solid #14735d",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#14735d",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span>{category}</span>
          <span>ProJD · ERP construction</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: title.length > 52 ? 58 : 68,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              marginTop: 24,
              color: "#52635f",
              fontSize: 27,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#10221e",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              display: "flex",
              width: 34,
              height: 10,
              background: "#14735d",
            }}
          />
          <span>fichero.cloud</span>
        </div>
      </div>
    ),
    openGraphImageSize,
  );
