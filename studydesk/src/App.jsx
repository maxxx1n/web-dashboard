import { useState } from "react";
import { COLORS, COLOR_BG, COLOR_TEXT, dark } from "./constants";
import { useStorage } from "./hooks/useStorage";
import Sidebar from "./components/Sidebar.jsx";
import { MateriaModal, TareaModal, RecordatorioModal } from "./components/Modals";
import { Inicio, Materias, Horarios, Tareas, Calendario, Pomodoro, Stats } from "./views";

const DEFAULT_MATERIAS = [
  { id: 1, nombre: "Matemáticas", descripcion: "Álgebra y análisis",  colorIdx: 0, horarios: [{ dia: "Lunes",     inicio: "08:00", fin: "10:00" }] },
  { id: 2, nombre: "Historia",    descripcion: "Historia universal",   colorIdx: 1, horarios: [{ dia: "Martes",    inicio: "10:00", fin: "12:00" }] },
  { id: 3, nombre: "Física",      descripcion: "Mecánica clásica",     colorIdx: 2, horarios: [{ dia: "Miércoles", inicio: "14:00", fin: "16:00" }] },
];
const DEFAULT_TAREAS = [
  { id: 1, titulo: "Ejercicios cap. 4",          materiaId: 1, prioridad: "alta",  estado: "pendiente", fecha: "2026-05-22" },
  { id: 2, titulo: "Lectura Revolución Francesa", materiaId: 2, prioridad: "media", estado: "progreso",  fecha: "2026-05-20" },
];
const DEFAULT_RECORDATORIOS = [
  { id: 1, titulo: "Estudiar para parcial", fecha: "2026-05-22", hora: "18:00", descripcion: "Repasar capítulos 1-4" },
];

