import { useState, useEffect } from "react";
import { Users, Shield, Trash2, Edit } from "lucide-react";
import { usersApi } from "../services/api";

export default function Admin({ user }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.getAll();
      setUsuarios(data);
    } catch (err) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (id) => {
    if (id === user?.id) return alert("No puedes desactivar tu propio usuario.");
    const u = usuarios.find(x => x.id === id);
    const newEstado = u.estado === "Activo" ? "Inactivo" : "Activo";
    try {
      await usersApi.updateStatus(id, newEstado);
      setUsuarios((prev) => prev.map((x) => x.id === id ? { ...x, estado: newEstado } : x));
    } catch (err) {
      alert(err.message || "Error al actualizar estado");
    }
  };

  const eliminarUsuario = async (id) => {
    if (id === user?.id) return alert("No puedes eliminarte a ti mismo.");
    if (!window.confirm("¿Seguro que deseas eliminar a este usuario?")) return;
    try {
      await usersApi.remove(id);
      setUsuarios((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar usuario");
    }
  };

  const editarUsuario = async (id) => {
    if (id === user?.id) return alert("No puedes editar tu rol desde aquí. Ve a 'Mi Perfil'.");
    const newRol = window.prompt("Escribe el nuevo rol para este usuario ('Administrador' o 'Usuario'):", "Usuario");
    if (newRol === "Administrador" || newRol === "Usuario") {
      try {
        await usersApi.updateRole(id, newRol);
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, rol: newRol } : u));
      } catch (err) {
        alert(err.message || "Error al actualizar rol");
      }
    } else if (newRol) {
      alert("Rol inválido. Debe ser 'Administrador' o 'Usuario'.");
    }
  };

  if (loading) return <div className="page-container"><div className="login-title" style={{ textAlign: "center" }}>Cargando usuarios...</div></div>;

  if (error) return (
    <div className="page-container">
      <div className="card" style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ color: "var(--danger)", fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>Error al cargar usuarios</div>
        <div style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: 16 }}>{error}</div>
        <button className="btn-primary" onClick={loadUsers}>Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <Users size={28} style={{ marginRight: 10 }} />
          Panel de Administración
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: "20px" }}>Gestión de Usuarios</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ffffff20", color: "#8888b0" }}>
                <th style={{ padding: "12px" }}>Nombre</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Rol</th>
                <th style={{ padding: "12px" }}>Estado</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #ffffff10" }}>
                  <td style={{ padding: "12px", color: "#c4c0ff" }}>{u.nombre}</td>
                  <td style={{ padding: "12px" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: u.rol === "Administrador" ? "#2d2b4e" : "#1a2d4e",
                      color: u.rol === "Administrador" ? "#c4c0ff" : "#93c5fd"
                    }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: u.estado === "Activo" ? "#1a3d30" : "#3d1f1f",
                      color: u.estado === "Activo" ? "#6ee7b7" : "#fca5a5",
                      cursor: "pointer"
                    }} onClick={() => toggleEstado(u.id)}>
                      {u.estado}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button className="btn btn-icon" onClick={() => editarUsuario(u.id)}>
                      <Edit size={16} color="#8888b0" />
                    </button>
                    <button className="btn btn-icon" onClick={() => eliminarUsuario(u.id)}>
                      <Trash2 size={16} color="#fca5a5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
