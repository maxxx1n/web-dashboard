import { useState } from "react";
import { Bell, Pencil, Trash2, Plus, X } from "lucide-react";
import { dark, MESES } from "../config/constants";
import { pad, todayStr } from "../utils/helpers";
import { btnPrimary, badge, iconBtn } from "../config/theme";

export default function Calendario({ tareas, recordatorios, getMColor, getMBg, getMText, getMNombre, onNewRecordatorio, onEditRecordatorio, onDelRecordatorio }) {
  const today = new Date();
  const [calMes,  setCalMes]  = useState(today.getMonth());
  const [calAnio, setCalAnio] = useState(today.getFullYear());
  const [calDia,  setCalDia]  = useState(null);

  const prevMes = () => { let m = calMes-1, y = calAnio; if(m<0){m=11;y--;} setCalMes(m); setCalAnio(y); setCalDia(null); };
  const nextMes = () => { let m = calMes+1, y = calAnio; if(m>11){m=0;y++;} setCalMes(m); setCalAnio(y); setCalDia(null); };

  const dateStr    = d => `${calAnio}-${pad(calMes+1)}-${pad(d)}`;
  const isToday    = d => dateStr(d) === todayStr;
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

  const navBtn = { background: dark.card, border: `1.5px solid ${dark.border}`, color: dark.text, borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#eaeaf5" }}>Calendario</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-primary" style={{ ...btnPrimary, fontSize: 13, padding: "9px 16px", display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => onNewRecordatorio({ fecha: todayStr, hora: "09:00" })}>
            <Bell size={14} /> Nuevo Recordatorio
          </button>
          <button className="btn-ghost" style={navBtn} onClick={prevMes}>‹</button>
          <span style={{ fontWeight: 600, fontSize: 15, minWidth: 150, textAlign: "center" }}>{MESES[calMes]} {calAnio}</span>
          <button className="btn-ghost" style={navBtn} onClick={nextMes}>›</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: calDia ? "1fr 300px" : "1fr", gap: 18 }}>
        {/* Grilla */}
        <div style={{ background: dark.card, borderRadius: 16, border: `1.5px solid ${dark.border}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: dark.subtle, borderBottom: `1.5px solid ${dark.border}` }}>
            {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map(d => (
              <div key={d} style={{ padding: "11px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: dark.muted, letterSpacing: 0.5 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {dias.map((d, i) => {
              const tt  = d ? tareasEnDia(d) : [];
              const rr  = d ? recEnDia(d)    : [];
              const sel = d && calDia === d;
              const tod = d && isToday(d);
              return (
                <div key={i} className={d ? "cal-day" : ""}
                  onClick={() => d && setCalDia(calDia === d ? null : d)}
                  style={{ minHeight: 82, padding: "8px 6px", borderRight: (i+1)%7!==0 ? `1px solid ${dark.border}` : "none", borderBottom: `1px solid ${dark.border}`, background: sel ? "#2d2b4e" : tod ? "#1e1e30" : "transparent", cursor: d ? "pointer" : "default" }}>
                  {d && <>
                    <div style={{ fontSize: 13, fontWeight: tod ? 700 : 400, color: tod ? "#9d96f0" : sel ? "#c4c0ff" : dark.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      {d}
                      {tod && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#9d96f0", display: "inline-block" }} />}
                    </div>
                    {tt.slice(0,1).map(t => (
                      <div key={t.id} style={{ fontSize: 10, background: getMColor(t.materiaId), color: "#0c0c10", borderRadius: 4, padding: "2px 5px", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>{t.titulo}</div>
                    ))}
                    {rr.slice(0,1).map(r => (
                      <div key={r.id} style={{ fontSize: 10, background: "#3d2e0a", color: "#fbbf24", borderRadius: 4, padding: "2px 5px", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🔔 {r.titulo}</div>
                    ))}
                    {(tt.length + rr.length) > 2 && <div style={{ fontSize: 10, color: dark.muted }}>+{tt.length + rr.length - 2} más</div>}
                  </>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel lateral */}
        {calDia && (
          <div style={{ background: dark.card, borderRadius: 16, border: `1.5px solid ${dark.border}`, padding: 20, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{calDia} de {MESES[calMes]}</div>
                <div style={{ fontSize: 12, color: dark.muted }}>{tareasDia.length + recDia.length} eventos</div>
              </div>
              <button className="icon-btn" style={iconBtn(dark.muted)} onClick={() => setCalDia(null)} title="Cerrar">
                <X size={16} />
              </button>
            </div>

            <button className="btn-primary" style={{ ...btnPrimary, fontSize: 12, padding: "8px 14px", marginBottom: 16, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              onClick={() => onNewRecordatorio({ fecha: diaSelStr, hora: "09:00" })}>
              <Plus size={14} /> Nuevo Recordatorio para este día
            </button>

            {recDia.length > 0 && <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Recordatorios</div>
              {recDia.map(r => (
                <div key={r.id} style={{ background: "#3d2e0a", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24", display: "flex", alignItems: "center", gap: 6 }}>
                      <Bell size={13} /> {r.titulo}
                    </div>
                    {r.hora        && <div style={{ fontSize: 11, color: "#fde68a", marginTop: 2 }}>{r.hora}</div>}
                    {r.descripcion && <div style={{ fontSize: 11, color: "#fde68a", marginTop: 2 }}>{r.descripcion}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="icon-btn btn-accent" style={iconBtn("#fbbf24")} onClick={() => onEditRecordatorio(r)} title="Editar"><Pencil size={13} /></button>
                    <button className="icon-btn btn-danger" style={iconBtn("#f87171")} onClick={() => onDelRecordatorio(r.id)} title="Eliminar"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </>}

            {tareasDia.length > 0 && <>
              <div style={{ fontSize: 11, fontWeight: 700, color: dark.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, marginTop: recDia.length ? 8 : 0 }}>Tareas</div>
              {tareasDia.map(t => (
                <div key={t.id} style={{ background: dark.subtle, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.titulo}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={badge(getMBg(t.materiaId), getMText(t.materiaId))}>{getMNombre(t.materiaId)}</span>
                  </div>
                </div>
              ))}
            </>}

            {tareasDia.length === 0 && recDia.length === 0 && (
              <div style={{ color: dark.muted, fontSize: 13, textAlign: "center", marginTop: 20 }}>Sin eventos este día.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}