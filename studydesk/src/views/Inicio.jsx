import { dark, PRIORITY, TODAY } from "../constants";
import { card, badge } from "../styles/shared";

export default function Inicio({ tareas, materias, recordatorios, getMNombre, getMBg, getMText, setEstado }) {
  const pendientes = tareas.filter(t => t.estado !== "hecha").length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Buen día 👋</h1>
      <p style={{ color: dark.muted, marginTop: 0, fontSize: 14, marginBottom: 28 }}>
        Resumen de tu semana de estudio.
      </p>

      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Tareas pendientes", value: pendientes, color: "#9d96f0" },
          { label: "Completadas",       value: hechas,     color: "#34d399" },
          { label: "Materias",          value: materias.length, color: "#60a5fa" },
        ].map((c, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: 11, color: dark.muted, textTransform: "uppercase", letterSpacing: 1 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 38, fontWeight: 700, color: c.color, marginTop: 6 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        {/* Tareas recientes */}
        <div style={card}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Tareas recientes</div>
          {tareas.slice(0, 5).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${dark.border}` }}>
              <div
                onClick={() => setEstado(t.id, t.estado === "hecha" ? "pendiente" : "hecha")}
                style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${t.estado === "hecha" ? "#34d399" : dark.borderHover}`, background: t.estado === "hecha" ? "#34d399" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                {t.estado === "hecha" && <span style={{ color: "#0f0f13", fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: t.estado === "hecha" ? dark.muted : dark.text, textDecoration: t.estado === "hecha" ? "line-through" : "none" }}>
                  {t.titulo}
                </div>
                <div style={{ fontSize: 12, color: dark.muted }}>{getMNombre(t.materiaId)}</div>
              </div>
              <span style={badge(PRIORITY[t.prioridad]?.bg, PRIORITY[t.prioridad]?.color)}>
                {PRIORITY[t.prioridad]?.label}
              </span>
            </div>
          ))}
          {tareas.length === 0 && <div style={{ color: dark.muted, fontSize: 13, textAlign: "center", paddingTop: 12 }}>Sin tareas aún</div>}
        </div>

        {/* Recordatorios */}
        <div style={card}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Próximos recordatorios</div>
          {recordatorios.sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 5).map(r => (
            <div key={r.id} style={{ padding: "10px 0", borderBottom: `1px solid ${dark.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{r.titulo}</div>
              <div style={{ fontSize: 12, color: dark.muted }}>{r.fecha}{r.hora ? ` · ${r.hora}` : ""}</div>
              {r.descripcion && <div style={{ fontSize: 12, color: dark.muted, marginTop: 2 }}>{r.descripcion}</div>}
            </div>
          ))}
          {recordatorios.length === 0 && <div style={{ color: dark.muted, fontSize: 13, textAlign: "center" }}>Sin recordatorios</div>}
        </div>
      </div>
    </div>
  );
}
