import { useState } from "react";
import { COLORS, COLOR_BG, COLOR_TEXT, dark, todayStr } from "./constants";
import { useStorage } from "./hooks";
import Sidebar from "./components/Sidebar";
import { MateriaModal, TareaModal, RecordatorioModal } from "./components/Modals";
import { Inicio, Materias, Horarios, Tareas, Calendario } from "./views";

const DEFAULT_MATERIAS = [
  { id: 1, nombre: "Programacion II", descripcion: "Profesora: Margarita de los Angeles Ruiz",  colorIdx: 0, horarios: [{ dia: "Lunes",     inicio: "19:00", fin: "21:00" }] },
  { id: 2, nombre: "Electronica Analogica y Digital",    descripcion: "Profesor: Adolfo Jurado",   colorIdx: 1, horarios: [{ dia: "Martes",    inicio: "10:00", fin: "12:00" }] },
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

  // ── Estado persistente ──────────────────────────────────────────────────────
  const [materias,       setMaterias]       = useStorage("materias_v2",       DEFAULT_MATERIAS);
  const [tareas,         setTareas]         = useStorage("tareas_v2",         DEFAULT_TAREAS);
  const [recordatorios,  setRecordatorios]  = useStorage("recordatorios_v2",  DEFAULT_RECORDATORIOS);

  // ── Modales ─────────────────────────────────────────────────────────────────
  const [modal, setModal] = useState(null); // "materia" | "tarea" | "recordatorio"
  const [form,  setForm]  = useState({});

  const openModal  = (type, data = {}) => { setModal(type); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  // ── Helpers de color ─────────────────────────────────────────────────────────
  const getM      = id => materias.find(x => x.id === id);
  const getMColor = id => { const m = getM(id); return m ? COLORS[m.colorIdx % COLORS.length]     : "#888"; };
  const getMBg    = id => { const m = getM(id); return m ? COLOR_BG[m.colorIdx % COLORS.length]   : dark.subtle; };
  const getMText  = id => { const m = getM(id); return m ? COLOR_TEXT[m.colorIdx % COLORS.length] : dark.muted; };
  const getMNombre = id => getM(id)?.nombre || "Sin materia";

  // ── CRUD Materias ────────────────────────────────────────────────────────────
  const saveMateria = () => {
    if (!form.nombre?.trim()) return;
    if (form.id) {
      setMaterias(m => m.map(x => x.id === form.id ? { ...x, ...form } : x));
    } else {
      setMaterias(m => [...m, { 
  ...form, 
  id: Date.now(), 
  colorIdx: form.colorIdx !== undefined ? form.colorIdx : (m.length % COLORS.length), 
  horarios: [] 
}]);
    }
    closeModal();
  };

  const delMateria = id => {
    setMaterias(m => m.filter(x => x.id !== id));
    setTareas(t => t.filter(x => x.materiaId !== id));
  };

  // ── CRUD Horarios ────────────────────────────────────────────────────────────
  const addHorario = (materiaId, horarioForm) => {
    setMaterias(m => m.map(x =>
      x.id === materiaId
        ? { ...x, horarios: [...(x.horarios || []), { ...horarioForm }] }
        : x
    ));
  };

  const delHorario = (materiaId, idx) => {
    setMaterias(m => m.map(x =>
      x.id === materiaId
        ? { ...x, horarios: x.horarios.filter((_, i) => i !== idx) }
        : x
    ));
  };

  // ── CRUD Tareas ──────────────────────────────────────────────────────────────
  const saveTarea = () => {
    if (!form.titulo?.trim()) return;
    if (form.id) {
      setTareas(t => t.map(x => x.id === form.id ? { ...x, ...form } : x));
    } else {
      setTareas(t => [...t, { ...form, id: Date.now(), estado: form.estado || "pendiente" }]);
    }
    closeModal();
  };

  const delTarea  = id => setTareas(t => t.filter(x => x.id !== id));
  const setEstado = (id, estado) => setTareas(t => t.map(x => x.id === id ? { ...x, estado } : x));

  // ── CRUD Recordatorios ───────────────────────────────────────────────────────
  const saveRecordatorio = () => {
    if (!form.titulo?.trim() || !form.fecha) return;
    if (form.id) {
      setRecordatorios(r => r.map(x => x.id === form.id ? { ...x, ...form } : x));
    } else {
      setRecordatorios(r => [...r, { ...form, id: Date.now() }]);
    }
    closeModal();
  };

  const delRecordatorio = id => setRecordatorios(r => r.filter(x => x.id !== id));

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar view={view} setView={setView} />

      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", background: dark.bg }}>

        {view === "inicio" && (
          <Inicio
            tareas={tareas}
            materias={materias}
            recordatorios={recordatorios}
            getMNombre={getMNombre}
            getMBg={getMBg}
            getMText={getMText}
            setEstado={setEstado}
          />
        )}

        {view === "materias" && (
          <Materias
            materias={materias}
            tareas={tareas}
            onNew={() => openModal("materia", { horarios: [] })}
            onEdit={m => openModal("materia", { ...m })}
            onDelete={delMateria}
          />
        )}

        {view === "horarios" && (
          <Horarios
            materias={materias}
            onAddHorario={addHorario}
            onDelHorario={delHorario}
          />
        )}

        {view === "tareas" && (
          <Tareas
            tareas={tareas}
            materias={materias}
            getMNombre={getMNombre}
            getMBg={getMBg}
            getMText={getMText}
            setEstado={setEstado}
            onNew={() => openModal("tarea", { prioridad: "media", estado: "pendiente" })}
            onEdit={t => openModal("tarea", { ...t })}
            onDelete={delTarea}
          />
        )}

        {view === "calendario" && (
          <Calendario
            tareas={tareas}
            recordatorios={recordatorios}
            getMColor={getMColor}
            getMBg={getMBg}
            getMText={getMText}
            getMNombre={getMNombre}
            onNewRecordatorio={data => openModal("recordatorio", data)}
            onEditRecordatorio={r => openModal("recordatorio", { ...r })}
            onDelRecordatorio={delRecordatorio}
          />
        )}
      </main>

      {/* Modales */}
      {modal === "materia" && (
        <MateriaModal
          form={form}
          setForm={setForm}
          onSave={saveMateria}
          onClose={closeModal}
        />
      )}
      {modal === "tarea" && (
        <TareaModal
          form={form}
          setForm={setForm}
          materias={materias}
          onSave={saveTarea}
          onClose={closeModal}
        />
      )}
      {modal === "recordatorio" && (
        <RecordatorioModal
          form={form}
          setForm={setForm}
          onSave={saveRecordatorio}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
