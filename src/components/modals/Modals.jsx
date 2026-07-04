import { COLORS, STATUS } from "../../config/constants";

/* ── MATERIA ── */
export function MateriaModal({ form, setForm, onSave, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ width: 440 }}>
        <div className="modal-header">
          {form.id ? "Editar materia" : "Nueva materia"}
        </div>

        <label className="label">Nombre</label>
        <input
          className="input"
          value={form.nombre || ""}
          placeholder="Ej: Matemáticas"
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          autoFocus
        />

        <label className="label">Profesor</label>
        <input
          className="input"
          value={form.profesor || ""}
          placeholder="Ej: Matias"
          onChange={(e) => setForm((f) => ({ ...f, profesor: e.target.value }))}
        />

        <label className="label">Año de cursada</label>
        <select
          className="input"
          value={form.year || 1}
          onChange={(e) =>
            setForm((f) => ({ ...f, year: Number(e.target.value) }))
          }
        >
          {[1, 2, 3, 4, 5].map((y) => (
            <option key={y} value={y}>
              {y}° Año
            </option>
          ))}
        </select>

        <label className="label">Color</label>
        <div className="color-picker">
          {COLORS.map((c, i) => (
            <div
              key={i}
              className={`color-dot${form.colorIdx === i ? " selected" : ""}`}
              style={{
                background: c,
                boxShadow: form.colorIdx === i ? `0 0 14px ${c}88` : "none",
              }}
              onClick={() => setForm((f) => ({ ...f, colorIdx: i }))}
            />
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── TAREA ── */
export function TareaModal({ form, setForm, materias, onSave, onClose }) {
  const priorities = [
    { key: "alta", label: "Alta", color: "#f87171", bg: "#3d1f1f" },
    { key: "media", label: "Media", color: "#fbbf24", bg: "#3d2e0a" },
    { key: "baja", label: "Baja", color: "#34d399", bg: "#1a3d30" },
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ width: 440 }}>
        <div className="modal-header">
          {form.id ? "Editar tarea" : "Nueva tarea"}
        </div>

        <label className="label">Título</label>
        <input
          className="input"
          value={form.titulo || ""}
          placeholder="Ej: Ejercicios cap. 3"
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          autoFocus
        />

        <label className="label">Materia</label>
        <select
          className="input"
          value={form.materiaId || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, materiaId: Number(e.target.value) }))
          }
        >
          <option value="">Sin materia</option>
          {materias
            .slice()
            .sort((a, b) => (b.year || 1) - (a.year || 1))
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.year || 1}° Año)
              </option>
            ))}
        </select>

        <label className="label">Prioridad</label>
        <div className="priority-picker">
          {priorities.map(({ key, label, color, bg }) => (
            <div
              key={key}
              className="priority-option"
              style={{
                background: form.prioridad === key ? bg : undefined,
                color: form.prioridad === key ? color : undefined,
                borderColor: form.prioridad === key ? `${color}55` : undefined,
              }}
              onClick={() => setForm((f) => ({ ...f, prioridad: key }))}
            >
              {label}
            </div>
          ))}
        </div>

        <label className="label">Estado</label>
        <select
          className="input"
          value={form.estado || "pendiente"}
          onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
        >
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <label className="label">Fecha límite</label>
        <input
          type="date"
          className="input"
          value={form.fecha || ""}
          onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
        />

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── RECORDATORIO ── */
export function RecordatorioModal({ form, setForm, onSave, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ width: 400 }}>
        <div className="modal-header">
          {form.id ? "Editar recordatorio" : "Nuevo recordatorio"}
        </div>

        <label className="label">Título</label>
        <input
          className="input"
          value={form.titulo || ""}
          placeholder="Ej: Estudiar para parcial"
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          autoFocus
        />

        <label className="label">Fecha</label>
        <input
          type="date"
          className="input"
          value={form.fecha || ""}
          onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
        />

        <label className="label">Hora</label>
        <input
          type="time"
          className="input"
          value={form.hora || ""}
          onChange={(e) => setForm((f) => ({ ...f, hora: e.target.value }))}
        />

        <label className="label">Nota (opcional)</label>
        <input
          className="input"
          value={form.nota || ""}
          placeholder="Notas adicionales..."
          onChange={(e) => setForm((f) => ({ ...f, nota: e.target.value }))}
        />

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── CONFIRMACIÓN ── */
export function ConfirmModal({ confirmAction, onClose }) {
  if (!confirmAction) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-box"
        style={{ maxWidth: "400px", textAlign: "center", padding: "32px 24px" }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "var(--warning-bg, #3d2e0a)",
            color: "var(--warning, #fbbf24)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2
          className="modal-header"
          style={{ fontSize: "18px", marginBottom: "8px" }}
        >
          {confirmAction.title || "Confirmar Acción"}
        </h2>
        <p
          style={{
            color: "var(--text-secondary, #a1a1aa)",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "24px",
            whiteSpace: "pre-wrap",
          }}
        >
          {confirmAction.message}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {!confirmAction.isAlert && (
            <button className="btn-ghost" onClick={onClose}>
              Cancelar
            </button>
          )}
          <button
            className="btn-primary"
            style={{
              background: confirmAction.isDanger
                ? "var(--danger, #ef4444)"
                : "var(--accent)",
              color: "#fff",
            }}
            onClick={() => {
              onClose();
              if (confirmAction.onConfirm) confirmAction.onConfirm();
            }}
          >
            {confirmAction.isAlert ? "Aceptar" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
