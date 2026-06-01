import { dark, PRIORITY } from "../constants";
import { card, badge } from "../styles/shared";

export default function Stats({ tareas, materias, getMColor, getMNombre }) {
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
    { label: "Completadas", value: hechas, color: "#34d399" },
    { label: "En progreso", value: progreso, color: "#fbbf24" },
    { label: "Pendientes",  value: pendientes, color: "#f87171" },
  ];

  const maxMateria = Math.max(1, ...byMateria.map(m => m.total));
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", color: dark.text }}>Estadísticas</h1>
        <p style={{ color: dark.muted, fontSize: 14 }}>Seguimiento de tu progreso de estudio.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total tareas", value: total, color: dark.text },
          { label: "Completadas",  value: hechas, color: "#34d399" },
          { label: "En progreso",  value: progreso, color: "#fbbf24" },
          { label: "Pendientes",   value: pendientes, color: "#f87171" },
        ].map((item, idx) => (
          <div key={idx} className="metric-card card-hover" style={card}>
            <div style={{ fontSize: 11, color: dark.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: item.color, marginTop: 4 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, alignSelf: "flex-start" }}>Distribución por estado</div>
          <div style={{ position: "relative", width: 180, height: 180 }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} fill="none" stroke={dark.subtle} strokeWidth="16" />
              {statusData.map(({ value, color }, index) => {
                const length = (value / Math.max(total, 1)) * circumference;
                const offset = circumference - accumulated;
                accumulated += length;
                return (
                  <circle
                    key={index}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="16"
                    strokeDasharray={`${length} ${circumference}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />
                );
              })}
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: dark.text }}>{pct}%</div>
              <div style={{ fontSize: 11, color: dark.muted }}>completado</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, width: "100%", marginTop: 22 }}>
            {statusData.map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11, color: dark.muted }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: dark.text }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Por prioridad</div>
          {byPriority.map(({ prioridad, count }) => {
            const pctPriority = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={prioridad} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={badge(PRIORITY[prioridad].bg, PRIORITY[prioridad].color)}>{PRIORITY[prioridad].label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: dark.text }}>
                    {count} <span style={{ color: dark.muted, fontWeight: 400 }}>({pctPriority}%)</span>
                  </span>
                </div>
                <div style={{ background: dark.subtle, borderRadius: 20, height: 10, overflow: "hidden" }}>
                  <div style={{
                    width: `${pctPriority}%`,
                    height: "100%",
                    background: PRIORITY[prioridad].color,
                    borderRadius: 20,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Tareas por materia</div>
          {byMateria.length === 0 && (
            <div style={{ color: dark.muted, fontSize: 13 }}>No hay tareas asociadas a materias todavía.</div>
          )}
          {byMateria.map(m => {
            const completedPct = m.total ? Math.round((m.hechas / m.total) * 100) : 0;
            return (
              <div key={m.id} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: getMColor(m.id) }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: dark.text }}>{m.nombre}</span>
                  </div>
                  <div style={{ fontSize: 12, color: dark.muted }}>
                    {m.hechas}/{m.total} · {completedPct}%
                  </div>
                </div>
                <div style={{ background: dark.subtle, borderRadius: 20, height: 10, overflow: "hidden" }}>
                  <div style={{
                    width: `${completedPct}%`,
                    height: "100%",
                    background: getMColor(m.id),
                    borderRadius: 20,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}