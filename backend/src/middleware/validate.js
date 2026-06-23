/**
 * Utilidades de validación reutilizables.
 * No se usa librería externa — validadores simples y explícitos.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/** Valida formato de email. */
export function isValidEmail(v) {
  return typeof v === "string" && EMAIL_RE.test(v);
}

/** Valida que un string no exceda maxLen y opcionalmente no esté vacío. */
export function isValidString(v, { maxLen = 255, required = false } = {}) {
  if (v === undefined || v === null) return !required;
  if (typeof v !== "string") return false;
  if (required && !v.trim()) return false;
  return v.length <= maxLen;
}

/** Valida que un valor esté en una whitelist. */
export function isInWhitelist(v, allowed) {
  return allowed.includes(v);
}

/** Valida entero en rango [min, max]. */
export function isValidInt(v, { min = -Infinity, max = Infinity, required = false } = {}) {
  if (v === undefined || v === null) return !required;
  if (!Number.isInteger(v)) return false;
  return v >= min && v <= max;
}

/** Valida formato de fecha YYYY-MM-DD. */
export function isValidDate(v, { required = false } = {}) {
  if (v === undefined || v === null) return !required;
  return typeof v === "string" && DATE_RE.test(v);
}

/** Valida formato de hora HH:mm. */
export function isValidTime(v, { required = false } = {}) {
  if (v === undefined || v === null) return !required;
  return typeof v === "string" && TIME_RE.test(v);
}

/** Helper: responde 400 con mensaje. */
export function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

// ── Whitelists compartidas ──────────────────────────────────
export const ALLOWED_ROLES = ["Usuario", "Administrador"];
export const ALLOWED_STATUSES = ["Activo", "Inactivo"];
export const ALLOWED_PRIORITIES = ["alta", "media", "baja"];
export const ALLOWED_TASK_STATUSES = ["pendiente", "progreso", "hecha"];
export const ALLOWED_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
