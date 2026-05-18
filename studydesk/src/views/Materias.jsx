import { COLORS, COLOR_BG, COLOR_TEXT, dark } from "../constants";
import { btnPrimary, badge, iconBtn } from "../styles/shared";

export default function Materias({ materias, tareas, onNew, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Materias</h1>
          <p style={{ color: dark.muted, marginTop: 4, fontSize: 14 }}>
            {materias.length} registrada{materias.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button style={btnPrimary} onClick={onNew}>+ Nueva materia</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
        {materias.map(m => {
          const ci = m.colorIdx % COLORS.length;
          const pendientes = tareas.filter(t => t.materiaId === m.id && t.estado !== "hecha").length;
          const hechas     = tareas.filter(t => t.materiaId === m.id && t.estado === "hecha").length;
          const total      = tareas.filter(t => t.materiaId === m.id).length;

          return (
            <div key={m.id} style={{ background: dark.card, borderRadius: 16, border: `1.5px solid ${dark.border}`, overflow: "hidden" }}>
              <div style={{ height: 5, background: COLORS[ci] }} />
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: COLOR_BG[ci], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: COLORS[ci] }}>
                    {m.nombre[0]}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={iconBtn(dark.muted)} onClick={() => onEdit(m)}>✎</button>
                    <button style={iconBtn("#f87171")} onClick={() => onDelete(m.id)}>✕</button>
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, marginTop: 12 }}>{m.nombre}</div>
                <div style={{ fontSize: 13, color: dark.muted, marginTop: 3 }}>{m.descripcion || "Sin descripción"}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={badge(dark.subtle, dark.muted)}>{total} tareas</span>
                  <span style={badge("#1a3d30", "#34d399")}>{hechas} hechas</span>
                  <span style={badge("#2d2b4e", "#9d96f0")}>{(m.horarios || []).length} horarios</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Tarjeta agregar */}
        <div onClick={onNew} style={{ borderRadius: 16, border: `2px dashed ${dark.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, cursor: "pointer", minHeight: 150, color: dark.muted, fontSize: 14 }}>
          <span style={{ fontSize: 28 }}>+</span> Agregar materia
        </div>
      </div>
    </div>
  );
}
