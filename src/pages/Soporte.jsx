import { useState } from "react";
import { MessageSquare, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { supportApi } from "../services/api";

export default function Soporte() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setStatus("loading");
    try {
      await supportApi.create({ subject, description });
      setStatus("success");
      setSubject("");
      setDescription("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "Error al enviar el reporte");
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Soporte Técnico</h1>
          <p className="page-subtitle">Reporta un problema o envíanos tus sugerencias</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={18} />
            Crear Ticket
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Asunto</label>
              <input 
                type="text" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                placeholder="Ej. Problema al guardar tarea"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "8px", color: "var(--text)", width: "100%", outline: "none" }} 
                required
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>Descripción detallada</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Describe el problema paso a paso..."
                rows={5}
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: "8px", color: "var(--text)", width: "100%", outline: "none", resize: "vertical", fontFamily: "inherit" }} 
                required
              />
            </div>

            {status === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", background: "var(--danger-bg)", color: "var(--danger)", borderRadius: "8px", fontSize: "13px" }}>
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}

            {status === "success" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", background: "var(--success-bg)", color: "var(--success)", borderRadius: "8px", fontSize: "13px" }}>
                <CheckCircle2 size={16} />
                Reporte enviado correctamente. Te contactaremos pronto.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={status === "loading" || !subject || !description} 
                style={{ padding: "10px 20px" }}
              >
                {status === "loading" ? "Enviando..." : (
                  <>
                    <Send size={16} />
                    Enviar Reporte
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ height: "fit-content" }}>
          <div className="section-title">Información Útil</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
            Si experimentas algún error crítico en la plataforma, por favor proporciónanos la mayor cantidad de detalles posible:
          </p>
          <ul style={{ color: "var(--text-muted)", fontSize: "13px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>¿Qué acción intentabas realizar?</li>
            <li>¿En qué sección de la aplicación ocurrió?</li>
            <li>Si hubo un mensaje de error, ¿qué decía?</li>
          </ul>
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <span className="badge" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>Tiempo de respuesta estimado: 24-48 hs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
