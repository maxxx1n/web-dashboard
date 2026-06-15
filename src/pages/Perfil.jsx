import { useState } from "react";
import { LogOut, User as UserIcon, Mail } from "lucide-react";

export default function Perfil({ user, logout, updateProfile }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleSubmit = async (e, skipConfirm = false) => {
    if (e) e.preventDefault();
    
    const data = {};
    if (name !== user?.name) data.name = name;
    if (email !== user?.email) data.email = email;
    if (password) data.password = password;

    if (Object.keys(data).length === 0) {
      return alert("No hay cambios para guardar");
    }

    if (!skipConfirm) {
      if (data.email && data.password) {
        setConfirmAction({
          title: "Cambios Críticos",
          message: "Estás a punto de cambiar tu correo electrónico y tu contraseña. ¿Deseas continuar?",
          onConfirm: () => { setConfirmAction(null); handleSubmit(null, true); }
        });
        return;
      } else if (data.email) {
        setConfirmAction({
          title: "Cambiar Correo",
          message: "Estás a punto de cambiar tu correo electrónico. ¿Deseas continuar?",
          onConfirm: () => { setConfirmAction(null); handleSubmit(null, true); }
        });
        return;
      } else if (data.password) {
        setConfirmAction({
          title: "Cambiar Contraseña",
          message: "Estás a punto de cambiar tu contraseña. ¿Deseas continuar?",
          onConfirm: () => { setConfirmAction(null); handleSubmit(null, true); }
        });
        return;
      }
    }

    setLoading(true);
    try {
      await updateProfile(data);
      setPassword("");
      alert("Perfil actualizado correctamente");
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

      {confirmAction && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "400px", textAlign: "center", padding: "32px 24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 className="modal-header" style={{ fontSize: "18px" }}>{confirmAction.title}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px", marginBottom: "24px" }}>
              {confirmAction.message}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className="btn-ghost" onClick={() => setConfirmAction(null)}>Cancelar</button>
              <button className="btn-primary" style={{ background: "var(--accent)" }} onClick={confirmAction.onConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
