import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { COLORS, COLOR_BG, COLOR_TEXT, DIAS_SEMANA } from "../config/constants";

export default function Horarios({ materias, onAddHorario, onDelHorario }) {
  const [form, setForm] = useState({ dia: "Lunes", inicio: "08:00", fin: "09:00" });

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h1 className="page-title">Horarios de materias</h1>
        <p className="page-subtitle">Administrá los bloques horarios de cada materia.</p>
      </div>

      {materias.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-text">Primero agregá materias desde el panel de Materias.</div>
        </div>
      )}

      {materias.map(m => {
        const ci = m.colorIdx % COLORS.length;
        return (
          <div key={m.id} className="schedule-card">
            <div className="schedule-card-header">
              <div className="schedule-dot" style={{ background: COLORS[ci] }} />
              <span className="schedule-card-name">{m.nombre}</span>
            </div>

            {!(m.horarios?.length) && (
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 14 }}>Sin horarios asignados.</div>
            )}

            <div className="schedule-blocks">
              {(m.horarios || []).map((h, i) => (
                <div key={i} className="schedule-block" style={{ background: COLOR_BG[ci], border: `1px solid ${COLORS[ci]}44` }}>
                  <div>
                    <div className="schedule-block-day" style={{ color: COLORS[ci] }}>{h.dia}</div>
                    <div className="schedule-block-time" style={{ color: COLOR_TEXT[ci] }}>{h.inicio} – {h.fin}</div>
                  </div>
                  <button className="icon-btn btn-danger" style={{ color: "#f87171" }} onClick={() => onDelHorario(m.id, i)} title="Eliminar bloque">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add block form */}
            <div className="add-block-form">
              <div className="add-block-label">Agregar bloque</div>
              <div className="add-block-fields">
                <div className="add-block-field">
                  <label>Día</label>
                  <select className="select" value={form.dia} onChange={e => setForm(f => ({ ...f, dia: e.target.value }))} style={{ width: 130 }}>
                    {DIAS_SEMANA.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="add-block-field">
                  <label>Inicio</label>
                  <input type="time" className="input" value={form.inicio} onChange={e => setForm(f => ({ ...f, inicio: e.target.value }))} style={{ width: 110, marginTop: 0 }} />
                </div>
                <div className="add-block-field">
                  <label>Fin</label>
                  <input type="time" className="input" value={form.fin} onChange={e => setForm(f => ({ ...f, fin: e.target.value }))} style={{ width: 110, marginTop: 0 }} />
                </div>
                <button className="btn-primary" style={{ padding: "10px 16px" }} onClick={() => onAddHorario(m.id, form)}>
                  <Plus size={15} /> Agregar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}