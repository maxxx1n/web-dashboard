import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { dark } from "../constants";
import { card, btnPrimary } from "../styles/shared";

const MODES = [
  { key: "focus", label: "Enfoque",        mins: 25, color: "#9d96f0" },
  { key: "short", label: "Descanso",       mins: 5,  color: "#34d399" },
  { key: "long",  label: "Descanso largo", mins: 15, color: "#60a5fa" },
];

/**
 * Genera un tono de alerta usando Web Audio API.
 * No depende de archivos externos.
 * @param {"focus"|"short"|"long"} mode - Modo actual completado.
 */
function playAlertTone(mode) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Enfoque: tono más agudo; descansos: tono grave
    osc.frequency.value = mode === "focus" ? 880 : 440;
    osc.type            = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);
  } catch {
    // Si el navegador bloquea AudioContext (sin interacción previa), se ignora silenciosamente.
  }
}

/**
 * Solicita permiso y lanza una notificación nativa del sistema operativo.
 * @param {string} title - Título de la notificación.
 * @param {string} body  - Cuerpo del mensaje.
 */
async function sendNotification(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
}

export default function Pomodoro({ materias }) {
  const [mode,    setMode]    = useState(0);
  const [secs,    setSecs]    = useState(MODES[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [rounds,  setRounds]  = useState(0);
  const [materia, setMateria] = useState("");
  const interval = useRef(null);

  const cur   = MODES[mode];
  const total = cur.mins * 60;
  const pct   = 1 - secs / total;
  const r     = 90, circ = 2 * Math.PI * r;

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(interval.current);
            setRunning(false);

            // Sonido de alerta al finalizar el ciclo
            playAlertTone(cur.key);

            // Notificación nativa del sistema
            if (cur.key === "focus") {
              setRounds(r => r + 1);
              sendNotification(
                "¡Ciclo de enfoque completado! 🎉",
                `Llevás ${rounds + 1} ronda(s). Es hora de descansar.`
              );
            } else {
              sendNotification(
                "¡Descanso terminado! ⏱",
                "Es hora de volver a enfocarte."
              );
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [running, mode]);

  const switchMode = i => { setMode(i); setSecs(MODES[i].mins * 60); setRunning(false); };
  const toggle     = () => setRunning(r => !r);
  const reset      = () => { setRunning(false); setSecs(cur.mins * 60); };
  const fmt        = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", color: dark.text }}>Pomodoro</h1>
        <p style={{ color: dark.muted, fontSize: 14 }}>Sesiones de enfoque para estudiar mejor.</p>
      </div>

      {/* Selector de modo */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, background: dark.subtle, borderRadius: 12, padding: 6 }}>
        {MODES.map((m, i) => (
          <div key={m.key} onClick={() => switchMode(i)}
            style={{ flex: 1, padding: "9px 0", textAlign: "center", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: mode === i ? dark.card : "transparent",
              color:      mode === i ? m.color   : dark.muted,
              boxShadow:  mode === i ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
              transition: "all 0.18s" }}>
            {m.label}
          </div>
        ))}
      </div>

      {/* Anillo circular */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={r} fill="none" stroke={dark.subtle} strokeWidth="10" />
            <circle cx="110" cy="110" r={r} fill="none" stroke={cur.color} strokeWidth="10"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: dark.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px" }}>{fmt(secs)}</div>
            <div style={{ fontSize: 13, color: cur.color, fontWeight: 600, marginTop: 4 }}>{cur.label}</div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
        <button className="btn-ghost" onClick={reset}
          style={{ background: dark.subtle, border: `1.5px solid ${dark.border}`, color: dark.muted, borderRadius: 12, padding: "12px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.18s" }}>
          <RotateCcw size={15} /> Reiniciar
        </button>
        <button className="btn-primary" onClick={toggle}
          style={{ ...btnPrimary, padding: "12px 36px", fontSize: 15, borderRadius: 12, display: "flex", alignItems: "center", gap: 8,
            background: running
              ? "linear-gradient(135deg,#f87171,#e24b4a)"
              : `linear-gradient(135deg,${cur.color},${cur.color}cc)` }}>
          {running ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> Iniciar</>}
        </button>
      </div>

      {/* Rondas + materia */}
      <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: dark.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Rondas completadas</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: cur.color, marginTop: 2 }}>{rounds}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: dark.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Estudiando</div>
          <select value={materia} onChange={e => setMateria(e.target.value)}
            style={{ background: dark.subtle, border: `1.5px solid ${dark.border}`, color: dark.text, borderRadius: 8, padding: "7px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}>
            <option value="">Sin seleccionar</option>
            {materias.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}