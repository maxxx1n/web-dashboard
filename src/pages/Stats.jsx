import { useState } from "react";
import { COLORS, COLOR_BG } from "../config/constants";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

const ACADEMIC_STATUSES = [
  { key: "Cursando", label: "Cursando", color: "#60a5fa", bg: "#1a2d4e" },
  { key: "Regular", label: "Regular", color: "#fbbf24", bg: "#3d2e0a" },
  { key: "Aprobada", label: "Aprobada", color: "#34d399", bg: "#1a3d30" },
  { key: "Libre", label: "Libre", color: "#f87171", bg: "#3d1f1f" },
];

function getStatusStyle(status) {
  return (
    ACADEMIC_STATUSES.find((s) => s.key === status) || ACADEMIC_STATUSES[0]
  );
}

function MateriaGradeCard({
  materia,
  onAddGrade,
  onRemoveGrade,
  onUpdateAcademicStatus,
}) {
  const [expanded, setExpanded] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);

  const ci = materia.colorIdx % COLORS.length;
  const grades = materia.grades || [];
  const statusStyle = getStatusStyle(materia.academicStatus);

  const avg =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(2)
      : "0.00";

  const handleAdd = async () => {
    const val = parseFloat(newValue);
    if (!newLabel.trim() || isNaN(val) || val < 0 || val > 10) return;
    setAdding(true);
    try {
      await onAddGrade(materia.id, { label: newLabel.trim(), value: val });
      setNewLabel("");
      setNewValue("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header de la materia */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: COLOR_BG[ci],
            color: COLORS[ci],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {materia.nombre[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
            {materia.nombre}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              className="badge"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {statusStyle.label}
            </span>
            {avg !== null && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                Prom: {avg}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color:
                parseFloat(avg) > 0
                  ? avg >= 6
                    ? "#34d399"
                    : avg >= 4
                      ? "#fbbf24"
                      : "#f87171"
                  : "var(--text-muted)",
            }}
          >
            {avg}
          </span>
          {expanded ? (
            <ChevronUp size={18} style={{ color: "var(--text-muted)" }} />
          ) : (
            <ChevronDown size={18} style={{ color: "var(--text-muted)" }} />
          )}
        </div>
      </div>

      {/* Contenido expandido */}
      {expanded && (
        <div style={{ padding: "16px 20px" }}>
          {/* Estado académico */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Estado académico
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ACADEMIC_STATUSES.map((s) => (
                <button
                  key={s.key}
                  className="badge"
                  style={{
                    background:
                      materia.academicStatus === s.key
                        ? s.bg
                        : "var(--bg-elevated)",
                    color:
                      materia.academicStatus === s.key
                        ? s.color
                        : "var(--text-muted)",
                    border:
                      materia.academicStatus === s.key
                        ? `1px solid ${s.color}44`
                        : "1px solid transparent",
                    cursor: "pointer",
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => onUpdateAcademicStatus(materia.id, s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de notas */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Notas ({grades.length})
            </div>
            {grades.length === 0 && (
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  padding: "12px 0",
                  textAlign: "center",
                  background: "var(--bg-elevated)",
                  borderRadius: 10,
                }}
              >
                Sin notas cargadas
              </div>
            )}
            {grades.map((g) => (
              <div
                key={g.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  marginBottom: 6,
                  background: "var(--bg-elevated)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background:
                        g.value >= 6
                          ? "#1a3d30"
                          : g.value >= 4
                            ? "#3d2e0a"
                            : "#3d1f1f",
                      color:
                        g.value >= 6
                          ? "#34d399"
                          : g.value >= 4
                            ? "#fbbf24"
                            : "#f87171",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    {g.value}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {g.label}
                  </span>
                </div>
                <button
                  className="icon-btn"
                  style={{
                    color: "#f87171",
                    background: "transparent",
                    width: 28,
                    height: 28,
                  }}
                  onClick={() => onRemoveGrade(materia.id, g.id)}
                  title="Eliminar nota"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Agregar nota */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 2 }}>
              <input
                className="input"
                placeholder="Ej: Parcial 1, Final..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                style={{ fontSize: 12, padding: "8px 12px", marginTop: 0 }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                className="input"
                type="number"
                min="0"
                max="10"
                step="0.5"
                placeholder="Nota"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                style={{ fontSize: 12, padding: "8px 12px", marginTop: 0 }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <button
              className="btn-primary"
              style={{
                height: 36,
                padding: "0 14px",
                borderRadius: 10,
                gap: 4,
                fontSize: 12,
              }}
              onClick={handleAdd}
              disabled={adding}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Stats({
  tareas,
  materias,
  onAddGrade,
  onRemoveGrade,
  onUpdateAcademicStatus,
}) {
  const total = tareas.length;
  const hechas = tareas.filter((t) => t.estado === "hecha").length;
  const pct = total ? Math.round((hechas / total) * 100) : 0;

  // Contadores académicos
  const cursando = materias.filter(
    (m) => m.academicStatus === "Cursando",
  ).length;
  const regulares = materias.filter(
    (m) => m.academicStatus === "Regular",
  ).length;
  const aprobadas = materias.filter(
    (m) => m.academicStatus === "Aprobada",
  ).length;
  const libres = materias.filter((m) => m.academicStatus === "Libre").length;

  // Promedio general: todas las materias que tienen al menos 1 nota
  const materiasConNotas = materias.filter((m) => (m.grades || []).length > 0);
  const promedioGeneral =
    materiasConNotas.length > 0
      ? (
          materiasConNotas.reduce((sum, m) => {
            const grades = m.grades || [];
            const avg = grades.reduce((s, g) => s + g.value, 0) / grades.length;
            return sum + avg;
          }, 0) / materiasConNotas.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Estadísticas</h1>
        <p className="page-subtitle">
          Seguimiento académico y notas de tu carrera.
        </p>
      </div>

      {/* Promedio general destacado */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          border: "1px solid rgba(157, 150, 240, 0.15)",
          textAlign: "center",
          padding: "28px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(157, 150, 240, 0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(52, 211, 153, 0.06)",
          }}
        />
        <Award
          size={28}
          style={{
            color: "#9d96f0",
            marginBottom: 8,
            opacity: 0.8,
          }}
        />
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "var(--text-muted)",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Promedio general de la carrera
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 6,
            background:
              parseFloat(promedioGeneral) > 0
                ? promedioGeneral >= 6
                  ? "linear-gradient(135deg, #34d399, #6ee7b7)"
                  : promedioGeneral >= 4
                    ? "linear-gradient(135deg, #fbbf24, #fde68a)"
                    : "linear-gradient(135deg, #f87171, #fca5a5)"
                : "linear-gradient(135deg, #9d96f0, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {promedioGeneral}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {materiasConNotas.length > 0
            ? `Basado en ${materiasConNotas.length} materia${materiasConNotas.length !== 1 ? "s" : ""} con notas`
            : "Cargá notas en tus materias para ver el promedio"}
        </div>
      </div>

      {/* Métricas de estado académico */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          {
            label: "Cursando",
            value: cursando,
            color: "#60a5fa",
            icon: <BookOpen size={22} />,
            bg: "#1a2d4e",
          },
          {
            label: "Regulares",
            value: regulares,
            color: "#fbbf24",
            icon: <TrendingUp size={22} />,
            bg: "#3d2e0a",
          },
          {
            label: "Aprobadas",
            value: aprobadas,
            color: "#34d399",
            icon: <GraduationCap size={22} />,
            bg: "#1a3d30",
          },
          {
            label: "Libres",
            value: libres,
            color: "#f87171",
            icon: <Trash2 size={22} />,
            bg: "#3d1f1f",
          },
        ].map((c, i) => (
          <div key={i} className="card card-hover metric-card">
            <div className="metric-card-icon" style={{ color: c.color }}>
              {c.icon}
            </div>
            <div className="metric-card-label">{c.label}</div>
            <div className="metric-card-value" style={{ color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Progreso de tareas */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            Progreso de tareas
          </span>
          <span
            style={{ fontWeight: 700, color: "var(--accent)", fontSize: 14 }}
          >
            {pct}%
          </span>
        </div>
        <div className="progress-track" style={{ height: 8 }}>
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#9d96f0,#34d399)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <span>{hechas} completadas</span>
          <span>{total} total</span>
        </div>
      </div>

      {/* Sección de notas por materia — agrupado por año */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 4,
          }}
        >
          Notas por materia
        </div>
        <div
          style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}
        >
          Expandí cada materia para cargar notas y cambiar su estado académico.
        </div>
      </div>

      {materias.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
            padding: "32px 20px",
          }}
        >
          No hay materias registradas todavía.
        </div>
      )}

      {/* Agrupar por año */}
      {(() => {
        const years = [...new Set(materias.map((m) => m.year || 1))].sort(
          (a, b) => a - b,
        );
        return years.map((year) => {
          const materiasDelAño = materias.filter((m) => (m.year || 1) === year);
          const conNotas = materiasDelAño.filter(
            (m) => (m.grades || []).length > 0,
          );
          const promAño =
            conNotas.length > 0
              ? (
                  conNotas.reduce((sum, m) => {
                    const gs = m.grades || [];
                    return (
                      sum + gs.reduce((s, g) => s + g.value, 0) / gs.length
                    );
                  }, 0) / conNotas.length
                ).toFixed(2)
              : "0.00";

          return (
            <div key={year} style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  padding: "10px 16px",
                  background: "var(--bg-elevated)",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background:
                        year === 1
                          ? "linear-gradient(135deg, #9d96f0, #7c73e6)"
                          : "linear-gradient(135deg, #60a5fa, #3b82f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    {year}°
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {year === 1
                        ? "Primer"
                        : year === 2
                          ? "Segundo"
                          : year === 3
                            ? "Tercer"
                            : `${year}°`}{" "}
                      Año
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {materiasDelAño.length} materia
                      {materiasDelAño.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                {promAño !== null && (
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: 2,
                      }}
                    >
                      Promedio
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color:
                          parseFloat(promAño) > 0
                            ? promAño >= 6
                              ? "#34d399"
                              : promAño >= 4
                                ? "#fbbf24"
                                : "#f87171"
                            : "var(--text-muted)",
                      }}
                    >
                      {promAño}
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {materiasDelAño.map((m) => (
                  <MateriaGradeCard
                    key={m.id}
                    materia={m}
                    onAddGrade={onAddGrade}
                    onRemoveGrade={onRemoveGrade}
                    onUpdateAcademicStatus={onUpdateAcademicStatus}
                  />
                ))}
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
}
