import { dark, PRIORITY, TODAY, todayStr } from "../constants";
import { card, badge, btnPrimary } from "../styles/shared";

export default function Inicio({ tareas, materias, recordatorios, getMNombre, getMBg, getMText, setEstado, openTarea }) {
  const pendientes = tareas.filter(t => t.estado !== "hecha").length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;
  const hoy        = tareas.filter(t => t.fecha === todayStr && t.estado !== "hecha");
  const pct        = tareas.length ? Math.round((hechas / tareas.length) * 100) : 0;

  const hora = TODAY.getHours();
  const saludo = hora < 12 ? "Buenos días Max" : hora < 19 ? "Buenas tardes Max" : "Buenas noches Max";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: dark.muted, marginBottom: 4 }}>
            {TODAY.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: dark.text, letterSpacing: "-0.5px" }}>
            {saludo} 👋
          </h1>
          <p style={{ color: dark.muted, marginTop: 6, fontSize: 14 }}>
            Tenés <strong style={{ color: dark.accent }}>{pendientes}</strong> tarea{pendientes !== 1 ? "s" : ""} pendiente{pendientes !== 1 ? "s" : ""}.
            {hoy.length > 0 && <> <strong style={{ color: "#f87171" }}>{hoy.length}</strong> vence{hoy.length !== 1 ? "n" : ""} hoy.</>}
          </p>
        </div>
        <button className="btn-primary" style={btnPrimary} onClick={openTarea}>+ Nueva tarea</button>
      </div>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Pendientes", value: pendientes,      color: "#9d96f0", icon: "◎", bg: "#2d2b4e" },
          { label: "En progreso",value: tareas.filter(t => t.estado === "progreso").length, color: "#fbbf24", icon: "⟳", bg: "#3d2e0a" },
          { label: "Completadas",value: hechas,          color: "#34d399", icon: "✓", bg: "#1a3d30" },
          { label: "Materias",   value: materias.length, color: "#60a5fa", icon: "◈", bg: "#1a2d4e" },
        ].map((c, i) => (
          <div key={i} className="metric-card card-hover" style={{ ...card, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.06, color: c.color }}>{c.icon}</div>
            <div style={{ fontSize: 11, color: dark.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: c.color, marginTop: 6, lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Progreso global */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Progreso general</span>
          <span style={{ fontWeight: 700, color: dark.accent, fontSize: 14 }}>{pct}%</span>
        </div>
        <div style={{ background: dark.subtle, borderRadius: 20, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#9d96f0,#34d399)", borderRadius: 20, transition: "width 0.6s ease" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Tareas recientes */}
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <span>Tareas recientes</span>
            <span style={{ fontSize: 12, color: dark.muted, fontWeight: 400 }}>{tareas.length} total</span>
          </div>
          {tareas.slice(0, 6).map(t => (
            <div key={t.id} className="task-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, marginBottom: 2 }}>
              <div className="check-btn" onClick={() => setEstado(t.id, t.estado === "hecha" ? "pendiente" : "hecha")}
                style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.estado === "hecha" ? "#34d399" : dark.borderHover}`, background: t.estado === "hecha" ? "#34d399" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {t.estado === "hecha" && <span style={{ color: "#0c0c10", fontSize: 11, fontWeight: 800 }}>✓</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.estado === "hecha" ? dark.muted : dark.text, textDecoration: t.estado === "hecha" ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.titulo}</div>
                <div style={{ fontSize: 11, color: dark.muted, marginTop: 2 }}>{getMNombre(t.materiaId)}</div>
              </div>
              <span style={badge(PRIORITY[t.prioridad]?.bg, PRIORITY[t.prioridad]?.color)}>{PRIORITY[t.prioridad]?.label}</span>
            </div>
          ))}
          {!tareas.length && <div style={{ color: dark.muted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Sin tareas aún</div>}
        </div>

        {/* Recordatorios + materias */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Próximos recordatorios</div>
            {recordatorios.sort((a,b) => a.fecha.localeCompare(b.fecha)).slice(0, 3).map(r => (
              <div key={r.id} style={{ padding: "8px 0", borderBottom: `1px solid ${dark.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>🔔 {r.titulo}</div>
                <div style={{ fontSize: 11, color: dark.muted, marginTop: 2 }}>{r.fecha}{r.hora ? ` · ${r.hora}` : ""}</div>
              </div>
            ))}
            {!recordatorios.length && <div style={{ color: dark.muted, fontSize: 13 }}>Sin recordatorios</div>}
          </div>
          <div style={card}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Materias</div>
            {materias.slice(0, 4).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${dark.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["#9d96f0","#34d399","#f87171","#60a5fa"][m.colorIdx % 4], flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.nombre}</div>
                <span style={{ fontSize: 11, color: dark.muted }}>{tareas.filter(t => t.materiaId === m.id && t.estado !== "hecha").length} pend.</span>
              </div>
            ))}
            {!materias.length && <div style={{ color: dark.muted, fontSize: 13 }}>Sin materias</div>}
          </div>
        </div>
      </div>
    </div>
  );
}