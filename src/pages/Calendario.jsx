import { useState } from "react";
import { Bell, Pencil, Trash2, Plus, X } from "lucide-react";
import { MESES } from "../config/constants";
import { pad, todayStr } from "../utils/helpers";

export default function Calendario({ tareas, recordatorios, getMColor, getMBg, getMText, getMNombre, onNewRecordatorio, onEditRecordatorio, onDelRecordatorio }) {
  const today = new Date();
  const [calMes,  setCalMes]  = useState(today.getMonth());
  const [calAnio, setCalAnio] = useState(today.getFullYear());
  const [calDia,  setCalDia]  = useState(null);

  const prevMes = () => { let m = calMes-1, y = calAnio; if(m<0){m=11;y--;} setCalMes(m); setCalAnio(y); setCalDia(null); };
  const nextMes = () => { let m = calMes+1, y = calAnio; if(m>11){m=0;y++;} setCalMes(m); setCalAnio(y); setCalDia(null); };

  const dateStr     = d => `${calAnio}-${pad(calMes+1)}-${pad(d)}`;
  const isToday     = d => dateStr(d) === todayStr;
  const tareasEnDia = d => tareas.filter(t => t.fecha === dateStr(d));
  const recEnDia    = d => recordatorios.filter(r => r.fecha === dateStr(d));

  const getDias = () => {
    const firstDay = new Date(calAnio, calMes, 1).getDay();
    const total    = new Date(calAnio, calMes + 1, 0).getDate();
    const dias = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) dias.push(null);
    for (let d = 1; d <= total; d++) dias.push(d);
    return dias;
  };

  const dias      = getDias();
  const tareasDia = calDia ? tareasEnDia(calDia) : [];
  const recDia    = calDia ? recEnDia(calDia)    : [];
  const diaSelStr = calDia ? dateStr(calDia)      : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Calendario</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-primary" style={{ fontSize: 13, padding: "9px 16px" }}
            onClick={() => onNewRecordatorio({ fecha: todayStr, hora: "09:00" })}>
            <Bell size={14} /> Nuevo Recordatorio
          </button>
          <button className="nav-btn" onClick={prevMes}>‹</button>
          <span style={{ fontWeight: 600, fontSize: 15, minWidth: 150, textAlign: "center" }}>{MESES[calMes]} {calAnio}</span>
          <button className="nav-btn" onClick={nextMes}>›</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: calDia ? "1fr 300px" : "1fr", gap: 18 }}>
        {/* Calendar grid */}
        <div className="cal-container">
          <div className="cal-weekdays">
            {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map(d => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {dias.map((d, i) => {
              if (!d) return <div key={i} className="cal-cell" />;
              const tt  = tareasEnDia(d);
              const rr  = recEnDia(d);
              const sel = calDia === d;
              const tod = isToday(d);
              return (
                <div key={i}
                  className={`cal-cell is-day${tod ? " is-today" : ""}${sel ? " is-selected" : ""}`}
                  onClick={() => setCalDia(calDia === d ? null : d)}>
                  <div className={`cal-day-num${tod ? " today" : ""}`} style={{ color: sel && !tod ? "var(--accent-soft)" : undefined }}>
                    {d}
                    {tod && <span className="cal-today-dot" />}
                  </div>
                  {tt.slice(0,1).map(t => (
                    <div key={t.id} className="cal-event-pill" style={{ background: getMColor(t.materiaId), color: "#0c0c10" }}>{t.titulo}</div>
                  ))}
                  {rr.slice(0,1).map(r => (
                    <div key={r.id} className="cal-event-pill" style={{ background: "#3d2e0a", color: "#fbbf24" }}>🔔 {r.titulo}</div>
                  ))}
                  {(tt.length + rr.length) > 2 && <div style={{ fontSize: 10, color: "var(--text-muted)" }}>+{tt.length + rr.length - 2} más</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        {calDia && (
          <div className="cal-sidebar">
            <div className="cal-sidebar-header" style={{ marginBottom: 16 }}>
              <div>
                <div className="cal-sidebar-title">{calDia} de {MESES[calMes]}</div>
                <div className="cal-sidebar-count">{tareasDia.length + recDia.length} eventos</div>
              </div>
              <button className="icon-btn" style={{ color: "var(--text-muted)" }} onClick={() => setCalDia(null)} title="Cerrar">
                <X size={16} />
              </button>
            </div>

            <button className="btn-primary" style={{ fontSize: 12, padding: "8px 14px", marginBottom: 16, width: "100%", justifyContent: "center" }}
              onClick={() => onNewRecordatorio({ fecha: diaSelStr, hora: "09:00" })}>
              <Plus size={14} /> Nuevo Recordatorio para este día
            </button>

            {recDia.length > 0 && <>
              <div className="cal-section-label" style={{ color: "#fbbf24" }}>Recordatorios</div>
              {recDia.map(r => (
                <div key={r.id} className="cal-reminder" style={{ background: "rgba(251,191,36,0.1)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24", display: "flex", alignItems: "center", gap: 6 }}>
                      <Bell size={13} /> {r.titulo}
                    </div>
                    {r.hora        && <div style={{ fontSize: 11, color: "#fde68a", marginTop: 2 }}>{r.hora}</div>}
                    {r.descripcion && <div style={{ fontSize: 11, color: "#fde68a", marginTop: 2 }}>{r.descripcion}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="icon-btn btn-accent" style={{ color: "#fbbf24" }} onClick={() => onEditRecordatorio(r)} title="Editar"><Pencil size={13} /></button>
                    <button className="icon-btn btn-danger" style={{ color: "#f87171" }} onClick={() => onDelRecordatorio(r.id)} title="Eliminar"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </>}

            {tareasDia.length > 0 && <>
              <div className="cal-section-label" style={{ color: "var(--text-muted)", marginTop: recDia.length ? 8 : 0 }}>Tareas</div>
              {tareasDia.map(t => (
                <div key={t.id} className="cal-task">
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.titulo}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span className="badge" style={{ background: getMBg(t.materiaId), color: getMText(t.materiaId) }}>{getMNombre(t.materiaId)}</span>
                  </div>
                </div>
              ))}
            </>}

            {tareasDia.length === 0 && recDia.length === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", marginTop: 20 }}>Sin eventos este día.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}