import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authMiddleware from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

// Rutas
import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subjects.js";
import taskRoutes from "./routes/tasks.js";
import reminderRoutes from "./routes/reminders.js";
import userRoutes from "./routes/users.js";
import supportRoutes from "./routes/support.js";

// Validate required environment variables early to fail fast in misconfigured environments
const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
for (const v of requiredEnv) {
  if (!process.env[v]) {
    console.error(`FATAL: environment variable ${v} is required but not set`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware global ──────────────────────────────────────

// Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
app.use(helmet());

// CORS: whitelist from CORS_ORIGIN env variable
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (server-to-server, curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);

      // Permitir IPs de red local para testing desde móviles
      if (
        /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(
          origin,
        )
      ) {
        return cb(null, true);
      }

      cb(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);

// Body parser with size limit to prevent payload DoS
app.use(express.json({ limit: "100kb" }));

// ── Rate limiters ──────────────────────────────────────────

// Global: 200 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones, intenta más tarde." },
});
app.use(globalLimiter);

// Strict limiter for auth endpoints: 15 requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos de autenticación, intenta más tarde.",
  },
});

// ── Rutas públicas ─────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);

// ── Rutas protegidas ───────────────────────────────────────
app.use("/api/subjects", authMiddleware, subjectRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/reminders", authMiddleware, reminderRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/support", authMiddleware, supportRoutes);

// ── Health check ───────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Error handler ──────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
