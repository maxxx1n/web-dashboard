/**
 * Wrapper para manejar errores async en controllers.
 * Evita repetir try/catch en cada endpoint.
 */
function errorHandler(err, req, res, _next) {
  // Log full error for diagnostics (stack included when available)
  console.error("Error:", err && err.stack ? err.stack : err);
  const status = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";
  const safeMessage = isProd ? "Error interno del servidor" : (err.message || "Error interno del servidor");
  res.status(status).json({ error: safeMessage });
}

export default errorHandler;
