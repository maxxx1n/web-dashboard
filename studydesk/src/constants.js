export const COLORS     = ["#9d96f0","#34d399","#f87171","#60a5fa","#f472b6","#fbbf24","#a3e635","#c084fc"];
export const COLOR_BG   = ["#2d2b4e","#1a3d30","#3d1f1f","#1a2d4e","#3d1a2d","#3d2e0a","#1f3d0a","#2d1a3d"];
export const COLOR_TEXT = ["#c4c0ff","#6ee7b7","#fca5a5","#93c5fd","#f9a8d4","#fde68a","#d9f99d","#e9d5ff"];

export const PRIORITY = {
  alta:  { label: "Alta",  color: "#f87171", bg: "#3d1f1f" },
  media: { label: "Media", color: "#fbbf24", bg: "#3d2e0a" },
  baja:  { label: "Baja",  color: "#34d399", bg: "#1a3d30" },
};

export const STATUS = {
  pendiente: "Pendiente",
  progreso:  "En progreso",
  hecha:     "Completada",
};

export const DIAS_SEMANA = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
export const MESES       = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export const dark = {
  bg:          "#0c0c10",
  surface:     "#13131a",
  card:        "#18181f",
  cardHover:   "#1e1e28",
  border:      "#252535",
  borderHover: "#3a3a50",
  text:        "#eaeaf5",
  muted:       "#7070a0",
  subtle:      "#1e1e2a",
  accent:      "#9d96f0",
};

export const TODAY    = new Date();
export const pad      = n => String(n).padStart(2, "0");
export const todayStr = `${TODAY.getFullYear()}-${pad(TODAY.getMonth()+1)}-${pad(TODAY.getDate())}`;