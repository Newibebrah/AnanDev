import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            color: "#6366F1",
            letterSpacing: "3px",
            marginBottom: "20px",
          }}
        >
          ANANDEV
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.15,
          }}
        >
          Portfolio & Blog
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            marginTop: "20px",
          }}
        >
          Full-Stack Developer
        </div>
      </div>
    ),
    { ...size }
  );
}
