import { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { COLORS, COLOR_BG, COLOR_TEXT, DIAS_SEMANA } from "../config/constants";

function MateriaCard({
  m,
  tareas,
  onEdit,
  onDelete,
  onAddHorario,
  onDelHorario,
}) {
  const [showHorarios, setShowHorarios] = useState(false);
  const [form, setForm] = useState({
    dia: "Lunes",
    inicio: "08:00",
    fin: "09:00",
  });

  const ci = m.colorIdx % COLORS.length;
  const hechas = tareas.filter(
    (t) => t.materiaId === m.id && t.estado === "hecha",
  ).length;
  const total = tareas.filter((t) => t.materiaId === m.id).length;
  const horarios = m.horarios || [];

  return (
    <div
      className="subject-card"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="subject-card-accent" style={{ background: COLORS[ci] }} />
      <div className="subject-card-body" style={{ flex: 1, paddingBottom: 16 }}>
        <div className="subject-card-header">
          <div
            className="subject-card-avatar"
            style={{ background: COLOR_BG[ci], color: COLORS[ci] }}
          >
            {m.nombre[0]}
          </div>
          <div className="subject-card-actions">
            <button
              className="icon-btn btn-accent"
              style={{ color: "#9d96f0", background: "#2d2b4e" }}
              onClick={() => onEdit(m)}
              title="Editar"
            >
              <Pencil size={14} />
            </button>
            <button
              className="icon-btn btn-danger"
              style={{ color: "#f87171", background: "#3d1f1f" }}
              onClick={() => onDelete(m.id)}
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="subject-card-name">{m.nombre}</div>
        <div className="subject-card-desc">
          Profesor: {m.profesor || "Sin asignar"}
        </div>
        <div className="subject-card-badges">
          <span
            className="badge"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-muted)",
            }}
          >
            {total} tareas
          </span>
          <span
            className="badge"
            style={{ background: "#1a3d30", color: "#34d399" }}
          >
            {hechas} hechas
          </span>
        </div>
      </div>

      {/* Sección de Horarios integrados */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "12px 16px",
          background: "var(--bg-surface)",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
          onClick={() => setShowHorarios(!showHorarios)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={14} /> Horarios ({horarios.length})
          </div>
          {showHorarios ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>

        {showHorarios && (
          <div style={{ marginTop: 12 }}>
            {horarios.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Sin horarios asignados.
              </div>
            ) : (
              <div
                className="schedule-blocks"
                style={{ gridTemplateColumns: "1fr", gap: 8, marginBottom: 12 }}
              >
                {horarios.map((h, i) => (
                  <div
                    key={i}
                    className="schedule-block"
                    style={{
                      background: COLOR_BG[ci],
                      border: `1px solid ${COLORS[ci]}44`,
                      padding: "8px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <div
                        className="schedule-block-day"
                        style={{
                          color: COLORS[ci],
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {h.dia}
                      </div>
                      <div
                        className="schedule-block-time"
                        style={{ color: COLOR_TEXT[ci], fontSize: 11 }}
                      >
                        {h.inicio} – {h.fin}
                      </div>
                    </div>
                    <button
                      className="icon-btn btn-danger"
                      style={{ color: "#f87171" }}
                      onClick={() => onDelHorario(m.id, i)}
                      title="Eliminar bloque"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <select
                  className="select"
                  value={form.dia}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dia: e.target.value }))
                  }
                  style={{ width: "100%", fontSize: 11, padding: "6px" }}
                >
                  {DIAS_SEMANA.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="time"
                  className="input"
                  value={form.inicio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inicio: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 0,
                    fontSize: 11,
                    padding: "6px",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="time"
                  className="input"
                  value={form.fin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fin: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    marginTop: 0,
                    fontSize: 11,
                    padding: "6px",
                  }}
                />
              </div>
              <button
                className="btn-primary"
                style={{ height: 32, padding: "0 12px", borderRadius: 8 }}
                onClick={() => {
                  onAddHorario(m.id, form);
                  setForm({ dia: "Lunes", inicio: "08:00", fin: "09:00" });
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Materias({
  materias,
  tareas,
  onNew,
  onEdit,
  onDelete,
  onAddHorario,
  onDelHorario,
}) {
  return (
    <div className="animate-in">
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
        {materias.map((m) => (
          <MateriaCard
            key={m.id}
            m={m}
            tareas={tareas}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddHorario={onAddHorario}
            onDelHorario={onDelHorario}
          />
        ))}

        {/* Add card */}
        <div className="add-card" onClick={onNew}>
          <Plus size={28} />
          Agregar materia
        </div>
      </div>
    </div>
  );
}
