import { PRIORITY } from "../config/constants";

export default function Stats({ tareas, materias, getMColor }) {
  const total      = tareas.length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;
  const progreso   = tareas.filter(t => t.estado === "progreso").length;
  const pendientes = tareas.filter(t => t.estado === "pendiente").length;
  const pct        = total ? Math.round((hechas / total) * 100) : 0;

  const byMateria = materias
    .map(m => ({
      ...m,
      total:      tareas.filter(t => t.materiaId === m.id).length,
      hechas:     tareas.filter(t => t.materiaId === m.id && t.estado === "hecha").length,
      pendientes: tareas.filter(t => t.materiaId === m.id && t.estado !== "hecha").length,
    }))
    .filter(m => m.total > 0)
    .sort((a, b) => b.total - a.total);

  const byPriority = ["alta", "media", "baja"].map(p => ({
    prioridad: p,
    count:     tareas.filter(t => t.prioridad === p).length,
  }));

  const statusData = [
    { label: "Completadas", value: hechas,     color: "#34d399" },
    { label: "En progreso", value: progreso,   color: "#fbbf24" },
    { label: "Pendientes",  value: pendientes, color: "#f87171" },
  ];

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Estadísticas</h1>
        <p className="page-subtitle">Seguimiento de tu progreso de estudio.</p>
      </div>

      {/* Summary metrics */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total tareas", value: total,      color: "var(--text)" },
          { label: "Completadas",  value: hechas,     color: "#34d399" },
          { label: "En progreso",  value: progreso,   color: "#fbbf24" },
          { label: "Pendientes",   value: pendientes, color: "#f87171" },
        ].map((item, idx) => (
          <div key={idx} className="card card-hover metric-card">
            <div className="metric-card-label">{item.label}</div>
            <div className="metric-card-value" style={{ color: item.color, fontSize: 38 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Donut chart */}
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="section-title" style={{ alignSelf: "flex-start", marginBottom: 20 }}>Distribución por estado</div>
          <div className="stat-donut-wrap">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--bg-elevated)" strokeWidth="16" />
              {statusData.map(({ value, color }, index) => {
                const length = (value / Math.max(total, 1)) * circumference;
                const offset = circumference - accumulated;
                accumulated += length;
                return (
                  <circle key={index} cx="90" cy="90" r={radius} fill="none"
                    stroke={color} strokeWidth="16"
                    strokeDasharray={`${length} ${circumference}`}
                    strokeDashoffset={offset} strokeLinecap="round"
                    transform="rotate(-90 90 90)" />
                );
              })}
            </svg>
            <div className="stat-donut-center">
              <div className="stat-donut-pct">{pct}%</div>
              <div className="stat-donut-label">completado</div>
            </div>
          </div>
          <div className="stat-legend">
            {statusData.map(item => (
              <div key={item.label} className="stat-legend-item">
                <div className="stat-legend-dot" style={{ background: item.color }} />
                <div className="stat-legend-label">{item.label}</div>
                <div className="stat-legend-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>Por prioridad</div>
          {byPriority.map(({ prioridad, count }) => {
            const pctPriority = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={prioridad} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="badge" style={{ background: PRIORITY[prioridad].bg, color: PRIORITY[prioridad].color }}>
                    {PRIORITY[prioridad].label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    {count} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({pctPriority}%)</span>
                  </span>
                </div>
                <div className="progress-track" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: `${pctPriority}%`, background: PRIORITY[prioridad].color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-subject breakdown */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 20 }}>Tareas por materia</div>
        {byMateria.length === 0 && (
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No hay tareas asociadas a materias todavía.</div>
        )}
        {byMateria.map(m => {
          const completedPct = m.total ? Math.round((m.hechas / m.total) * 100) : 0;
          return (
            <div key={m.id} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: getMColor(m.id) }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.nombre}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {m.hechas}/{m.total} · {completedPct}%
                </div>
              </div>
              <div className="progress-track" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: `${completedPct}%`, background: getMColor(m.id) }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}