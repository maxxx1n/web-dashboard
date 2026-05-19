import { dark } from "../constants";

export const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1.5px solid ${dark.border}`,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  marginTop: 4,
  background: dark.subtle,
  color: dark.text,
  transition: "border-color 0.15s",
};

export const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: dark.muted,
  display: "block",
  marginTop: 16,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

export const btnPrimary = {
  background: "linear-gradient(135deg,#9d96f0,#7f77dd)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 22px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 14,
};

export const btnGhost = {
  background: "transparent",
  color: dark.muted,
  border: `1.5px solid ${dark.border}`,
  borderRadius: 10,
  padding: "10px 22px",
  fontWeight: 500,
  cursor: "pointer",
  fontSize: 14,
  marginRight: 8,
};

export const card = {
  background: dark.card,
  borderRadius: 16,
  border: `1.5px solid ${dark.border}`,
  padding: "22px 24px",
};

export const badge = (bg, color) => ({
  display: "inline-flex",
  alignItems: "center",
  fontSize: 11,
  background: bg,
  color,
  padding: "3px 9px",
  borderRadius: 20,
  fontWeight: 600,
  letterSpacing: 0.3,
});

export const iconBtn = (color, bg) => ({
  background: bg || "transparent",
  border: "none",
  cursor: "pointer",
  color,
  fontSize: 13,
  padding: "5px 9px",
  borderRadius: 7,
});

export const sectionTitle = (title, sub) => (
  <div style={{ marginBottom: 28 }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5", letterSpacing: "-0.5px" }}>{title}</h1>
    {sub && <p style={{ color: "#7070a0", marginTop: 5, fontSize: 14 }}>{sub}</p>}
  </div>
);