import prisma from "../config/db.js";

export const getAll = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      include: { subject: { select: { id: true, name: true, colorIdx: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { title, priority, status, dueDate, subjectId } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Título requerido" });

    const task = await prisma.task.create({
      data: { title, priority: priority || "media", status: status || "pendiente", dueDate, subjectId, userId: req.userId },
      include: { subject: { select: { id: true, name: true, colorIdx: true } } },
    });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, priority, status, dueDate, subjectId } = req.body;

    const result = await prisma.task.updateMany({
      where: { id: Number(id), userId: req.userId },
      data: { title, priority, status, dueDate, subjectId },
    });
    if (!result.count) return res.status(404).json({ error: "Tarea no encontrada" });

    const updated = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { subject: { select: { id: true, name: true, colorIdx: true } } },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.task.deleteMany({ where: { id: Number(id), userId: req.userId } });
    if (!deleted.count) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json({ message: "Tarea eliminada" });
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Estado requerido" });

    const result = await prisma.task.updateMany({
      where: { id: Number(id), userId: req.userId },
      data: { status },
    });
    if (!result.count) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json({ message: "Estado actualizado" });
  } catch (err) { next(err); }
};
