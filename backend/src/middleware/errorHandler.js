/**
 * Wrapper para manejar errores async en controllers.
 * Evita repetir try/catch en cada endpoint.
 */
function errorHandler(err, req, res, _next) {
  console.error("Error:", err.message);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || "Error interno del servidor" });
}

module.exports = errorHandler;
