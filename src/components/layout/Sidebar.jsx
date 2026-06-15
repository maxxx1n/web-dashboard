import {
  LayoutDashboard,
  BookOpen,
  Clock,
  CheckSquare,
  Calendar,
  Timer,
  BarChart3,
} from "lucide-react";
import { dark } from "../../config/constants";
import { TODAY } from "../../utils/helpers";

const NAV = [
  { id: "inicio",     icon: LayoutDashboard, label: "Inicio"       },
  { id: "materias",   icon: BookOpen,        label: "Materias"     },
  { id: "horarios",   icon: Clock,           label: "Horarios"     },
  { id: "tareas",     icon: CheckSquare,     label: "Tareas"       },
  { id: "calendario", icon: Calendar,        label: "Calendario"   },
  { id: "stats",      icon: BarChart3,       label: "Estadísticas" },
];

export default function Sidebar({ view, setView, tareas = [] }) {
  const pendientes = tareas.filter(t => t.estado === "pendiente").length;

  return (
    <div style={{
      width: 230,
      background: dark.surface,
      borderRight: `1px solid ${dark.border}`,
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 22px 22px", borderBottom: `1px solid ${dark.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#9d96f0,#6c63ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📚</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: dark.text, letterSpacing: "-0.5px" }}>Pagina Estudio by MAX</div>
            <div style={{ fontSize: 11, color: dark.muted }}>Panel de estudio</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "14px 12px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: dark.muted, letterSpacing: 1.5, textTransform: "uppercase", padding: "0 10px", marginBottom: 8 }}>Menú</div>
        {NAV.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`nav-item${view === id ? " active" : ""}`}
            onClick={() => setView(id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
              marginBottom: 2,
              fontSize: 14,
              color: view === id ? "#9d96f0" : dark.muted,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon size={16} />
              <span style={{ fontWeight: view === id ? 600 : 400 }}>{label}</span>
            </div>
            {/* Badge de pendientes solo en Tareas */}
            {id === "tareas" && pendientes > 0 && (
              <span style={{ background: "#9d96f0", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>
                {pendientes}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 22px", borderTop: `1px solid ${dark.border}` }}>
        <div style={{ fontSize: 11, color: dark.muted, marginBottom: 2 }}>Hoy</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: dark.text }}>
          {TODAY.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}