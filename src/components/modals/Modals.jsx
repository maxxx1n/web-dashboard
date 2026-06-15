import { COLORS, dark, STATUS } from "../../config/constants";
import { inputStyle, labelStyle, btnPrimary, btnGhost } from "../../config/theme";

const overlay = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 100,
};

const box = (w = 440) => ({
  background: dark.surface,
  borderRadius: 20,
  padding: "30px 34px",
  width: w,
  border: `1.5px solid ${dark.border}`,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
});

const ModalHeader = ({ title }) => (
  <div style={{ fontWeight: 800, fontSize: 19, marginBottom: 6, color: "#eaeaf5" }}>{title}</div>
);

/* ── MATERIA ── */
export function MateriaModal({ form, setForm, onSave, onClose }) {
  return (
    <div className="modal-overlay" style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={box()}>
        <ModalHeader title={form.id ? "Editar materia" : "Nueva materia"} />
        <label style={labelStyle}>Nombre</label>
        <input style={inputStyle} value={form.nombre || ""} placeholder="Ej: Matemáticas"
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} autoFocus />
        <label style={labelStyle}>Descripción</label>
        <input style={inputStyle} value={form.descripcion || ""} placeholder="Ej: Álgebra lineal"
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        <label style={labelStyle}>Color</label>
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {COLORS.map((c, i) => (
            <div key={i} onClick={() => setForm(f => ({ ...f, colorIdx: i }))}
              style={{ width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer",
                border: form.colorIdx === i ? `3px solid #fff` : "3px solid transparent",
                boxShadow: form.colorIdx === i ? `0 0 12px ${c}88` : "none",
                transition: "all 0.15s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28, gap: 8 }}>
          <button className="btn-ghost" style={btnGhost} onClick={onClose}>Cancelar</button>
          <button className="btn-primary" style={btnPrimary} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ── TAREA ── */
export function TareaModal({ form, setForm, materias, onSave, onClose }) {
  return (
    <div className="modal-overlay" style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={box()}>
        <ModalHeader title={form.id ? "Editar tarea" : "Nueva tarea"} />
        <label style={labelStyle}>Título</label>
        <input style={inputStyle} value={form.titulo || ""} placeholder="Ej: Ejercicios cap. 3"
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus />
        <label style={labelStyle}>Materia</label>
        <select style={inputStyle} value={form.materiaId || ""}
          onChange={e => setForm(f => ({ ...f, materiaId: Number(e.target.value) }))}>
          <option value="">Sin materia</option>
          {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <label style={labelStyle}>Prioridad</label>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[["alta","#f87171","#3d1f1f"],["media","#fbbf24","#3d2e0a"],["baja","#34d399","#1a3d30"]].map(([k,c,bg]) => (
            <div key={k} onClick={() => setForm(f => ({ ...f, prioridad: k }))}
              style={{ flex: 1, padding: "10px 0", textAlign: "center", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13,
                background: form.prioridad === k ? bg : dark.subtle,
                color: form.prioridad === k ? c : dark.muted,
                border: `1.5px solid ${form.prioridad === k ? c + "55" : dark.border}`,
                transition: "all 0.15s" }}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </div>
          ))}
        </div>
        <label style={labelStyle}>Estado</label>
        <select style={inputStyle} value={form.estado || "pendiente"}
          onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label style={labelStyle}>Fecha límite</label>
        <input type="date" style={inputStyle} value={form.fecha || ""}
          onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28, gap: 8 }}>
          <button className="btn-ghost" style={btnGhost} onClick={onClose}>Cancelar</button>
          <button className="btn-primary" style={btnPrimary} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ── RECORDATORIO ── */
export function RecordatorioModal({ form, setForm, onSave, onClose }) {
  return (
    <div className="modal-overlay" style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={box(400)}>
        <ModalHeader title={form.id ? "Editar recordatorio" : "Nuevo recordatorio"} />
        <label style={labelStyle}>Título</label>
        <input style={inputStyle} value={form.titulo || ""} placeholder="Ej: Estudiar para parcial"
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus />
        <label style={labelStyle}>Fecha</label>
        <input type="date" style={inputStyle} value={form.fecha || ""}
          onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
        <label style={labelStyle}>Hora</label>
        <input type="time" style={inputStyle} value={form.hora || ""}
          onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} />
        <label style={labelStyle}>Descripción (opcional)</label>
        <input style={inputStyle} value={form.descripcion || ""} placeholder="Notas adicionales..."
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28, gap: 8 }}>
          <button className="btn-ghost" style={btnGhost} onClick={onClose}>Cancelar</button>
          <button className="btn-primary" style={btnPrimary} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}