import { useState } from "react";
import { LogOut, User as UserIcon, Mail, Palette, Moon } from "lucide-react";
import { ConfirmModal } from "../components/modals/Modals";
import { NEON_COLORS, applyTheme, loadTheme } from "../utils/theme";

export default function Perfil({ user, logout, updateProfile }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const initialTheme = loadTheme();
  const [themeMode, setThemeMode] = useState(initialTheme.mode || 'standard');
  const [accentColor, setAccentColor] = useState(initialTheme.accent || '#8b7cf7');

  const handleColorChange = (hex) => {
    setAccentColor(hex);
    applyTheme(hex, themeMode);
  };

  const handleModeChange = (mode) => {
    setThemeMode(mode);
    applyTheme(accentColor, mode);
  };

  const handleSubmit = async (e, skipConfirm = false) => {
    if (e) e.preventDefault();
    
    const data = {};
    if (name !== user?.name) data.name = name;
    if (email !== user?.email) data.email = email;
    if (password) data.password = password;

    if (Object.keys(data).length === 0) {
      return setConfirmAction({ title: "Atención", message: "No hay cambios para guardar", isAlert: true });
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
      setConfirmAction({ title: "Éxito", message: "Perfil actualizado correctamente", isAlert: true });
    } catch (error) {
      setConfirmAction({ title: "Error", message: error.message, isAlert: true, isDanger: true });
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

      <div className="grid-2" style={{ marginTop: "24px" }}>
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}><Palette size={18}/> Personalización Visual</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "16px", display: "block" }}>Color de Acento (RGB Neón)</label>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {NEON_COLORS.map(color => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorChange(color.hex)}
                    title={color.name}
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: color.hex, border: "none", cursor: "pointer",
                      boxShadow: accentColor === color.hex ? `0 0 0 3px var(--bg-surface), 0 0 0 5px ${color.hex}, 0 0 15px ${color.hex}` : "none",
                      transition: "all 0.2s"
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}><Moon size={16}/> Modo Oscuro</label>
              <div style={{ display: "flex", gap: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="radio" name="themeMode" checked={themeMode === 'standard'} onChange={() => handleModeChange('standard')} style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Estándar</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="radio" name="themeMode" checked={themeMode === 'oled'} onChange={() => handleModeChange('oled')} style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }} />
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>OLED (Profundo)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal confirmAction={confirmAction} onClose={() => setConfirmAction(null)} />
    </div>
  );
}
