import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Calendar,
  BarChart3,
  LifeBuoy,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { TODAY } from "../../utils/helpers";

const NAV = [
  { id: "inicio", icon: LayoutDashboard, label: "Inicio" },
  { id: "materias", icon: BookOpen, label: "Materias" },
  { id: "tareas", icon: CheckSquare, label: "Tareas" },
  { id: "calendario", icon: Calendar, label: "Calendario" },
  { id: "stats", icon: BarChart3, label: "Estadísticas" },
  { id: "soporte", icon: LifeBuoy, label: "Soporte" },
];

export default function Sidebar({
  view,
  setView,
  tareas = [],
  isOpen,
  isCollapsed,
  toggleCollapsed,
}) {
  const pendientes = tareas.filter((t) => t.estado === "pendiente").length;

  return (
    <div
      className={`sidebar ${isOpen ? "open" : ""} ${isCollapsed && !isOpen ? "collapsed" : ""}`}
    >
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BookOpen size={18} color="#fff" />
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1 }}>
              <div className="sidebar-logo-text">Organizador de Estudio</div>
              <div className="sidebar-logo-sub">Panel de estudio</div>
            </div>
          )}
          <button
            className="icon-btn sidebar-collapse-btn"
            onClick={toggleCollapsed}
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            style={{
              color: "var(--text-muted)",
              padding: 4,
              marginLeft: isCollapsed ? 0 : "auto",
            }}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {!isCollapsed && <div className="sidebar-nav-label">Menú</div>}
        {NAV.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`nav-item${view === id ? " active" : ""}`}
            onClick={() => setView(id)}
            title={isCollapsed ? label : ""}
          >
            <div className="nav-item-content">
              <Icon size={16} />
              {!isCollapsed && <span>{label}</span>}
            </div>
            {id === "tareas" && pendientes > 0 && (
              <span
                className={`nav-badge ${isCollapsed ? "badge-collapsed" : ""}`}
              >
                {pendientes}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-label">Hoy</div>
          <div className="sidebar-footer-date">
            {TODAY.toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
}
