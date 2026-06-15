require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Rutas
const authRoutes     = require("./routes/auth");
const subjectRoutes  = require("./routes/subjects");
const taskRoutes     = require("./routes/tasks");
const reminderRoutes = require("./routes/reminders");

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
