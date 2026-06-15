import { useState } from "react";
import { COLORS } from "./config/constants";
import { useStorage } from "./hooks/useStorage";
import Sidebar from "./components/layout/Sidebar";
import { MateriaModal, TareaModal, RecordatorioModal } from "./components/modals/Modals";
import { Inicio, Materias, Horarios, Tareas, Calendario, Stats } from "./pages";

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

const COLOR_BG   = ["#2d2b4e","#1a3d30","#3d1f1f","#1a2d4e","#3d1a2d","#3d2e0a","#1f3d0a","#2d1a3d"];
const COLOR_TEXT  = ["#c4c0ff","#6ee7b7","#fca5a5","#93c5fd","#f9a8d4","#fde68a","#d9f99d","#e9d5ff"];

export default function App() {
  const [view, setView] = useState("inicio");
  const [materias,      setMaterias]      = useStorage("materias_v2",      DEFAULT_MATERIAS);
  const [tareas,        setTareas]        = useStorage("tareas_v2",        DEFAULT_TAREAS);
  const [recordatorios, setRecordatorios] = useStorage("recordatorios_v2", DEFAULT_RECORDATORIOS);
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({});

  const openModal  = (type, data = {}) => { setModal(type); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  // ── Helpers de color ─────────────────────────────────────────────────────
  const getM       = id => materias.find(x => x.id === id);
  const getMColor  = id => { const m = getM(id); return m ? COLORS[m.colorIdx % COLORS.length]     : "#888"; };
  const getMBg     = id => { const m = getM(id); return m ? COLOR_BG[m.colorIdx % COLORS.length]   : "#1e1e2c"; };
  const getMText   = id => { const m = getM(id); return m ? COLOR_TEXT[m.colorIdx % COLORS.length] : "#8888b0"; };
  const getMNombre = id => getM(id)?.nombre || "Sin materia";

  // ── CRUD Materias ─────────────────────────────────────────────────────────
  const saveMateria = () => {
    if (!form.nombre?.trim()) return;
    if (form.id) setMaterias(m => m.map(x => x.id === form.id ? { ...x, ...form } : x));
    else setMaterias(m => [...m, { ...form, id: Date.now(), colorIdx: m.length % COLORS.length, horarios: [] }]);
    closeModal();
  };

  /**
   * Confirmación antes de borrar una materia.
   * Advierte que también se eliminarán las tareas asociadas (borrado en cascada).
   */
  const delMateria = id => {
    const m = materias.find(x => x.id === id);
    const tareasAsociadas = tareas.filter(t => t.materiaId === id).length;
    const msg = tareasAsociadas > 0
      ? `¿Eliminar la materia "${m?.nombre}"?\n\nEsto también borrará ${tareasAsociadas} tarea(s) asociada(s). Esta acción no se puede deshacer.`
      : `¿Eliminar la materia "${m?.nombre}"? Esta acción no se puede deshacer.`;
    if (!window.confirm(msg)) return;
    setMaterias(prev => prev.filter(x => x.id !== id));
    setTareas(prev => prev.filter(x => x.materiaId !== id));
  };

  // ── CRUD Horarios ─────────────────────────────────────────────────────────
  const addHorario = (materiaId, hf) =>
    setMaterias(m => m.map(x => x.id === materiaId ? { ...x, horarios: [...(x.horarios || []), { ...hf }] } : x));

  const delHorario = (materiaId, idx) =>
    setMaterias(m => m.map(x => x.id === materiaId ? { ...x, horarios: x.horarios.filter((_, i) => i !== idx) } : x));

  // ── CRUD Tareas ───────────────────────────────────────────────────────────
  const saveTarea = () => {
    if (!form.titulo?.trim()) return;
    if (form.id) setTareas(t => t.map(x => x.id === form.id ? { ...x, ...form } : x));
    else setTareas(t => [...t, { ...form, id: Date.now(), estado: form.estado || "pendiente" }]);
    closeModal();
  };

  /** Confirmación antes de borrar una tarea. */
  const delTarea = id => {
    const t = tareas.find(x => x.id === id);
    if (!window.confirm(`¿Eliminar la tarea "${t?.titulo}"? Esta acción no se puede deshacer.`)) return;
    setTareas(prev => prev.filter(x => x.id !== id));
  };

  const setEstado = (id, estado) => setTareas(t => t.map(x => x.id === id ? { ...x, estado } : x));

  // ── CRUD Recordatorios ────────────────────────────────────────────────────
  const saveRecordatorio = () => {
    if (!form.titulo?.trim() || !form.fecha) return;
    if (form.id) setRecordatorios(r => r.map(x => x.id === form.id ? { ...x, ...form } : x));
    else setRecordatorios(r => [...r, { ...form, id: Date.now() }]);
    closeModal();
  };

  /** Confirmación antes de borrar un recordatorio. */
  const delRecordatorio = id => {
    const r = recordatorios.find(x => x.id === id);
    if (!window.confirm(`¿Eliminar el recordatorio "${r?.titulo}"?`)) return;
    setRecordatorios(prev => prev.filter(x => x.id !== id));
  };

  return (
    <>
      <div className="app-layout">
        <Sidebar view={view} setView={setView} tareas={tareas} />
        <main className="main-content">
          {view === "inicio"     && <Inicio     tareas={tareas} materias={materias} recordatorios={recordatorios} getMNombre={getMNombre} getMBg={getMBg} getMText={getMText} setEstado={setEstado} openTarea={() => openModal("tarea", { prioridad: "media", estado: "pendiente" })} />}
          {view === "materias"   && <Materias   materias={materias} tareas={tareas} onNew={() => openModal("materia", { horarios: [] })} onEdit={m => openModal("materia", { ...m })} onDelete={delMateria} />}
          {view === "horarios"   && <Horarios   materias={materias} onAddHorario={addHorario} onDelHorario={delHorario} />}
          {view === "tareas"     && <Tareas     tareas={tareas} materias={materias} getMNombre={getMNombre} getMBg={getMBg} getMText={getMText} setEstado={setEstado} onNew={() => openModal("tarea", { prioridad: "media", estado: "pendiente" })} onEdit={t => openModal("tarea", { ...t })} onDelete={delTarea} />}
          {view === "calendario" && <Calendario tareas={tareas} recordatorios={recordatorios} getMColor={getMColor} getMBg={getMBg} getMText={getMText} getMNombre={getMNombre} onNewRecordatorio={data => openModal("recordatorio", data)} onEditRecordatorio={r => openModal("recordatorio", { ...r })} onDelRecordatorio={delRecordatorio} />}
          {view === "stats"      && <Stats      tareas={tareas} materias={materias} getMColor={getMColor} getMNombre={getMNombre} />}
        </main>
      </div>

      {modal === "materia"      && <MateriaModal      form={form} setForm={setForm} onSave={saveMateria}      onClose={closeModal} />}
      {modal === "tarea"        && <TareaModal        form={form} setForm={setForm} materias={materias} onSave={saveTarea}        onClose={closeModal} />}
      {modal === "recordatorio" && <RecordatorioModal form={form} setForm={setForm} onSave={saveRecordatorio} onClose={closeModal} />}
    </>
  );
}