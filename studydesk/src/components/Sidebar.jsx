import { dark, TODAY } from "../constants";

const NAV_ITEMS = [
  { id: "inicio",     icon: "⊞", label: "Inicio"     },
  { id: "materias",   icon: "◈", label: "Materias"   },
  { id: "horarios",   icon: "◷", label: "Horarios"   },
  { id: "tareas",     icon: "✓", label: "Tareas"     },
  { id: "calendario", icon: "▦", label: "Calendario" },
];

export default function Sidebar({ view, setView }) {
  return (
    <div style={{
      width: 220,
      background: dark.surface,
      borderRight: `1.5px solid ${dark.border}`,
      padding: "28px 0 0",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      <div style={{ padding: "0 20px 22px", borderBottom: `1.5px solid ${dark.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#9d96f0", letterSpacing: "-0.5px" }}>
          Pagina Estudio BY MAX
        </div>
        <div style={{ fontSize: 12, color: dark.muted, marginTop: 2 }}>Panel de estudio</div>
      </div>

      <nav style={{ padding: "14px 12px", flex: 1 }}>
        {NAV_ITEMS.map(n => (
          <div
            key={n.id}
            onClick={() => setView(n.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 12px",
              borderRadius: 10,
              cursor: "pointer",
              marginBottom: 4,
              fontWeight: view === n.id ? 600 : 400,
              background: view === n.id ? "#2d2b4e" : "transparent",
              color: view === n.id ? "#9d96f0" : dark.muted,
              fontSize: 14,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
          </div>
        ))}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: `1.5px solid ${dark.border}` }}>
        <div style={{ fontSize: 11, color: dark.muted }}>Hoy</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: dark.text, marginTop: 2 }}>
          {TODAY.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short" })}
        </div>
      </div>
    </div>
  );
}
