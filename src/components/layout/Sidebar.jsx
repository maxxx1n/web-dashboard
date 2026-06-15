import {
  LayoutDashboard,
  BookOpen,
  Clock,
  CheckSquare,
  Calendar,
  BarChart3,
} from "lucide-react";
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
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📚</div>
          <div>
            <div className="sidebar-logo-text">StudyDesk</div>
            <div className="sidebar-logo-sub">Panel de estudio</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Menú</div>
        {NAV.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`nav-item${view === id ? " active" : ""}`}
            onClick={() => setView(id)}
          >
            <div className="nav-item-content">
              <Icon size={16} />
              <span>{label}</span>
            </div>
            {id === "tareas" && pendientes > 0 && (
              <span className="nav-badge">{pendientes}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Hoy</div>
        <div className="sidebar-footer-date">
          {TODAY.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}