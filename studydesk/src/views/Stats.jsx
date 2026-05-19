import { dark, PRIORITY } from "../constants";
import { card, badge } from "../styles/shared";

export default function Stats({ tareas, materias, getMColor, getMNombre }) {
  const total     = tareas.length;
  const hechas    = tareas.filter(t => t.estado === "hecha").length;
  const progreso  = tareas.filter(t => t.estado === "progreso").length;
  const pendientes= tareas.filter(t => t.estado === "pendiente").length;
  const pct       = total ? Math.round((hechas / total) * 100) : 0;

  const byMateria = materias.map(m => ({
    ...m,
    total:    tareas.filter(t => t.materiaId === m.id).length,
    hechas:   tareas.filter(t => t.materiaId === m.id && t.estado === "hecha").length,
    pendientes: tareas.filter(t => t.materiaId === m.id && t.estado !== "hecha").length,
  })).filter(m => m.total > 0).sort((a, b) => b.total - a.total);

  const byPriority = ["alta","media","baja"].map(p => ({
    p, count: tareas.filter(t => t.prioridad === p).length
  }));

  const maxMat = Math.max(...byMateria.map(m => m.total), 1);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", color: dark.text }}>Estadísticas</h1>
        <p style={{ color: dark.muted, fontSize: 14 }}>Seguimiento de tu progreso de estudio.</p>
      </div>

      {/* Resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total tareas",  value: total,     color: dark.text },
          { label: "Completadas",   value: hechas,    color: "#34d399" },
          { label: "En progreso",   value: progreso,  color: "#fbbf24" },
          { label: "Pendientes",    value: pendientes, color: "#f87171" },
        ].map((s, i) => (
          <div key={i} className="metric-card card-hover" style={card}>
            <div style={{ fontSize: 11, color: dark.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Progreso circular */}
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, alignSelf: "flex-start" }}>Tasa de completado</div>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            {(() => {
              const r = 64, circ = 2 * Math.PI * r;
              return (
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r={r} fill="none" stroke={dark.subtle} strokeWidth="12" />
                  <circle cx="80" cy="80" r={r} fill="none" stroke="url(#grad)" strokeWidth="12"
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - pct/100)}
                    strokeLinecap="round" transform="rotate(-90 80 80)"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }} />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9d96f0" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
              );
            })()}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: dark.text }}>{pct}%</div>
              <div style={{ fontSize: 11, color: dark.muted }}>completado</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            {[["Hechas","#34d399",hechas],["Resto","#2a2a38",total-hechas]].map(([l,c,v]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, margin: "0 auto 4px" }} />
                <div style={{ fontSize: 11, color: dark.muted }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: dark.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Por prioridad */}
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Por prioridad</div>
          {byPriority.map(({ p, count }) => {
            const pct2 = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={p} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <span style={badge(PRIORITY[p].bg, PRIORITY[p].color)}>{PRIORITY[p].label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: dark.text }}>{count} <span style={{ color: dark.muted, fontWeight: 400 }}>({pct2}%)</span></span>
                </div>
                <div style={{ background: dark.subtle, borderRadius: 20, height: 7 }}>
                  <div style={{ width: `${pct2}%`, height: "100%", background: PRIORITY[p].color, borderRadius: 20, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Por materia */}
      <div style={card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Por materia</div>
        {byMateria.length === 0 && <div style={{ color: dark.muted, fontSize: 13 }}>Sin datos aún.</div>}
        {byMateria.map(m => {
          const pctM = m.total ? Math.round((m.hechas / m.total) * 100) : 0;
          const color = getMColor(m.id);
          return (
            <div key={m.id} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: dark.text }}>{m.nombre}</span>
                </div>
                <div style={{ fontSize: 12, color: dark.muted }}>
                  <span style={{ color: "#34d399", fontWeight: 700 }}>{m.hechas}</span>/{m.total} · {pctM}%
                </div>
              </div>
              <div style={{ background: dark.subtle, borderRadius: 20, height: 7 }}>
                <div style={{ width: `${(m.total/maxMat)*100}%`, height: "100%", background: dark.border, borderRadius: 20, position: "relative" }}>
                  <div style={{ width: `${pctM}%`, height: "100%", background: color, borderRadius: 20, transition: "width 0.6s ease" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}