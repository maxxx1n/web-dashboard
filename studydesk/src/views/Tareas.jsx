import { Pencil, Trash2, Plus, Play, CheckCheck } from "lucide-react";
import { dark, PRIORITY, STATUS } from "../constants";
import { btnPrimary, badge, iconBtn } from "../styles/shared";

export default function Tareas({ tareas, materias, getMNombre, getMBg, getMText, setEstado, onNew, onEdit, onDelete }) {
  const pendientes = tareas.filter(t => t.estado !== "hecha").length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5" }}>Tareas</h1>
          <p style={{ color: dark.muted, fontSize: 14, marginTop: 4 }}>
            {pendientes} pendientes · {hechas} completadas
          </p>
        </div>
        <button className="btn-primary" style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6 }} onClick={onNew}>
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      {["pendiente", "progreso", "hecha"].map(estado => {
        const grupo = tareas.filter(t => t.estado === estado);
        if (!grupo.length) return null;
        return (
          <div key={estado} style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              {STATUS[estado]} ({grupo.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {grupo.map(t => (
                <div key={t.id} className="task-row" style={{ background: dark.card, borderRadius: 12, border: `1.5px solid ${dark.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, borderRadius: 12 }}>
                  {/* Checkbox */}
                  <div className="check-btn"
                    onClick={() => setEstado(t.id, t.estado === "hecha" ? "pendiente" : "hecha")}
                    style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.estado === "hecha" ? "#34d399" : dark.borderHover}`, background: t.estado === "hecha" ? "#34d399" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {t.estado === "hecha" && <span style={{ color: "#0c0c10", fontSize: 11, fontWeight: 800 }}>✓</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: t.estado === "hecha" ? dark.muted : dark.text, textDecoration: t.estado === "hecha" ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.titulo}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
                      <span style={badge(getMBg(t.materiaId), getMText(t.materiaId))}>{getMNombre(t.materiaId)}</span>
                      <span style={badge(PRIORITY[t.prioridad]?.bg, PRIORITY[t.prioridad]?.color)}>{PRIORITY[t.prioridad]?.label}</span>
                      {t.fecha && <span style={{ fontSize: 11, color: dark.muted }}>📅 {t.fecha}</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {t.estado === "pendiente" && (
                      <button className="icon-btn btn-accent" style={{ ...iconBtn("#9d96f0","#2d2b4e"), display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "5px 10px" }}
                        onClick={() => setEstado(t.id, "progreso")} title="Iniciar">
                        <Play size={12} /> Iniciar
                      </button>
                    )}
                    {t.estado === "progreso" && (
                      <button className="icon-btn btn-success" style={{ ...iconBtn("#34d399","#1a3d30"), display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "5px 10px" }}
                        onClick={() => setEstado(t.id, "hecha")} title="Completar">
                        <CheckCheck size={12} /> Completar
                      </button>
                    )}
                    <button className="icon-btn btn-accent" style={iconBtn("#9d96f0","#2d2b4e")} onClick={() => onEdit(t)} title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button className="icon-btn btn-danger" style={iconBtn("#f87171","#3d1f1f")} onClick={() => onDelete(t.id)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {tareas.length === 0 && (
        <div style={{ textAlign: "center", color: dark.muted, marginTop: 60 }}>
          No hay tareas aún. ¡Agregá tu primera!
        </div>
      )}
    </div>
  );
}