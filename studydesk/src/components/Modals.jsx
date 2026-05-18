import { COLORS, dark, DIAS_SEMANA, STATUS } from "../constants";
import { inputStyle, labelStyle, btnPrimary, btnGhost } from "../styles/shared";

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};

const modalBox = {
  background: dark.surface,
  borderRadius: 20,
  padding: "28px 32px",
  width: 420,
  border: `1.5px solid ${dark.border}`,
  maxHeight: "90vh",
  overflowY: "auto",
};

/* ── MATERIA ── */
export function MateriaModal({ form, setForm, onSave, onClose }) {
  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          {form.id ? "Editar materia" : "Nueva materia"}
        </div>

        <label style={labelStyle}>Nombre</label>
        <input style={inputStyle} value={form.nombre || ""} placeholder="Ej: Matemáticas"
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />

        <label style={labelStyle}>Descripción</label>
        <input style={inputStyle} value={form.descripcion || ""} placeholder="Ej: Álgebra lineal"
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />

        <label style={labelStyle}>Color</label>
        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
          {COLORS.map((c, i) => (
            <div key={i} onClick={() => setForm(f => ({ ...f, colorIdx: i }))}
              style={{ width: 26, height: 26, borderRadius: "50%", background: c, cursor: "pointer",
                border: form.colorIdx === i ? `3px solid ${dark.text}` : "3px solid transparent" }} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 8 }}>
          <button style={btnGhost} onClick={onClose}>Cancelar</button>
          <button style={btnPrimary} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ── TAREA ── */
export function TareaModal({ form, setForm, materias, onSave, onClose }) {
  return (
    <div style={overlay}>
      <div style={modalBox}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          {form.id ? "Editar tarea" : "Nueva tarea"}
        </div>

        <label style={labelStyle}>Título</label>
        <input style={inputStyle} value={form.titulo || ""} placeholder="Ej: Ejercicios cap. 3"
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />

        <label style={labelStyle}>Materia</label>
        <select style={inputStyle} value={form.materiaId || ""}
          onChange={e => setForm(f => ({ ...f, materiaId: Number(e.target.value) }))}>
          <option value="">Sin materia</option>
          {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>

        <label style={labelStyle}>Prioridad</label>
        <select style={inputStyle} value={form.prioridad || "media"}
          onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        <label style={labelStyle}>Estado</label>
        <select style={inputStyle} value={form.estado || "pendiente"}
          onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <label style={labelStyle}>Fecha límite</label>
        <input type="date" style={inputStyle} value={form.fecha || ""}
          onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 8 }}>
          <button style={btnGhost} onClick={onClose}>Cancelar</button>
          <button style={btnPrimary} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ── RECORDATORIO ── */
export function RecordatorioModal({ form, setForm, onSave, onClose }) {
  return (
    <div style={overlay}>
      <div style={{ ...modalBox, width: 400 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          {form.id ? "Editar recordatorio" : "Nuevo recordatorio"}
        </div>

        <label style={labelStyle}>Título</label>
        <input style={inputStyle} value={form.titulo || ""} placeholder="Ej: Estudiar para parcial"
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />

        <label style={labelStyle}>Fecha</label>
        <input type="date" style={inputStyle} value={form.fecha || ""}
          onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />

        <label style={labelStyle}>Hora</label>
        <input type="time" style={inputStyle} value={form.hora || ""}
          onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} />

        <label style={labelStyle}>Descripción (opcional)</label>
        <input style={inputStyle} value={form.descripcion || ""} placeholder="Notas adicionales..."
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 8 }}>
          <button style={btnGhost} onClick={onClose}>Cancelar</button>
          <button style={btnPrimary} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
