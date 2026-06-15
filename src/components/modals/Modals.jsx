import { COLORS, STATUS } from "../../config/constants";

/* ── MATERIA ── */
export function MateriaModal({ form, setForm, onSave, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 440 }}>
        <div className="modal-header">{form.id ? "Editar materia" : "Nueva materia"}</div>

        <label className="label">Nombre</label>
        <input className="input" value={form.nombre || ""} placeholder="Ej: Matemáticas"
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} autoFocus />

        <label className="label">Descripción</label>
        <input className="input" value={form.descripcion || ""} placeholder="Ej: Álgebra lineal"
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />

        <label className="label">Color</label>
        <div className="color-picker">
          {COLORS.map((c, i) => (
            <div key={i}
              className={`color-dot${form.colorIdx === i ? " selected" : ""}`}
              style={{ background: c, boxShadow: form.colorIdx === i ? `0 0 14px ${c}88` : "none" }}
              onClick={() => setForm(f => ({ ...f, colorIdx: i }))} />
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ── TAREA ── */
export function TareaModal({ form, setForm, materias, onSave, onClose }) {
  const priorities = [
    { key: "alta",  label: "Alta",  color: "#f87171", bg: "#3d1f1f" },
    { key: "media", label: "Media", color: "#fbbf24", bg: "#3d2e0a" },
    { key: "baja",  label: "Baja",  color: "#34d399", bg: "#1a3d30" },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 440 }}>
        <div className="modal-header">{form.id ? "Editar tarea" : "Nueva tarea"}</div>

        <label className="label">Título</label>
        <input className="input" value={form.titulo || ""} placeholder="Ej: Ejercicios cap. 3"
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus />

        <label className="label">Materia</label>
        <select className="input" value={form.materiaId || ""}
          onChange={e => setForm(f => ({ ...f, materiaId: Number(e.target.value) }))}>
          <option value="">Sin materia</option>
          {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>

        <label className="label">Prioridad</label>
        <div className="priority-picker">
          {priorities.map(({ key, label, color, bg }) => (
            <div key={key}
              className="priority-option"
              style={{
                background: form.prioridad === key ? bg : undefined,
                color: form.prioridad === key ? color : undefined,
                borderColor: form.prioridad === key ? `${color}55` : undefined,
              }}
              onClick={() => setForm(f => ({ ...f, prioridad: key }))}>
              {label}
            </div>
          ))}
        </div>

        <label className="label">Estado</label>
        <select className="input" value={form.estado || "pendiente"}
          onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <label className="label">Fecha límite</label>
        <input type="date" className="input" value={form.fecha || ""}
          onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ── RECORDATORIO ── */
export function RecordatorioModal({ form, setForm, onSave, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 400 }}>
        <div className="modal-header">{form.id ? "Editar recordatorio" : "Nuevo recordatorio"}</div>

        <label className="label">Título</label>
        <input className="input" value={form.titulo || ""} placeholder="Ej: Estudiar para parcial"
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} autoFocus />

        <label className="label">Fecha</label>
        <input type="date" className="input" value={form.fecha || ""}
          onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />

        <label className="label">Hora</label>
        <input type="time" className="input" value={form.hora || ""}
          onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} />

        <label className="label">Descripción (opcional)</label>
        <input className="input" value={form.descripcion || ""} placeholder="Notas adicionales..."
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}