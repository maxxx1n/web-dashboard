import prisma from "../config/db.js";
import {
  isValidString,
  isValidInt,
  isInWhitelist,
  badRequest,
  ALLOWED_DAYS,
} from "../middleware/validate.js";

const MAX_COLOR_IDX = 7;

export const getAll = async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { userId: req.userId },
      include: { schedules: true, grades: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, description, colorIdx, schedules, year } = req.body;
    if (!isValidString(name, { maxLen: 150, required: true }))
      return badRequest(res, "Nombre requerido (máximo 150 caracteres)");
    if (!isValidString(description, { maxLen: 500 }))
      return badRequest(
        res,
        "Descripción demasiado larga (máximo 500 caracteres)",
      );
    if (
      colorIdx !== undefined &&
      !isValidInt(colorIdx, { min: 0, max: MAX_COLOR_IDX })
    )
      return badRequest(
        res,
        `colorIdx debe ser un entero entre 0 y ${MAX_COLOR_IDX}`,
      );
    if (year !== undefined && !isValidInt(year, { min: 1, max: 10 }))
      return badRequest(res, "Año debe ser un entero entre 1 y 10");

    // Validar schedules si se envían
    if (schedules?.length) {
      for (const s of schedules) {
        if (!isInWhitelist(s.day, ALLOWED_DAYS))
          return badRequest(
            res,
            `Día inválido: ${s.day}. Permitidos: ${ALLOWED_DAYS.join(", ")}`,
          );
        if (
          !isValidString(s.startTime, { required: true }) ||
          !isValidString(s.endTime, { required: true })
        )
          return badRequest(
            res,
            "Hora de inicio y fin requeridas en cada horario",
          );
      }
    }

    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        colorIdx: colorIdx ?? 0,
        year: year ?? 1,
        userId: req.userId,
        schedules: schedules?.length ? { create: schedules } : undefined,
      },
      include: { schedules: true, grades: { orderBy: { createdAt: "asc" } } },
    });
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, colorIdx, year } = req.body;

    if (
      name !== undefined &&
      !isValidString(name, { maxLen: 150, required: true })
    )
      return badRequest(
        res,
        "Nombre inválido (máximo 150 caracteres, no puede estar vacío)",
      );
    if (
      description !== undefined &&
      !isValidString(description, { maxLen: 500 })
    )
      return badRequest(
        res,
        "Descripción demasiado larga (máximo 500 caracteres)",
      );
    if (
      colorIdx !== undefined &&
      !isValidInt(colorIdx, { min: 0, max: MAX_COLOR_IDX })
    )
      return badRequest(
        res,
        `colorIdx debe ser un entero entre 0 y ${MAX_COLOR_IDX}`,
      );
    if (year !== undefined && !isValidInt(year, { min: 1, max: 10 }))
      return badRequest(res, "Año debe ser un entero entre 1 y 10");

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined)
      data.description = description?.trim() || null;
    if (colorIdx !== undefined) data.colorIdx = colorIdx;
    if (year !== undefined) data.year = year;

    const subject = await prisma.subject.updateMany({
      where: { id: Number(id), userId: req.userId },
      data,
    });
    if (!subject.count)
      return res.status(404).json({ error: "Materia no encontrada" });

    const updated = await prisma.subject.findUnique({
      where: { id: Number(id) },
      include: { schedules: true, grades: { orderBy: { createdAt: "asc" } } },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.subject.deleteMany({
      where: { id: Number(id), userId: req.userId },
    });
    if (!deleted.count)
      return res.status(404).json({ error: "Materia no encontrada" });
    res.json({ message: "Materia eliminada" });
  } catch (err) {
    next(err);
  }
};

// ── Schedules (horarios) de una materia ────────────────────
export const addSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    if (!isInWhitelist(day, ALLOWED_DAYS))
      return badRequest(
        res,
        `Día inválido. Permitidos: ${ALLOWED_DAYS.join(", ")}`,
      );
    if (
      !isValidString(startTime, { required: true }) ||
      !isValidString(endTime, { required: true })
    )
      return badRequest(res, "Hora de inicio y fin requeridas");

    // Verificar propiedad
    const subject = await prisma.subject.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!subject)
      return res.status(404).json({ error: "Materia no encontrada" });

    const schedule = await prisma.schedule.create({
      data: { day, startTime, endTime, subjectId: Number(id) },
    });
    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
};

export const removeSchedule = async (req, res, next) => {
  try {
    const { id, scheduleId } = req.params;

    // Verificar propiedad del subject
    const subject = await prisma.subject.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!subject)
      return res.status(404).json({ error: "Materia no encontrada" });

    // IDOR fix: verificar que el schedule pertenezca a este subject
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(scheduleId) },
    });
    if (!schedule || schedule.subjectId !== Number(id)) {
      return res
        .status(404)
        .json({ error: "Horario no encontrado en esta materia" });
    }

    await prisma.schedule.delete({ where: { id: Number(scheduleId) } });
    res.json({ message: "Horario eliminado" });
  } catch (err) {
    next(err);
  }
};
