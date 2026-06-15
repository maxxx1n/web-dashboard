import { Pencil, Trash2, Plus } from "lucide-react";
import { COLORS, COLOR_BG } from "../config/constants";

export default function Materias({ materias, tareas, onNew, onEdit, onDelete }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Materias</h1>
          <p className="page-subtitle">
            {materias.length} registrada{materias.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-primary" onClick={onNew}>
          <Plus size={16} /> Nueva materia
        </button>
      </div>

      <div className="grid-auto">
        {materias.map(m => {
          const ci     = m.colorIdx % COLORS.length;
          const hechas = tareas.filter(t => t.materiaId === m.id && t.estado === "hecha").length;
          const total  = tareas.filter(t => t.materiaId === m.id).length;

          return (
            <div key={m.id} className="subject-card">
              <div className="subject-card-accent" style={{ background: COLORS[ci] }} />
              <div className="subject-card-body">
                <div className="subject-card-header">
                  <div className="subject-card-avatar" style={{ background: COLOR_BG[ci], color: COLORS[ci] }}>
                    {m.nombre[0]}
                  </div>
                  <div className="subject-card-actions">
                    <button className="icon-btn btn-accent" style={{ color: "#9d96f0", background: "#2d2b4e" }} onClick={() => onEdit(m)} title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button className="icon-btn btn-danger" style={{ color: "#f87171", background: "#3d1f1f" }} onClick={() => onDelete(m.id)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="subject-card-name">{m.nombre}</div>
                <div className="subject-card-desc">Profesor: {m.profesor || "Sin asignar"}</div>
                <div className="subject-card-badges">
                  <span className="badge" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>{total} tareas</span>
                  <span className="badge" style={{ background: "#1a3d30", color: "#34d399" }}>{hechas} hechas</span>
                  <span className="badge" style={{ background: "#2d2b4e", color: "#9d96f0" }}>{(m.horarios || []).length} horarios</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <div className="add-card" onClick={onNew}>
          <Plus size={28} />
          Agregar materia
        </div>
      </div>
    </div>
  );
}