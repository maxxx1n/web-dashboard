const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("auth_token");
}

async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición");
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────
function mapUser(u) {
  return { id: u.id, email: u.email, name: u.name, rol: u.role || "Usuario", estado: u.status || "Activo" };
}

export const authApi = {
  login: async (email, password) => {
    const data = await fetchApi("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    return { token: data.token, user: mapUser(data.user) };
  },
  register: async (email, password, name) => {
    const data = await fetchApi("/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) });
    return { token: data.token, user: mapUser(data.user) };
  },
  me: async () => {
    const data = await fetchApi("/auth/me");
    return mapUser(data);
  },
  updateProfile: async (data) => {
    const res = await fetchApi("/users/me", { method: "PUT", body: JSON.stringify(data) });
    return mapUser(res);
  },
};

// ── Materias (Subjects) ───────────────────────────────────────────
export const subjectsApi = {
  getAll: async () => {
    const subjects = await fetchApi("/subjects");
    return subjects.map(s => ({
      id: s.id,
      nombre: s.name,
      profesor: s.description || "",
      colorIdx: s.colorIdx,
      horarios: (s.schedules || []).map(h => ({
        id: h.id,
        dia: h.day,
        inicio: h.startTime,
        fin: h.endTime,
      })),
    }));
  },
  create: async (data) => {
    const s = await fetchApi("/subjects", {
      method: "POST",
      body: JSON.stringify({
        name: data.nombre,
        description: data.profesor,
        colorIdx: data.colorIdx,
        schedules: (data.horarios || []).map(h => ({
          day: h.dia,
          startTime: h.inicio,
          endTime: h.fin,
        })),
      }),
    });
    return {
      id: s.id,
      nombre: s.name,
      profesor: s.description || "",
      colorIdx: s.colorIdx,
      horarios: (s.schedules || []).map(h => ({
        id: h.id,
        dia: h.day,
        inicio: h.startTime,
        fin: h.endTime,
      })),
    };
  },
  update: async (id, data) => {
    const s = await fetchApi(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.nombre,
        description: data.profesor,
        colorIdx: data.colorIdx,
      }),
    });
    return {
      id: s.id,
      nombre: s.name,
      profesor: s.description || "",
      colorIdx: s.colorIdx,
      horarios: (s.schedules || []).map(h => ({
        id: h.id,
        dia: h.day,
        inicio: h.startTime,
        fin: h.endTime,
      })),
    };
  },
  remove: (id) => fetchApi(`/subjects/${id}`, { method: "DELETE" }),
  addSchedule: async (subjectId, data) => {
    const h = await fetchApi(`/subjects/${subjectId}/schedules`, {
      method: "POST",
      body: JSON.stringify({
        day: data.dia,
        startTime: data.inicio,
        endTime: data.fin,
      }),
    });
    return {
      id: h.id,
      dia: h.day,
      inicio: h.startTime,
      fin: h.endTime,
    };
  },
  removeSchedule: (subjectId, scheduleId) =>
    fetchApi(`/subjects/${subjectId}/schedules/${scheduleId}`, { method: "DELETE" }),
};

// ── Tareas (Tasks) ────────────────────────────────────────────────
export const tasksApi = {
  getAll: async () => {
    const tasks = await fetchApi("/tasks");
    return tasks.map(t => ({
      id: t.id,
      titulo: t.title,
      prioridad: t.priority,
      estado: t.status,
      fecha: t.dueDate || "",
      materiaId: t.subjectId,
    }));
  },
  create: async (data) => {
    const t = await fetchApi("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: data.titulo,
        priority: data.prioridad,
        status: data.estado,
        dueDate: data.fecha || null,
        subjectId: data.materiaId || null,
      }),
    });
    return {
      id: t.id,
      titulo: t.title,
      prioridad: t.priority,
      estado: t.status,
      fecha: t.dueDate || "",
      materiaId: t.subjectId,
    };
  },
  update: async (id, data) => {
    const t = await fetchApi(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: data.titulo,
        priority: data.prioridad,
        status: data.estado,
        dueDate: data.fecha || null,
        subjectId: data.materiaId || null,
      }),
    });
    return {
      id: t.id,
      titulo: t.title,
      prioridad: t.priority,
      estado: t.status,
      fecha: t.dueDate || "",
      materiaId: t.subjectId,
    };
  },
  updateStatus: (id, status) =>
    fetchApi(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (id) => fetchApi(`/tasks/${id}`, { method: "DELETE" }),
};

// ── Recordatorios (Reminders) ─────────────────────────────────────
export const remindersApi = {
  getAll: async () => {
    const rems = await fetchApi("/reminders");
    return rems.map(r => ({
      id: r.id,
      titulo: r.title,
      fecha: r.date,
      hora: r.time || "",
      nota: r.description || "",
    }));
  },
  create: async (data) => {
    const r = await fetchApi("/reminders", {
      method: "POST",
      body: JSON.stringify({
        title: data.titulo,
        date: data.fecha,
        time: data.hora || null,
        description: data.nota || null,
      }),
    });
    return {
      id: r.id,
      titulo: r.title,
      fecha: r.date,
      hora: r.time || "",
      nota: r.description || "",
    };
  },
  update: async (id, data) => {
    const r = await fetchApi(`/reminders/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: data.titulo,
        date: data.fecha,
        time: data.hora || null,
        description: data.nota || null,
      }),
    });
    return {
      id: r.id,
      titulo: r.title,
      fecha: r.date,
      hora: r.time || "",
      nota: r.description || "",
    };
  },
  remove: (id) => fetchApi(`/reminders/${id}`, { method: "DELETE" }),
};

// ── Usuarios (Admin) ──────────────────────────────────────────────
export const usersApi = {
  getAll: async () => {
    const users = await fetchApi("/users");
    return users.map(u => ({
      id: u.id,
      nombre: u.name || "Usuario",
      email: u.email,
      rol: u.role || "Usuario",
      estado: u.status || "Activo"
    }));
  },
  updateRole: (id, rol) =>
    fetchApi(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role: rol }) }),
  updateStatus: (id, estado) =>
    fetchApi(`/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: estado }) }),
  remove: (id) => fetchApi(`/users/${id}`, { method: "DELETE" }),
};

// ── Soporte (Support) ─────────────────────────────────────────────
export const supportApi = {
  create: async (data) => fetchApi("/support", { method: "POST", body: JSON.stringify(data) }),
  getAll: async () => fetchApi("/support"),
};
