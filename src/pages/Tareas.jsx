import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Play, CheckCheck, Filter, X } from "lucide-react";
import { PRIORITY, STATUS } from "../config/constants";

export default function Tareas({ tareas, materias, getMNombre, getMBg, getMText, setEstado, onNew, onEdit, onDelete }) {
  const [filtroMateria,   setFiltroMateria]   = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [filtroEstado,    setFiltroEstado]    = useState("");
  const [busqueda,        setBusqueda]        = useState("");
  const [filtrosOpen,     setFiltrosOpen]     = useState(false);

  const pendientes = tareas.filter(t => t.estado !== "hecha").length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;

  const tareasFiltradas = useMemo(() => {
    return tareas.filter(t => {
      if (filtroMateria   && String(t.materiaId) !== filtroMateria)    return false;
      if (filtroPrioridad && t.prioridad !== filtroPrioridad)          return false;
      if (filtroEstado    && t.estado    !== filtroEstado)             return false;
      if (busqueda && !t.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    });
  }, [tareas, filtroMateria, filtroPrioridad, filtroEstado, busqueda]);

  const hayFiltros = filtroMateria || filtroPrioridad || filtroEstado || busqueda;
  const limpiarFiltros = () => { setFiltroMateria(""); setFiltroPrioridad(""); setFiltroEstado(""); setBusqueda(""); };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tareas</h1>
          <p className="page-subtitle">
            {pendientes} pendientes · {hechas} completadas
            {hayFiltros && <span style={{ color: "var(--accent)", marginLeft: 8 }}>· {tareasFiltradas.length} resultado{tareasFiltradas.length !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`btn-filter ${filtrosOpen || hayFiltros ? "active" : ""}`}
            onClick={() => setFiltrosOpen(o => !o)}>
            <Filter size={14} />
            Filtros
            {hayFiltros && (
              <span className="filter-count">
                {[filtroMateria, filtroPrioridad, filtroEstado, busqueda].filter(Boolean).length}
              </span>
            )}
          </button>
          <button className="btn-primary" onClick={onNew}>
            <Plus size={16} /> Nueva tarea
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {filtrosOpen && (
        <div className="filter-panel">
          <div className="filter-group" style={{ flex: "1 1 180px" }}>
            <div className="filter-label">Buscar</div>
            <input className="input" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Nombre de tarea..." style={{ marginTop: 0 }} />
          </div>
          <div className="filter-group">
            <div className="filter-label">Materia</div>
            <select className="select" value={filtroMateria} onChange={e => setFiltroMateria(e.target.value)} style={{ width: "100%" }}>
              <option value="">Todas</option>
              {materias.map(m => <option key={m.id} value={String(m.id)}>{m.nombre}</option>)}
            </select>
          </div>
          <div className="filter-group" style={{ flex: "1 1 130px" }}>
            <div className="filter-label">Prioridad</div>
            <select className="select" value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} style={{ width: "100%" }}>
              <option value="">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div className="filter-group" style={{ flex: "1 1 130px" }}>
            <div className="filter-label">Estado</div>
            <select className="select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ width: "100%" }}>
              <option value="">Todos</option>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {hayFiltros && (
            <button className="icon-btn btn-danger" onClick={limpiarFiltros}
              style={{ background: "#3d1f1f", color: "#f87171", borderRadius: 8, padding: "8px 14px", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 5, alignSelf: "flex-end" }}>
              <X size={13} /> Limpiar
            </button>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {hayFiltros && (
        <div className="filter-chips">
          {busqueda && (
            <div className="filter-chip" style={{ background: "#2d2b4e", color: "#9d96f0" }}>
              "{busqueda}"
              <X size={11} className="filter-chip-close" onClick={() => setBusqueda("")} />
            </div>
          )}
          {filtroMateria && (
            <div className="filter-chip" style={{ background: "#2d2b4e", color: "#9d96f0" }}>
              {materias.find(m => String(m.id) === filtroMateria)?.nombre}
              <X size={11} className="filter-chip-close" onClick={() => setFiltroMateria("")} />
            </div>
          )}
          {filtroPrioridad && (
            <div className="filter-chip" style={{ background: PRIORITY[filtroPrioridad].bg, color: PRIORITY[filtroPrioridad].color }}>
              {PRIORITY[filtroPrioridad].label}
              <X size={11} className="filter-chip-close" onClick={() => setFiltroPrioridad("")} />
            </div>
          )}
          {filtroEstado && (
            <div className="filter-chip" style={{ background: "var(--bg-elevated)", color: "var(--text)" }}>
              {STATUS[filtroEstado]}
              <X size={11} className="filter-chip-close" onClick={() => setFiltroEstado("")} />
            </div>
          )}
        </div>
      )}

      {/* Grouped task list */}
      {["pendiente", "progreso", "hecha"].map(estado => {
        const grupo = tareasFiltradas.filter(t => t.estado === estado);
        if (!grupo.length) return null;
        return (
          <div key={estado} style={{ marginBottom: 26 }}>
            <div className="group-label">{STATUS[estado]} ({grupo.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {grupo.map(t => (
                <div key={t.id} className="task-row">
                  <div
                    className={`check-btn ${t.estado === "hecha" ? "checked" : ""}`}
                    onClick={() => setEstado(t.id, t.estado === "hecha" ? "pendiente" : "hecha")}>
                    {t.estado === "hecha" && <span style={{ color: "#0c0c10", fontSize: 11, fontWeight: 800 }}>✓</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={`task-title ${t.estado === "hecha" ? "done" : ""}`}>{t.titulo}</div>
                    <div className="task-meta">
                      <span className="badge" style={{ background: getMBg(t.materiaId), color: getMText(t.materiaId) }}>{getMNombre(t.materiaId)}</span>
                      <span className="badge" style={{ background: PRIORITY[t.prioridad]?.bg, color: PRIORITY[t.prioridad]?.color }}>{PRIORITY[t.prioridad]?.label}</span>
                      {t.fecha && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📅 {t.fecha}</span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {t.estado === "pendiente" && (
                      <button className="icon-btn btn-accent"
                        style={{ color: "#9d96f0", background: "#2d2b4e", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "5px 10px" }}
                        onClick={() => setEstado(t.id, "progreso")}>
                        <Play size={12} /> Iniciar
                      </button>
                    )}
                    {t.estado === "progreso" && (
                      <button className="icon-btn btn-success"
                        style={{ color: "#34d399", background: "#1a3d30", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "5px 10px" }}
                        onClick={() => setEstado(t.id, "hecha")}>
                        <CheckCheck size={12} /> Completar
                      </button>
                    )}
                    <button className="icon-btn btn-accent" style={{ color: "#9d96f0", background: "#2d2b4e" }} onClick={() => onEdit(t)}><Pencil size={14} /></button>
                    <button className="icon-btn btn-danger" style={{ color: "#f87171", background: "#3d1f1f" }} onClick={() => onDelete(t.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty states */}
      {tareas.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-text">No hay tareas aún. Agregá tu primera!</div>
        </div>
      )}
      {tareas.length > 0 && tareasFiltradas.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Sin resultados</div>
          <div className="empty-state-text">Probá cambiando los filtros</div>
          <button className="btn-primary" onClick={limpiarFiltros} style={{ marginTop: 16, fontSize: 13 }}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}