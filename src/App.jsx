import { useState, useEffect } from "react";
import { COLORS, COLOR_BG, COLOR_TEXT } from "./config/constants";
import { subjectsApi, tasksApi, remindersApi } from "./services/api";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import { MateriaModal, TareaModal, RecordatorioModal } from "./components/modals/Modals";
import { Inicio, Materias, Horarios, Tareas, Calendario, Stats, Login, Perfil, Admin, Soporte } from "./pages";

export default function App() {
  const { user, loading: authLoading, logout, updateProfile } = useAuth();
  
  const [view, setView] = useState("inicio");
  const [materias,      setMaterias]      = useState([]);
  const [tareas,        setTareas]        = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [modal, setModal] = useState(null);
  const [form,  setForm]  = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, t, r] = await Promise.all([
        subjectsApi.getAll(),
        tasksApi.getAll(),
        remindersApi.getAll()
      ]);
      setMaterias(m);
      setTareas(t);
      setRecordatorios(r);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;
  if (!user) return <Login />;
  if (loading) return <div className="login-container"><div className="login-title">Cargando...</div></div>;

  const openModal  = (type, data = {}) => { setModal(type); setForm(data); };
  const closeModal = () => { setModal(null); setForm({}); };

  // ── Helpers de color ─────────────────────────────────────────────────────
  const getM       = id => materias.find(x => x.id === id);
  const getMColor  = id => { const m = getM(id); return m ? COLORS[m.colorIdx % COLORS.length]     : "#888"; };
  const getMBg     = id => { const m = getM(id); return m ? COLOR_BG[m.colorIdx % COLORS.length]   : "#1e1e2c"; };
  const getMText   = id => { const m = getM(id); return m ? COLOR_TEXT[m.colorIdx % COLORS.length] : "#8888b0"; };
  const getMNombre = id => getM(id)?.nombre || "Sin materia";

  // ── CRUD Materias ─────────────────────────────────────────────────────────
  const saveMateria = async () => {
    if (!form.nombre?.trim()) return;
    try {
      if (form.id) {
        const updated = await subjectsApi.update(form.id, form);
        setMaterias(m => m.map(x => x.id === form.id ? updated : x));
      } else {
        const colorIdx = form.colorIdx !== undefined ? form.colorIdx : materias.length % COLORS.length;
        const created = await subjectsApi.create({ ...form, colorIdx });
        setMaterias(m => [created, ...m]);
      }
      closeModal();
    } catch (err) { alert(err.message); }
  };

  const delMateria = async id => {
    const m = materias.find(x => x.id === id);
    const tareasAsociadas = tareas.filter(t => t.materiaId === id).length;
    const msg = tareasAsociadas > 0
      ? `¿Eliminar la materia "${m?.nombre}"?\n\nEsto también borrará ${tareasAsociadas} tarea(s) asociada(s). Esta acción no se puede deshacer.`
      : `¿Eliminar la materia "${m?.nombre}"? Esta acción no se puede deshacer.`;
    if (!window.confirm(msg)) return;
    
    try {
      await subjectsApi.remove(id);
      setMaterias(prev => prev.filter(x => x.id !== id));
      setTareas(prev => prev.filter(x => x.materiaId !== id));
    } catch (err) { alert(err.message); }
  };

  // ── CRUD Horarios ─────────────────────────────────────────────────────────
  const addHorario = async (materiaId, hf) => {
    try {
      const added = await subjectsApi.addSchedule(materiaId, hf);
      setMaterias(m => m.map(x => x.id === materiaId ? { ...x, horarios: [...(x.horarios || []), added] } : x));
    } catch (err) { alert(err.message); }
  };

  const delHorario = async (materiaId, scheduleId) => {
    try {
      await subjectsApi.removeSchedule(materiaId, scheduleId);
      setMaterias(m => m.map(x => x.id === materiaId ? { ...x, horarios: x.horarios.filter(h => h.id !== scheduleId) } : x));
    } catch (err) { alert(err.message); }
  };

  // ── CRUD Tareas ───────────────────────────────────────────────────────────
  const saveTarea = async () => {
    if (!form.titulo?.trim()) return;
    try {
      if (form.id) {
        const updated = await tasksApi.update(form.id, form);
        setTareas(t => t.map(x => x.id === form.id ? updated : x));
      } else {
        const created = await tasksApi.create({ ...form, estado: form.estado || "pendiente" });
        setTareas(t => [created, ...t]);
      }
      closeModal();
    } catch (err) { alert(err.message); }
  };

  const delTarea = async id => {
    const t = tareas.find(x => x.id === id);
    if (!window.confirm(`¿Eliminar la tarea "${t?.titulo}"? Esta acción no se puede deshacer.`)) return;
    try {
      await tasksApi.remove(id);
      setTareas(prev => prev.filter(x => x.id !== id));
    } catch (err) { alert(err.message); }
  };

  const setEstado = async (id, estado) => {
    try {
      await tasksApi.updateStatus(id, estado);
      setTareas(t => t.map(x => x.id === id ? { ...x, estado } : x));
    } catch (err) { alert(err.message); }
  };

  // ── CRUD Recordatorios ────────────────────────────────────────────────────
  const saveRecordatorio = async () => {
    if (!form.titulo?.trim() || !form.fecha) return;
    try {
      if (form.id) {
        const updated = await remindersApi.update(form.id, form);
        setRecordatorios(r => r.map(x => x.id === form.id ? updated : x));
      } else {
        const created = await remindersApi.create(form);
        setRecordatorios(r => [...r, created]);
      }
      closeModal();
    } catch (err) { alert(err.message); }
  };

  const delRecordatorio = async id => {
    const r = recordatorios.find(x => x.id === id);
    if (!window.confirm(`¿Eliminar el recordatorio "${r?.titulo}"?`)) return;
    try {
      await remindersApi.remove(id);
      setRecordatorios(prev => prev.filter(x => x.id !== id));
    } catch (err) { alert(err.message); }
  };

  // Adapting the horariodelete method to pass schedule id instead of index
  const adaptedDelHorario = (materiaId, idx) => {
    const m = materias.find(x => x.id === materiaId);
    if (m && m.horarios && m.horarios[idx]) {
      delHorario(materiaId, m.horarios[idx].id);
    }
  };

  return (
    <>
      <div className="app-layout">
        <Sidebar view={view} setView={setView} tareas={tareas} />
        <main className="main-content">
          {view === "inicio"     && <Inicio     tareas={tareas} materias={materias} recordatorios={recordatorios} getMNombre={getMNombre} getMBg={getMBg} getMText={getMText} setEstado={setEstado} user={user} goToProfile={() => setView("perfil")} goToAdmin={() => setView("admin")} logout={logout} />}
          {view === "materias"   && <Materias   materias={materias} tareas={tareas} onNew={() => openModal("materia", { horarios: [] })} onEdit={m => openModal("materia", { ...m })} onDelete={delMateria} />}
          {view === "horarios"   && <Horarios   materias={materias} onAddHorario={addHorario} onDelHorario={adaptedDelHorario} />}
          {view === "tareas"     && <Tareas     tareas={tareas} materias={materias} getMNombre={getMNombre} getMBg={getMBg} getMText={getMText} setEstado={setEstado} onNew={() => openModal("tarea", { prioridad: "media", estado: "pendiente" })} onEdit={t => openModal("tarea", { ...t })} onDelete={delTarea} />}
          {view === "calendario" && <Calendario tareas={tareas} recordatorios={recordatorios} getMColor={getMColor} getMBg={getMBg} getMText={getMText} getMNombre={getMNombre} onNewRecordatorio={data => openModal("recordatorio", data)} onEditRecordatorio={r => openModal("recordatorio", { ...r })} onDelRecordatorio={delRecordatorio} />}
          {view === "stats"      && <Stats      tareas={tareas} materias={materias} getMColor={getMColor} getMNombre={getMNombre} />}
          {view === "soporte"    && <Soporte />}
          {view === "perfil"     && <Perfil     user={user} logout={logout} updateProfile={updateProfile} />}
          {view === "admin"      && <Admin      user={user} />}
          

        </main>
      </div>

      {modal === "materia"      && <MateriaModal      form={form} setForm={setForm} onSave={saveMateria}      onClose={closeModal} />}
      {modal === "tarea"        && <TareaModal        form={form} setForm={setForm} materias={materias} onSave={saveTarea}        onClose={closeModal} />}
      {modal === "recordatorio" && <RecordatorioModal form={form} setForm={setForm} onSave={saveRecordatorio} onClose={closeModal} />}
    </>
  );
}