import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Play, CheckCheck, Filter, X } from "lucide-react";
import { dark, PRIORITY, STATUS } from "../config/constants";
import { btnPrimary, badge, iconBtn } from "../config/theme";

export default function Tareas({ tareas, materias, getMNombre, getMBg, getMText, setEstado, onNew, onEdit, onDelete }) {
  const [filtroMateria,  setFiltroMateria]  = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [filtroEstado,   setFiltroEstado]   = useState("");
  const [busqueda,       setBusqueda]       = useState("");
  const [filtrosOpen,    setFiltrosOpen]    = useState(false);

  const pendientes = tareas.filter(t => t.estado !== "hecha").length;
  const hechas     = tareas.filter(t => t.estado === "hecha").length;

  // ── Filtrado reactivo ─────────────────────────────────────────────────────
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

  const limpiarFiltros = () => {
    setFiltroMateria("");
    setFiltroPrioridad("");
    setFiltroEstado("");
    setBusqueda("");
  };

  const selectStyle = {
    background: dark.subtle,
    border: `1.5px solid ${dark.border}`,
    color: dark.text,
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.15s",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5" }}>Tareas</h1>
          <p style={{ color: dark.muted, fontSize: 14, marginTop: 4 }}>
            {pendientes} pendientes · {hechas} completadas
            {hayFiltros && <span style={{ color: "#9d96f0", marginLeft: 8 }}>· {tareasFiltradas.length} resultado{tareasFiltradas.length !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setFiltrosOpen(o => !o)}
            style={{
              background: filtrosOpen || hayFiltros ? "#2d2b4e" : dark.subtle,
              border: `1.5px solid ${filtrosOpen || hayFiltros ? "#9d96f0" : dark.border}`,
              color: filtrosOpen || hayFiltros ? "#9d96f0" : dark.muted,
              borderRadius: 10, padding: "9px 16px", fontWeight: 600,
              cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.18s",
            }}
          >
            <Filter size={14} />
            Filtros
            {hayFiltros && (
              <span style={{ background: "#9d96f0", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>
                {[filtroMateria, filtroPrioridad, filtroEstado, busqueda].filter(Boolean).length}
              </span>
            )}
          </button>
          <button className="btn-primary" style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6 }} onClick={onNew}>
            <Plus size={16} /> Nueva tarea
          </button>
        </div>
      </div>

      {/* Panel de filtros */}
      {filtrosOpen && (
        <div style={{ background: dark.card, borderRadius: 14, border: `1.5px solid ${dark.border}`, padding: "18px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>

          {/* Búsqueda */}
          <div style={{ flex: "1 1 180px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Buscar</div>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Nombre de tarea..."
              style={{ ...selectStyle, width: "100%", padding: "7px 12px" }}
            />
          </div>

          {/* Materia */}
          <div style={{ flex: "1 1 150px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Materia</div>
            <select value={filtroMateria} onChange={e => setFiltroMateria(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
              <option value="">Todas</option>
              {materias.map(m => <option key={m.id} value={String(m.id)}>{m.nombre}</option>)}
            </select>
          </div>

          {/* Prioridad */}
          <div style={{ flex: "1 1 130px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Prioridad</div>
            <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
              <option value="">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          {/* Estado */}
          <div style={{ flex: "1 1 130px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Estado</div>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
              <option value="">Todos</option>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {/* Limpiar */}
          {hayFiltros && (
            <button onClick={limpiarFiltros}
              style={{ background: "#3d1f1f", border: "none", color: "#f87171", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s", alignSelf: "flex-end" }}>
              <X size={13} /> Limpiar
            </button>
          )}
        </div>
      )}

      {/* Chips de filtros activos */}
      {hayFiltros && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {busqueda && (
            <div style={{ background: "#2d2b4e", color: "#9d96f0", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              "{busqueda}"
              <X size={11} style={{ cursor: "pointer" }} onClick={() => setBusqueda("")} />
            </div>
          )}
          {filtroMateria && (
            <div style={{ background: "#2d2b4e", color: "#9d96f0", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              {materias.find(m => String(m.id) === filtroMateria)?.nombre}
              <X size={11} style={{ cursor: "pointer" }} onClick={() => setFiltroMateria("")} />
            </div>
          )}
          {filtroPrioridad && (
            <div style={{ background: PRIORITY[filtroPrioridad].bg, color: PRIORITY[filtroPrioridad].color, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              {PRIORITY[filtroPrioridad].label}
              <X size={11} style={{ cursor: "pointer" }} onClick={() => setFiltroPrioridad("")} />
            </div>
          )}
          {filtroEstado && (
            <div style={{ background: dark.subtle, color: dark.text, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              {STATUS[filtroEstado]}
              <X size={11} style={{ cursor: "pointer" }} onClick={() => setFiltroEstado("")} />
            </div>
          )}
        </div>
      )}

      {/* Lista agrupada por estado */}
      {["pendiente", "progreso", "hecha"].map(estado => {
        const grupo = tareasFiltradas.filter(t => t.estado === estado);
        if (!grupo.length) return null;
        return (
          <div key={estado} style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              {STATUS[estado]} ({grupo.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {grupo.map(t => (
                <div key={t.id} className="task-row" style={{ background: dark.card, borderRadius: 12, border: `1.5px solid ${dark.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
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
                        onClick={() => setEstado(t.id, "progreso")}>
                        <Play size={12} /> Iniciar
                      </button>
                    )}
                    {t.estado === "progreso" && (
                      <button className="icon-btn btn-success" style={{ ...iconBtn("#34d399","#1a3d30"), display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "5px 10px" }}
                        onClick={() => setEstado(t.id, "hecha")}>
                        <CheckCheck size={12} /> Completar
                      </button>
                    )}
                    <button className="icon-btn btn-accent" style={iconBtn("#9d96f0","#2d2b4e")} onClick={() => onEdit(t)}><Pencil size={14} /></button>
                    <button className="icon-btn btn-danger" style={iconBtn("#f87171","#3d1f1f")} onClick={() => onDelete(t.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty states */}
      {tareas.length === 0 && (
        <div style={{ textAlign: "center", color: dark.muted, marginTop: 60 }}>
          No hay tareas aún. ¡Agregá tu primera!
        </div>
      )}
      {tareas.length > 0 && tareasFiltradas.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ color: dark.text, fontWeight: 600, fontSize: 15 }}>Sin resultados</div>
          <div style={{ color: dark.muted, fontSize: 13, marginTop: 4 }}>Probá cambiando los filtros</div>
          <button onClick={limpiarFiltros}
            style={{ marginTop: 16, background: "#2d2b4e", border: "none", color: "#9d96f0", borderRadius: 8, padding: "8px 18px", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}