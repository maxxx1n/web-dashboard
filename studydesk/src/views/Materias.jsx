import { Pencil, Trash2, Plus } from "lucide-react";
import { COLORS, COLOR_BG, dark } from "../constants";
import { btnPrimary, badge, iconBtn } from "../styles/shared";

export default function Materias({ materias, tareas, onNew, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5" }}>Materias</h1>
          <p style={{ color: dark.muted, marginTop: 4, fontSize: 14 }}>
            {materias.length} registrada{materias.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-primary" style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6 }} onClick={onNew}>
          <Plus size={16} /> Nueva materia
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
        {materias.map(m => {
          const ci       = m.colorIdx % COLORS.length;
          const hechas   = tareas.filter(t => t.materiaId === m.id && t.estado === "hecha").length;
          const total    = tareas.filter(t => t.materiaId === m.id).length;

          return (
            <div key={m.id} className="card-hover" style={{ background: dark.card, borderRadius: 16, border: `1.5px solid ${dark.border}`, overflow: "hidden" }}>
              <div style={{ height: 5, background: COLORS[ci] }} />
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: COLOR_BG[ci], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: COLORS[ci] }}>
                    {m.nombre[0]}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="icon-btn btn-accent" style={iconBtn("#9d96f0","#2d2b4e")} onClick={() => onEdit(m)} title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button className="icon-btn btn-danger" style={iconBtn("#f87171","#3d1f1f")} onClick={() => onDelete(m.id)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
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
        <div className="add-card" onClick={onNew}
          style={{ borderRadius: 16, border: `2px dashed ${dark.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, cursor: "pointer", minHeight: 150, color: dark.muted, fontSize: 14 }}>
          <Plus size={28} />
          Agregar materia
        </div>
      </div>
    </div>
  );
}