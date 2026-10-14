import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", background: "#131E29", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80 }}>
      <div style={{ display: "flex", width: 90, height: 90, background: "#007680", transform: "rotate(45deg)", marginBottom: 60, marginLeft: 20 }} />
      <div style={{ fontSize: 96, fontWeight: 700 }}>OAK PRO</div>
      <div style={{ fontSize: 40, color: "#EED484", marginTop: 12 }}>Contracting · Waste Management · Facility Services — Dammam</div>
    </div>), size);
}
