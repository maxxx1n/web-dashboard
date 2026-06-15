import { LogOut, User as UserIcon, Mail } from "lucide-react";

export default function Perfil({ user, logout }) {
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
          <div className="section-title">Ajustes Adicionales</div>
          <div className="empty-state" style={{ padding: "32px 10px" }}>
            <div className="empty-state-icon">⚙️</div>
            <div className="empty-state-title">Próximamente</div>
            <div className="empty-state-text">
              Preferencias de notificaciones, cambio de contraseña, temas visuales y más.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