export default function App() {
  const [view, setView] = useState("inicio");
  const [materias,      setMaterias]      = useStorage("materias_v2",      DEFAULT_MATERIAS);
  const [tareas,        setTareas]        = useStorage("tareas_v2",        DEFAULT_TAREAS);
  const [recordatorios, setRecordatorios] = useStorage("recordatorios_v2", DEFAULT_RECORDATORIOS);
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({});

  const openModal  = (type, data = {}) => { setModal(type); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  const getM       = id => materias.find(x => x.id === id);
  const getMColor  = id => { const m = getM(id); return m ? COLORS[m.colorIdx % COLORS.length]     : "#888"; };
  const getMBg     = id => { const m = getM(id); return m ? COLOR_BG[m.colorIdx % COLORS.length]   : dark.subtle; };
  const getMText   = id => { const m = getM(id); return m ? COLOR_TEXT[m.colorIdx % COLORS.length] : dark.muted; };
  const getMNombre = id => getM(id)?.nombre || "Sin materia";

  const saveMateria = () => {
    if (!form.nombre?.trim()) return;
    if (form.id) setMaterias(m => m.map(x => x.id === form.id ? { ...x, ...form } : x));
    else setMaterias(m => [...m, { ...form, id: Date.now(), colorIdx: m.length % COLORS.length, horarios: [] }]);
    closeModal();
  };
  const delMateria = id => { setMaterias(m => m.filter(x => x.id !== id)); setTareas(t => t.filter(x => x.materiaId !== id)); };
  const addHorario = (materiaId, hf) => setMaterias(m => m.map(x => x.id === materiaId ? { ...x, horarios: [...(x.horarios||[]), { ...hf }] } : x));
  const delHorario = (materiaId, idx) => setMaterias(m => m.map(x => x.id === materiaId ? { ...x, horarios: x.horarios.filter((_,i) => i !== idx) } : x));

  const saveTarea = () => {
    if (!form.titulo?.trim()) return;
    if (form.id) setTareas(t => t.map(x => x.id === form.id ? { ...x, ...form } : x));
    else setTareas(t => [...t, { ...form, id: Date.now(), estado: form.estado || "pendiente" }]);
    closeModal();
  };
  const delTarea  = id => setTareas(t => t.filter(x => x.id !== id));
  const setEstado = (id, estado) => setTareas(t => t.map(x => x.id === id ? { ...x, estado } : x));

  const saveRecordatorio = () => {
    if (!form.titulo?.trim() || !form.fecha) return;
    if (form.id) setRecordatorios(r => r.map(x => x.id === form.id ? { ...x, ...form } : x));
    else setRecordatorios(r => [...r, { ...form, id: Date.now() }]);
    closeModal();
  };
  const delRecordatorio = id => setRecordatorios(r => r.filter(x => x.id !== id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: ${dark.bg}; color: ${dark.text}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 4px; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.6); }
        .nav-item { transition: all 0.18s ease; }
        .nav-item:hover { background: #252535 !important; color: #b8b4ff !important; transform: translateX(3px); }
        .nav-item.active { background: linear-gradient(135deg,#2d2b4e,#1e1e35) !important; color: #9d96f0 !important; box-shadow: inset 3px 0 0 #9d96f0; }
        .btn-primary { transition: all 0.18s ease; }
        .btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(127,119,221,0.35); }
        .btn-primary:active { transform: translateY(0); }
        .btn-ghost { transition: all 0.18s ease; }
        .btn-ghost:hover { background: #252535 !important; color: ${dark.text} !important; }
        .btn-danger { transition: all 0.18s ease; }
        .btn-danger:hover { background: #4d1f1f !important; color: #ff8080 !important; }
        .btn-success { transition: all 0.18s ease; }
        .btn-success:hover { background: #1a4d30 !important; color: #5dffb0 !important; }
        .btn-accent { transition: all 0.18s ease; }
        .btn-accent:hover { background: #3d3b6e !important; color: #c4c0ff !important; }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { border-color: #3a3a50 !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .check-btn { transition: all 0.15s ease; }
        .check-btn:hover { transform: scale(1.1); }
        .task-row { transition: background 0.15s ease; }
        .task-row:hover { background: #242430 !important; }
        .cal-day { transition: background 0.12s ease; }
        .cal-day:hover { background: #252535 !important; }
        .icon-btn { transition: all 0.15s ease; border: none; cursor: pointer; border-radius: 7px; padding: 5px 9px; font-size: 13px; }
        .icon-btn:hover { filter: brightness(1.3); transform: scale(1.05); }
        .metric-card { transition: all 0.2s ease; }
        .metric-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .add-card { transition: all 0.2s ease; }
        .add-card:hover { border-color: #9d96f0 !important; color: #9d96f0 !important; background: #1a1a28 !important; }
        .modal-overlay { animation: fadeIn 0.15s ease; }
        .modal-box { animation: slideUp 0.2s ease; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .badge-pill { transition: all 0.15s ease; }
        .badge-pill:hover { filter: brightness(1.2); }
        .pomodoro-ring { transition: stroke-dashoffset 1s linear; }
        .tag { display: inline-flex; align-items: center; font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar view={view} setView={setView} tareas={tareas} />
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", background: dark.bg, minHeight: "100vh" }}>

          {view === "inicio"     && <Inicio     tareas={tareas} materias={materias} recordatorios={recordatorios} getMNombre={getMNombre} getMBg={getMBg} getMText={getMText} setEstado={setEstado} openTarea={() => openModal("tarea",{ prioridad:"media", estado:"pendiente" })} />}
          {view === "materias"   && <Materias   materias={materias} tareas={tareas} onNew={() => openModal("materia",{ horarios:[] })} onEdit={m => openModal("materia",{ ...m })} onDelete={delMateria} />}
          {view === "horarios"   && <Horarios   materias={materias} onAddHorario={addHorario} onDelHorario={delHorario} />}
          {view === "tareas"     && <Tareas     tareas={tareas} materias={materias} getMNombre={getMNombre} getMBg={getMBg} getMText={getMText} setEstado={setEstado} onNew={() => openModal("tarea",{ prioridad:"media", estado:"pendiente" })} onEdit={t => openModal("tarea",{ ...t })} onDelete={delTarea} />}
          {view === "calendario" && <Calendario tareas={tareas} recordatorios={recordatorios} getMColor={getMColor} getMBg={getMBg} getMText={getMText} getMNombre={getMNombre} onNewRecordatorio={data => openModal("recordatorio", data)} onEditRecordatorio={r => openModal("recordatorio",{ ...r })} onDelRecordatorio={delRecordatorio} />}
          {view === "pomodoro"   && <Pomodoro   materias={materias} />}
          {view === "stats"      && <Stats      tareas={tareas} materias={materias} getMColor={getMColor} getMNombre={getMNombre} />}
        </main>
      </div>

      {modal === "materia"      && <MateriaModal      form={form} setForm={setForm} onSave={saveMateria}      onClose={closeModal} />}
      {modal === "tarea"        && <TareaModal        form={form} setForm={setForm} materias={materias} onSave={saveTarea}        onClose={closeModal} />}
      {modal === "recordatorio" && <RecordatorioModal form={form} setForm={setForm} onSave={saveRecordatorio} onClose={closeModal} />}
    </>
  );
}