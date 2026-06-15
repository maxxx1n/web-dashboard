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
      }
    } catch (err) {
      setError(err.message || "Error al autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">S</div>
          <h1 className="login-title">Studydesk</h1>
          <p className="login-subtitle">
            {isLogin ? "Inicia sesión para continuar" : "Crea tu cuenta"}
          </p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${isLogin ? "active" : ""}`} onClick={() => { setIsLogin(true); setError(""); }}>Entrar</button>
          <button className={`login-tab ${!isLogin ? "active" : ""}`} onClick={() => { setIsLogin(false); setError(""); }}>Registrarse</button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="login-field">
              <label>Nombre</label>
              <input type="text" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
            </div>
          )}
          <div className="login-field">
            <label>Email</label>
            <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
          </div>
          <div className="login-field">
            <label>Contraseña</label>
            <input type="password" className="input" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? "Cargando..." : (isLogin ? "Iniciar sesión" : "Crear cuenta")}
          </button>
        </form>
      </div>
    </div>
  );
}
