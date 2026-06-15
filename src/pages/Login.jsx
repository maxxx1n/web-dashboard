import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.name);
        setIsLogin(true);
        alert("Cuenta creada exitosamente. Por favor, inicia sesion.");
      }
    } catch (err) {
      setError(err.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          {/* Floating particles */}
          <div className="login-particles">
            <span className="particle p1">+</span>
            <span className="particle p2">△</span>
            <span className="particle p3">○</span>
            <span className="particle p4">□</span>
            <span className="particle p5">◇</span>
            <span className="particle p6">+</span>
          </div>

          <div className="login-brand-badge">Organizador de Estudio</div>

          <h2 className="login-brand-title">
            Tu espacio de estudio,<br />
            <span className="login-brand-highlight">organizado y eficiente.</span>
          </h2>

          <p className="login-brand-desc">
            Gestioná materias, tareas y horarios en un solo lugar.
            Mantené el control de tu rendimiento académico.
          </p>

          {/* Illustration */}
          <div className="login-illustration">
            <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Desk */}
              <rect x="40" y="140" width="240" height="8" rx="4" fill="rgba(139,124,247,0.15)" />
              
              {/* Book stack */}
              <rect x="60" y="108" width="50" height="12" rx="3" fill="#8b7cf7" opacity="0.7">
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite"/>
              </rect>
              <rect x="55" y="96" width="55" height="12" rx="3" fill="#60a5fa" opacity="0.6">
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" begin="0.2s" repeatCount="indefinite"/>
              </rect>
              <rect x="58" y="84" width="48" height="12" rx="3" fill="#34d399" opacity="0.6">
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" begin="0.4s" repeatCount="indefinite"/>
              </rect>

              {/* Monitor */}
              <rect x="140" y="60" width="120" height="80" rx="8" fill="rgba(139,124,247,0.08)" stroke="rgba(139,124,247,0.3)" strokeWidth="2"/>
              <rect x="190" y="140" width="20" height="12" rx="2" fill="rgba(139,124,247,0.15)"/>
              
              {/* Screen content - progress bars */}
              <rect x="155" y="78" width="90" height="6" rx="3" fill="rgba(139,124,247,0.12)"/>
              <rect x="155" y="78" width="65" height="6" rx="3" fill="#8b7cf7" opacity="0.6">
                <animate attributeName="width" values="20;65;20" dur="4s" repeatCount="indefinite"/>
              </rect>
              
              <rect x="155" y="92" width="90" height="6" rx="3" fill="rgba(96,165,250,0.12)"/>
              <rect x="155" y="92" width="45" height="6" rx="3" fill="#60a5fa" opacity="0.6">
                <animate attributeName="width" values="10;45;10" dur="4s" begin="0.5s" repeatCount="indefinite"/>
              </rect>
              
              <rect x="155" y="106" width="90" height="6" rx="3" fill="rgba(52,211,153,0.12)"/>
              <rect x="155" y="106" width="75" height="6" rx="3" fill="#34d399" opacity="0.6">
                <animate attributeName="width" values="30;75;30" dur="4s" begin="1s" repeatCount="indefinite"/>
              </rect>

              {/* Checkmark */}
              <circle cx="162" cy="125" r="5" fill="rgba(52,211,153,0.2)"/>
              <path d="M159 125 L161 127 L165 123" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
              
              <text x="170" y="127" fill="rgba(139,124,247,0.4)" fontSize="7" fontFamily="Inter">3 materias</text>

              {/* Floating elements */}
              <circle cx="280" cy="50" r="12" fill="rgba(139,124,247,0.08)" stroke="rgba(139,124,247,0.2)" strokeWidth="1">
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="5s" repeatCount="indefinite"/>
              </circle>
              <text x="276" y="54" fill="rgba(139,124,247,0.5)" fontSize="12">A</text>

              <circle cx="40" cy="70" r="10" fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.2)" strokeWidth="1">
                <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="4s" repeatCount="indefinite"/>
              </circle>
              <text x="36" y="74" fill="rgba(96,165,250,0.5)" fontSize="10">✓</text>
            </svg>
          </div>

          <div className="login-brand-features">
            <div className="login-feature">
              <span className="login-feature-icon">✦</span>
              <span>Materias y horarios</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">✦</span>
              <span>Seguimiento de tareas</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">✦</span>
              <span>Estadisticas de progreso</span>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          <span>Hecho para estudiantes</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <div className="login-form-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="url(#logoGrad)"/>
                <path d="M8 14L12 18L20 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stopColor="#8b7cf7"/>
                    <stop offset="1" stopColor="#6c5ce7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login-form-title">
              {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
            </h1>
            <p className="login-form-subtitle">
              {isLogin
                ? "Ingresa tus credenciales para continuar"
                : "Registrate para comenzar a organizar tu estudio"}
            </p>
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab ${isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(true); setError(""); }}
            >
              Iniciar sesion
            </button>
            <button
              className={`login-tab ${!isLogin ? "active" : ""}`}
              onClick={() => { setIsLogin(false); setError(""); }}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink: 0}}>
                <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="login-field">
                <label htmlFor="login-name">Nombre</label>
                <div className="login-input-wrap">
                  <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 10-16 0"/>
                  </svg>
                  <input
                    id="login-name"
                    type="text"
                    className="login-input"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 7L2 7"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  id="login-password"
                  type="password"
                  className="login-input"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : null}
              {loading ? "Procesando..." : (isLogin ? "Iniciar sesion" : "Crear cuenta")}
            </button>
          </form>

          <p className="login-form-footer">
            {isLogin ? "No tenes cuenta? " : "Ya tenes cuenta? "}
            <button
              type="button"
              className="login-link"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
            >
              {isLogin ? "Registrate" : "Inicia sesion"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
