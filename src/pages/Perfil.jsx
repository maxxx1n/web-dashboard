import { useState } from "react";
import { LogOut, User as UserIcon, Mail } from "lucide-react";

export default function Perfil({ user, logout, updateProfile }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {};
      if (name !== user?.name) data.name = name;
      if (email !== user?.email) data.email = email;
      if (password) data.password = password;

      if (Object.keys(data).length > 0) {
        await updateProfile(data);
        setPassword("");
        alert("Perfil actualizado correctamente");
      } else {
        alert("No hay cambios para guardar");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mi Perfil</h1>
          <p className="page-subtitle">Gestiona tu cuenta y opciones de sesión</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Información de Cuenta</div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--accent-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", border: "1px solid var(--accent-glow)" }}>
              <UserIcon size={32} />
            </div>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "700" }}>{user?.name || "Estudiante"}</div>
              <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", marginTop: "4px" }}>
                <Mail size={14} /> {user?.email || "correo@ejemplo.com"}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginTop: "20px" }}>
            <button 
              className="btn-primary btn-danger" 
              onClick={logout}
              style={{ width: "100%", justifyContent: "center", background: "var(--danger)", color: "#fff" }}
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="section-title">Editar Perfil</div>
          <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Nombre Completo</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "8px", color: "var(--text)", width: "100%", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Correo Electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "8px", color: "var(--text)", width: "100%", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Nueva Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Dejar en blanco para no cambiar" style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "8px", color: "var(--text)", width: "100%", outline: "none" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "10px 20px" }}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
