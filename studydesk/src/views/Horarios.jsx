import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { COLORS, COLOR_BG, COLOR_TEXT, DIAS_SEMANA, dark } from "../constants";
import { inputStyle, btnPrimary, iconBtn } from "../styles/shared";

export default function Horarios({ materias, onAddHorario, onDelHorario }) {
  const [form, setForm] = useState({ dia: "Lunes", inicio: "08:00", fin: "09:00" });

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5" }}>Horarios de materias</h1>
        <p style={{ color: dark.muted, fontSize: 14, marginTop: 4 }}>Administrá los bloques horarios de cada materia.</p>
      </div>

      {materias.length === 0 && (
        <div style={{ color: dark.muted, textAlign: "center", marginTop: 60 }}>
          Primero agregá materias desde el panel de Materias.
        </div>
      )}

      {materias.map(m => {
        const ci = m.colorIdx % COLORS.length;
        return (
          <div key={m.id} style={{ background: dark.card, borderRadius: 16, border: `1.5px solid ${dark.border}`, padding: "20px 22px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS[ci] }} />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{m.nombre}</span>
            </div>

            {!(m.horarios?.length) && (
              <div style={{ color: dark.muted, fontSize: 13, marginBottom: 14 }}>Sin horarios asignados.</div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {(m.horarios || []).map((h, i) => (
                <div key={i} style={{ background: COLOR_BG[ci], border: `1px solid ${COLORS[ci]}44`, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS[ci] }}>{h.dia}</div>
                    <div style={{ fontSize: 12, color: COLOR_TEXT[ci] }}>{h.inicio} – {h.fin}</div>
                  </div>
                  <button className="icon-btn btn-danger" style={iconBtn("#f87171","transparent")} onClick={() => onDelHorario(m.id, i)} title="Eliminar bloque">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Formulario de nuevo bloque */}
            <div style={{ background: dark.subtle, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Agregar bloque
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, color: dark.muted, marginBottom: 4 }}>Día</div>
                  <select value={form.dia} onChange={e => setForm(f => ({ ...f, dia: e.target.value }))}
                    style={{ ...inputStyle, width: 130, marginTop: 0 }}>
                    {DIAS_SEMANA.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: dark.muted, marginBottom: 4 }}>Inicio</div>
                  <input type="time" value={form.inicio} onChange={e => setForm(f => ({ ...f, inicio: e.target.value }))}
                    style={{ ...inputStyle, width: 110, marginTop: 0 }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: dark.muted, marginBottom: 4 }}>Fin</div>
                  <input type="time" value={form.fin} onChange={e => setForm(f => ({ ...f, fin: e.target.value }))}
                    style={{ ...inputStyle, width: 110, marginTop: 0 }} />
                </div>
                <button className="btn-primary" style={{ ...btnPrimary, padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}
                  onClick={() => onAddHorario(m.id, form)}>
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