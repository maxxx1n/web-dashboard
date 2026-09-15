import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { ConfirmModal } from "../components/modals/Modals";

export default function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Password recovery state
  // resetStep: null = normal login, "email" = enter email, "code" = enter code + new password
  const [resetStep, setResetStep] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");

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
        setConfirmAction({
          title: "Éxito",
          message: "Cuenta creada exitosamente. Por favor, inicia sesión.",
          isAlert: true,
        });
      }
    } catch (err) {
      setError(err.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (resetStep === "email") {
        await authApi.forgotPassword(resetEmail);
        setResetStep("code");
        setConfirmAction({
          title: "Código enviado",
          message:
            "Si el email está registrado, recibirás un código de 6 dígitos. Revisá tu bandeja de entrada y spam.",
          isAlert: true,
        });
      } else if (resetStep === "code") {
        if (resetPassword !== resetPasswordConfirm) {
          setError("Las contraseñas no coinciden");
          setLoading(false);
          return;
        }
        await authApi.resetPassword(resetEmail, resetCode, resetPassword);
        setConfirmAction({
          title: "Contraseña actualizada",
          message:
            "Tu contraseña fue restablecida exitosamente. Ya podés iniciar sesión.",
          isAlert: true,
        });
        exitReset();
      }
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const enterReset = () => {
    setResetStep("email");
    setResetEmail("");
    setResetCode("");
    setResetPassword("");
    setResetPasswordConfirm("");
    setError("");
  };

  const exitReset = () => {
    setResetStep(null);
    setResetEmail("");
    setResetCode("");
    setResetPassword("");
    setResetPasswordConfirm("");
    setError("");
  };

  // ── Render forgot password form ──────────────────────────────
  const renderResetForm = () => (
    <>
      <div className="login-form-header">
        <div className="login-form-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#logoGrad2)" />
            <path
              d="M14 7v6M14 17v1M10 11a4 4 0 118 0v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2z"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <defs>
              <linearGradient id="logoGrad2" x1="0" y1="0" x2="28" y2="28">
                <stop stopColor="#8b7cf7" />
                <stop offset="1" stopColor="#6c5ce7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="login-form-title">
          {resetStep === "email" ? "Recuperar contraseña" : "Ingresá el código"}
        </h1>
        <p className="login-form-subtitle">
          {resetStep === "email"
            ? "Ingresá tu email y te enviaremos un código de recuperación"
            : "Revisá tu email e ingresá el código de 6 dígitos junto con tu nueva contraseña"}
        </p>
      </div>

      {error && (
        <div className="login-error">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5" />
            <path
              d="M8 5v3.5M8 10.5v.5"
              stroke="#f87171"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleForgotSubmit} className="login-form">
        {resetStep === "email" && (
          <div className="login-field">
            <label htmlFor="reset-email">Email</label>
            <div className="login-input-wrap">
              <svg
                className="login-input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <input
                id="reset-email"
                type="email"
                className="login-input"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                autoFocus
              />
            </div>
          </div>
        )}

        {resetStep === "code" && (
          <>
            <div className="login-field">
              <label htmlFor="reset-code">Código de verificación</label>
              <div className="login-input-wrap">
                <svg
                  className="login-input-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                  <circle cx="12" cy="16" r="1" />
                </svg>
                <input
                  id="reset-code"
                  type="text"
                  className="login-input login-input-code"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) =>
                    setResetCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="reset-new-password">Nueva contraseña</label>
              <div className="login-input-wrap">
                <svg
                  className="login-input-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="reset-new-password"
                  type="password"
                  className="login-input"
                  required
                  minLength={6}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="reset-confirm-password">
                Confirmar contraseña
              </label>
              <div className="login-input-wrap">
                <svg
                  className="login-input-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <input
                  id="reset-confirm-password"
                  type="password"
                  className="login-input"
                  required
                  minLength={6}
                  value={resetPasswordConfirm}
                  onChange={(e) => setResetPasswordConfirm(e.target.value)}
                  placeholder="Repetí tu contraseña"
                />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? <span className="login-spinner" /> : null}
          {loading
            ? "Procesando..."
            : resetStep === "email"
              ? "Enviar código"
              : "Restablecer contraseña"}
        </button>
      </form>

      <p className="login-form-footer">
        <button type="button" className="login-link" onClick={exitReset}>
          ← Volver al inicio de sesión
        </button>
      </p>

      {resetStep === "code" && (
        <p className="login-form-footer" style={{ marginTop: 8 }}>
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
            No recibiste el código?{" "}
          </span>
          <button
            type="button"
            className="login-link"
            style={{ fontSize: 12 }}
            onClick={() => {
              setResetStep("email");
              setError("");
            }}
          >
            Reenviar
          </button>
        </p>
      )}
    </>
  );

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-brand-panel">
        {/* Tech grid overlay */}
        <div className="login-grid-overlay" />

        {/* Animated gradient orbs */}
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />

        <div className="login-brand-content">
          <div className="login-brand-badge">
            <span className="login-badge-dot" />
            Organizador de Estudio
          </div>

          <h2 className="login-brand-title">
            Tu espacio de estudio,
            <br />
            <span className="login-brand-highlight">
              organizado y eficiente.
            </span>
          </h2>

          <p className="login-brand-desc">
            Gestioná materias, tareas y horarios en un solo lugar. Mantené el
            control de tu rendimiento académico.
          </p>

          {/* Tech Network Illustration */}
          <div className="login-illustration">
            <svg
              viewBox="0 0 400 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="nodeGlow1" cx="50%" cy="50%" r="50%">
                  <stop stopColor="#8b7cf7" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#8b7cf7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeGlow2" cx="50%" cy="50%" r="50%">
                  <stop stopColor="#60a5fa" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeGlow3" cx="50%" cy="50%" r="50%">
                  <stop stopColor="#34d399" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#34d399" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop stopColor="#8b7cf7" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#8b7cf7" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#8b7cf7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="line2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop stopColor="#60a5fa" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#60a5fa" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
                </linearGradient>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connection lines */}
              <line x1="80" y1="90" x2="200" y2="130" stroke="url(#line1)" strokeWidth="1">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="200" y1="130" x2="320" y2="80" stroke="url(#line1)" strokeWidth="1">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" begin="0.5s" repeatCount="indefinite" />
              </line>
              <line x1="200" y1="130" x2="140" y2="200" stroke="url(#line2)" strokeWidth="1">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="200" y1="130" x2="280" y2="200" stroke="url(#line2)" strokeWidth="1">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" begin="1s" repeatCount="indefinite" />
              </line>
              <line x1="80" y1="90" x2="140" y2="200" stroke="url(#line1)" strokeWidth="0.8">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
              </line>
              <line x1="320" y1="80" x2="280" y2="200" stroke="url(#line1)" strokeWidth="0.8">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" begin="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="140" y1="200" x2="280" y2="200" stroke="url(#line2)" strokeWidth="0.8">
                <animate attributeName="opacity" values="0.15;0.4;0.15" dur="4.5s" repeatCount="indefinite" />
              </line>

              {/* Data pulse along lines */}
              <circle r="2" fill="#8b7cf7" opacity="0.8" filter="url(#softGlow)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M80,90 L200,130 L320,80" />
              </circle>
              <circle r="2" fill="#60a5fa" opacity="0.8" filter="url(#softGlow)">
                <animateMotion dur="4s" repeatCount="indefinite" begin="1s" path="M200,130 L140,200 L280,200" />
              </circle>
              <circle r="1.5" fill="#34d399" opacity="0.7" filter="url(#softGlow)">
                <animateMotion dur="5s" repeatCount="indefinite" begin="2s" path="M320,80 L200,130 L80,90" />
              </circle>

              {/* Central node - main hub */}
              <circle cx="200" cy="130" r="28" fill="url(#nodeGlow1)" opacity="0.5">
                <animate attributeName="r" values="28;34;28" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="130" r="14" fill="rgba(139,124,247,0.12)" stroke="#8b7cf7" strokeWidth="1.5">
                <animate attributeName="r" values="14;16;14" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="130" r="4" fill="#8b7cf7" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Orbital ring around center */}
              <circle cx="200" cy="130" r="22" fill="none" stroke="rgba(139,124,247,0.15)" strokeWidth="0.5" strokeDasharray="3 4">
                <animateTransform attributeName="transform" type="rotate" from="0 200 130" to="360 200 130" dur="20s" repeatCount="indefinite" />
              </circle>

              {/* Node - top left (Materias) */}
              <circle cx="80" cy="90" r="20" fill="url(#nodeGlow2)" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="90" r="10" fill="rgba(96,165,250,0.1)" stroke="#60a5fa" strokeWidth="1.2" />
              <circle cx="80" cy="90" r="3" fill="#60a5fa" opacity="0.8" />
              {/* Icon inside - book */}
              <path d="M75 87 L80 87 L80 93 L77.5 91 L75 93Z" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.7" />

              {/* Node - top right (Tareas) */}
              <circle cx="320" cy="80" r="20" fill="url(#nodeGlow3)" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="5s" begin="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="320" cy="80" r="10" fill="rgba(52,211,153,0.1)" stroke="#34d399" strokeWidth="1.2" />
              <circle cx="320" cy="80" r="3" fill="#34d399" opacity="0.8" />
              {/* Icon inside - check */}
              <path d="M316 80 L319 83 L324 77" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />

              {/* Node - bottom left (Calendario) */}
              <circle cx="140" cy="200" r="18" fill="url(#nodeGlow2)" opacity="0.3">
                <animate attributeName="r" values="18;23;18" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="140" cy="200" r="9" fill="rgba(96,165,250,0.08)" stroke="#60a5fa" strokeWidth="1" opacity="0.8" />
              <circle cx="140" cy="200" r="2.5" fill="#60a5fa" opacity="0.7" />

              {/* Node - bottom right (Stats) */}
              <circle cx="280" cy="200" r="18" fill="url(#nodeGlow1)" opacity="0.3">
                <animate attributeName="r" values="18;23;18" dur="6s" begin="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="280" cy="200" r="9" fill="rgba(139,124,247,0.08)" stroke="#8b7cf7" strokeWidth="1" opacity="0.8" />
              <circle cx="280" cy="200" r="2.5" fill="#8b7cf7" opacity="0.7" />

              {/* Small floating satellites */}
              <circle cx="50" cy="50" r="3" fill="rgba(139,124,247,0.3)" stroke="rgba(139,124,247,0.2)" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="translate" values="0,0;5,-8;0,0" dur="7s" repeatCount="indefinite" />
              </circle>
              <circle cx="350" cy="170" r="2.5" fill="rgba(52,211,153,0.3)" stroke="rgba(52,211,153,0.2)" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="translate" values="0,0;-4,6;0,0" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="40" r="2" fill="rgba(96,165,250,0.3)">
                <animateTransform attributeName="transform" type="translate" values="0,0;8,3;0,0" dur="8s" repeatCount="indefinite" />
              </circle>
              <circle cx="340" cy="240" r="2" fill="rgba(139,124,247,0.2)">
                <animateTransform attributeName="transform" type="translate" values="0,0;-6,-4;0,0" dur="9s" repeatCount="indefinite" />
              </circle>

              {/* Labels */}
              <text x="80" y="115" fill="rgba(96,165,250,0.5)" fontSize="8" fontFamily="Inter" textAnchor="middle" fontWeight="500">Materias</text>
              <text x="320" y="105" fill="rgba(52,211,153,0.5)" fontSize="8" fontFamily="Inter" textAnchor="middle" fontWeight="500">Tareas</text>
              <text x="140" y="225" fill="rgba(96,165,250,0.4)" fontSize="8" fontFamily="Inter" textAnchor="middle" fontWeight="500">Calendario</text>
              <text x="280" y="225" fill="rgba(139,124,247,0.4)" fontSize="8" fontFamily="Inter" textAnchor="middle" fontWeight="500">Progreso</text>
              <text x="200" y="162" fill="rgba(139,124,247,0.5)" fontSize="9" fontFamily="Inter" textAnchor="middle" fontWeight="600">Hub</text>
            </svg>
          </div>

          <div className="login-brand-features">
            <div className="login-feature">
              <span className="login-feature-dot" style={{ background: '#60a5fa' }} />
              <span>Materias y horarios</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-dot" style={{ background: '#34d399' }} />
              <span>Seguimiento de tareas</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-dot" style={{ background: '#8b7cf7' }} />
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
          {resetStep ? (
            renderResetForm()
          ) : (
            <>
              <div className="login-form-header">
                <div className="login-form-logo">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
                    <path
                      d="M8 14L12 18L20 10"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="logoGrad"
                        x1="0"
                        y1="0"
                        x2="28"
                        y2="28"
                      >
                        <stop stopColor="#8b7cf7" />
                        <stop offset="1" stopColor="#6c5ce7" />
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
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                >
                  Iniciar sesion
                </button>
                <button
                  className={`login-tab ${!isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                >
                  Registrarse
                </button>
              </div>

              {error && (
                <div className="login-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="#f87171"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 5v3.5M8 10.5v.5"
                      stroke="#f87171"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                {!isLogin && (
                  <div className="login-field">
                    <label htmlFor="login-name">Nombre</label>
                    <div className="login-input-wrap">
                      <svg
                        className="login-input-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M20 21a8 8 0 10-16 0" />
                      </svg>
                      <input
                        id="login-name"
                        type="text"
                        className="login-input"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>
                )}

                <div className="login-field">
                  <label htmlFor="login-email">Email</label>
                  <div className="login-input-wrap">
                    <svg
                      className="login-input-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                    <input
                      id="login-email"
                      type="email"
                      className="login-input"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="login-password">Contraseña</label>
                  <div className="login-input-wrap">
                    <svg
                      className="login-input-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <input
                      id="login-password"
                      type="password"
                      className="login-input"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="••••••••"
                    />
                  </div>
                  {isLogin && (
                    <button
                      type="button"
                      className="login-forgot-link"
                      onClick={enterReset}
                    >
                      Olvidaste tu contraseña?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? <span className="login-spinner" /> : null}
                  {loading
                    ? "Procesando..."
                    : isLogin
                      ? "Iniciar sesion"
                      : "Crear cuenta"}
                </button>
              </form>

              <p className="login-form-footer">
                {isLogin ? "No tenes cuenta? " : "Ya tenes cuenta? "}
                <button
                  type="button"
                  className="login-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                >
                  {isLogin ? "Registrate" : "Inicia sesion"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        confirmAction={confirmAction}
        onClose={() => setConfirmAction(null)}
      />
    </div>
  );
}
