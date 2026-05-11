import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "#c28a2b",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      }}
    >
      <div style={{ fontSize: 96, lineHeight: 1 }}>Koreer</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          marginTop: 16,
          opacity: 0.85,
        }}
      >
        Cross-border job search
      </div>
    </div>,
    { ...size },
  );
}
