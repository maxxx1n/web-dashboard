import prisma from "../config/db.js";

export const getAll = async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { userId: req.userId },
      include: { schedules: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(subjects);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { name, description, colorIdx, schedules } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Nombre requerido" });

    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        colorIdx: colorIdx ?? 0,
        userId: req.userId,
        schedules: schedules?.length ? { create: schedules } : undefined,
      },
      include: { schedules: true },
    });
    res.status(201).json(subject);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, colorIdx } = req.body;

    const subject = await prisma.subject.updateMany({
      where: { id: Number(id), userId: req.userId },
      data: { name, description, colorIdx },
    });
    if (!subject.count) return res.status(404).json({ error: "Materia no encontrada" });

    const updated = await prisma.subject.findUnique({ where: { id: Number(id) }, include: { schedules: true } });
    res.json(updated);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.subject.deleteMany({ where: { id: Number(id), userId: req.userId } });
    if (!deleted.count) return res.status(404).json({ error: "Materia no encontrada" });
    res.json({ message: "Materia eliminada" });
  } catch (err) { next(err); }
};

// ── Schedules (horarios) de una materia ────────────────────
export const addSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    // Verificar propiedad
    const subject = await prisma.subject.findFirst({ where: { id: Number(id), userId: req.userId } });
    if (!subject) return res.status(404).json({ error: "Materia no encontrada" });

    const schedule = await prisma.schedule.create({ data: { day, startTime, endTime, subjectId: Number(id) } });
    res.status(201).json(schedule);
  } catch (err) { next(err); }
};

export const removeSchedule = async (req, res, next) => {
  try {
    const { id, scheduleId } = req.params;

    const subject = await prisma.subject.findFirst({ where: { id: Number(id), userId: req.userId } });
    if (!subject) return res.status(404).json({ error: "Materia no encontrada" });

    await prisma.schedule.delete({ where: { id: Number(scheduleId) } });
    res.json({ message: "Horario eliminado" });
  } catch (err) { next(err); }
};
