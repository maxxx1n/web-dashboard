import { PRIORITY } from "../config/constants";
import { TODAY, todayStr } from "../utils/helpers";
import { useState } from "react";

export default function Inicio({ tareas, materias, recordatorios, getMNombre, getMBg, getMText, setEstado, user, goToProfile, goToAdmin, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pendientes = tareas.filter(t => t.estado !== "hecha").length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;
  const hoy        = tareas.filter(t => t.fecha === todayStr && t.estado !== "hecha");
  const pct        = tareas.length ? Math.round((hechas / tareas.length) * 100) : 0;

  const now = new Date();
  const hora = now.getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="welcome-date">
            {now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <h1 className="welcome-title">{saludo} {user?.name?.split(" ")[0] || "Usuario"}</h1>
          <p className="welcome-summary">
            Tenés <strong style={{ color: "var(--accent)" }}>{pendientes}</strong> tarea{pendientes !== 1 ? "s" : ""} pendiente{pendientes !== 1 ? "s" : ""}.
            {hoy.length > 0 && <> <strong style={{ color: "var(--danger)" }}>{hoy.length}</strong> vence{hoy.length !== 1 ? "n" : ""} hoy.</>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.name?.split(" ")[0] || "Usuario"}</span>
            <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.rol || "Administrador"}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div 
              className="profile-fab" 
              style={{ position: 'relative', bottom: 'auto', right: 'auto', margin: 0, zIndex: 1 }}
              onClick={() => setMenuOpen(!menuOpen)}
              title="Mi Perfil"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {menuOpen && (
              <div className="profile-dropdown">
                {user?.rol === "Administrador" && (
                  <button className="dropdown-item" onClick={goToAdmin}>Administración</button>
                )}
                <button className="dropdown-item" onClick={goToProfile}>Mi Perfil</button>
                <button className="dropdown-item danger" onClick={logout}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: "Pendientes",  value: pendientes,      color: "#9d96f0", icon: "◎", bg: "#2d2b4e" },
          { label: "En progreso", value: tareas.filter(t => t.estado === "progreso").length, color: "#fbbf24", icon: "⟳", bg: "#3d2e0a" },
          { label: "Completadas", value: hechas,           color: "#34d399", icon: "✓", bg: "#1a3d30" },
          { label: "Materias",    value: materias.length,  color: "#60a5fa", icon: "◈", bg: "#1a2d4e" },
        ].map((c, i) => (
          <div key={i} className="card card-hover metric-card">
            <div className="metric-card-icon" style={{ color: c.color }}>{c.icon}</div>
            <div className="metric-card-label">{c.label}</div>
            <div className="metric-card-value" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Progreso global */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Progreso general</span>
          <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: 14 }}>{pct}%</span>
        </div>
        <div className="progress-track" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#9d96f0,#34d399)" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Tareas recientes */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <span>Tareas recientes</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>{tareas.length} total</span>
          </div>
          {tareas.slice(0, 6).map(t => (
            <div key={t.id} className="task-inline">
              <div
                className={`check-btn ${t.estado === "hecha" ? "checked" : ""}`}
                onClick={() => setEstado(t.id, t.estado === "hecha" ? "pendiente" : "hecha")}>
                {t.estado === "hecha" && <span style={{ color: "#0c0c10", fontSize: 11, fontWeight: 800 }}>✓</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={`task-title ${t.estado === "hecha" ? "done" : ""}`}>{t.titulo}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{getMNombre(t.materiaId)}</div>
              </div>
              <span className="badge" style={{ background: PRIORITY[t.prioridad]?.bg, color: PRIORITY[t.prioridad]?.color }}>
                {PRIORITY[t.prioridad]?.label}
              </span>
            </div>
          ))}
          {!tareas.length && <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Sin tareas aún</div>}
        </div>

        {/* Recordatorios + materias */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="section-title">Próximos recordatorios</div>
            {recordatorios.sort((a,b) => a.fecha.localeCompare(b.fecha)).slice(0, 3).map(r => (
              <div key={r.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>🔔 {r.titulo}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{r.fecha}{r.hora ? ` · ${r.hora}` : ""}</div>
              </div>
            ))}
            {!recordatorios.length && <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Sin recordatorios</div>}
          </div>
          <div className="card">
            <div className="section-title">Materias</div>
            {materias.slice(0, 4).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["#9d96f0","#34d399","#f87171","#60a5fa"][m.colorIdx % 4], flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.nombre}</div>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{tareas.filter(t => t.materiaId === m.id && t.estado !== "hecha").length} pend.</span>
              </div>
            ))}
            {!materias.length && <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Sin materias</div>}
          </div>
        </div>
      </div>
    </div>
  );
}