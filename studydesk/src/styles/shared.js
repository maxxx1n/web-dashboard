import { dark } from "../constants";

export const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: `1.5px solid ${dark.border}`,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  marginTop: 4,
  background: dark.subtle,
  color: dark.text,
};

export const labelStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: dark.muted,
  display: "block",
  marginTop: 14,
};

export const btnPrimary = {
  background: "#7f77dd",
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
  padding: "20px 22px",
};

export const badge = (bg, color) => ({
  fontSize: 11,
  background: bg,
  color,
  padding: "2px 8px",
  borderRadius: 5,
  fontWeight: 600,
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
