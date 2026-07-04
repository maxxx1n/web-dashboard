import prisma from "../config/db.js";
import { isValidString, badRequest } from "../middleware/validate.js";

const ALLOWED_ACADEMIC_STATUSES = ["Cursando", "Regular", "Aprobada", "Libre"];

// ── Grades CRUD ────────────────────────────────────────────

export const getBySubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const subject = await prisma.subject.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!subject)
      return res.status(404).json({ error: "Materia no encontrada" });

    const grades = await prisma.grade.findMany({
      where: { subjectId: Number(id) },
      orderBy: { createdAt: "asc" },
    });
    res.json(grades);
  } catch (err) {
    next(err);
  }
};

export const addGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label, value } = req.body;

    if (!isValidString(label, { maxLen: 100, required: true }))
      return badRequest(
        res,
        "Nombre de la nota requerido (máximo 100 caracteres)",
      );
    if (typeof value !== "number" || value < 0 || value > 10)
      return badRequest(res, "La nota debe ser un número entre 0 y 10");

    // Verify ownership
    const subject = await prisma.subject.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!subject)
      return res.status(404).json({ error: "Materia no encontrada" });

    const grade = await prisma.grade.create({
      data: {
        label: label.trim(),
        value,
        subjectId: Number(id),
      },
    });
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
};

export const updateGrade = async (req, res, next) => {
  try {
    const { id, gradeId } = req.params;
    const { label, value } = req.body;

    // Verify ownership
    const subject = await prisma.subject.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!subject)
      return res.status(404).json({ error: "Materia no encontrada" });

    const grade = await prisma.grade.findUnique({
      where: { id: Number(gradeId) },
    });
    if (!grade || grade.subjectId !== Number(id))
      return res
        .status(404)
        .json({ error: "Nota no encontrada en esta materia" });

    const data = {};
    if (label !== undefined) {
      if (!isValidString(label, { maxLen: 100, required: true }))
        return badRequest(res, "Nombre de la nota inválido");
      data.label = label.trim();
    }
    if (value !== undefined) {
      if (typeof value !== "number" || value < 0 || value > 10)
        return badRequest(res, "La nota debe ser un número entre 0 y 10");
      data.value = value;
    }

    const updated = await prisma.grade.update({
      where: { id: Number(gradeId) },
      data,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeGrade = async (req, res, next) => {
  try {
    const { id, gradeId } = req.params;

    // Verify ownership
    const subject = await prisma.subject.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!subject)
      return res.status(404).json({ error: "Materia no encontrada" });

    const grade = await prisma.grade.findUnique({
      where: { id: Number(gradeId) },
    });
    if (!grade || grade.subjectId !== Number(id))
      return res
        .status(404)
        .json({ error: "Nota no encontrada en esta materia" });

    await prisma.grade.delete({ where: { id: Number(gradeId) } });
    res.json({ message: "Nota eliminada" });
  } catch (err) {
    next(err);
  }
};

// ── Academic Status ────────────────────────────────────────

export const updateAcademicStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { academicStatus } = req.body;

    if (!ALLOWED_ACADEMIC_STATUSES.includes(academicStatus))
      return badRequest(
        res,
        `Estado académico inválido. Permitidos: ${ALLOWED_ACADEMIC_STATUSES.join(", ")}`,
      );

    const result = await prisma.subject.updateMany({
      where: { id: Number(id), userId: req.userId },
      data: { academicStatus },
    });
    if (!result.count)
      return res.status(404).json({ error: "Materia no encontrada" });

    const updated = await prisma.subject.findUnique({
      where: { id: Number(id) },
      include: { schedules: true, grades: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
