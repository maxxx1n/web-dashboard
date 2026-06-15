import "dotenv/config";
import express from "express";
import cors from "cors";
import authMiddleware from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

// Rutas
import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subjects.js";
import taskRoutes from "./routes/tasks.js";
import reminderRoutes from "./routes/reminders.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware global ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas públicas ─────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Rutas protegidas ───────────────────────────────────────
app.use("/api/subjects",  authMiddleware, subjectRoutes);
app.use("/api/tasks",     authMiddleware, taskRoutes);
app.use("/api/reminders", authMiddleware, reminderRoutes);

// ── Health check ───────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Error handler ──────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
