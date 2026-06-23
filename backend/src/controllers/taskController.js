import prisma from "../config/db.js";
import {
  isValidString,
  isInWhitelist,
  badRequest,
  ALLOWED_PRIORITIES,
  ALLOWED_TASK_STATUSES,
} from "../middleware/validate.js";

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
    if (!isValidString(title, { maxLen: 200, required: true }))
      return badRequest(res, "Título requerido (máximo 200 caracteres)");

    const safePriority = priority || "media";
    const safeStatus = status || "pendiente";

    if (!isInWhitelist(safePriority, ALLOWED_PRIORITIES))
      return badRequest(res, `Prioridad inválida. Permitidas: ${ALLOWED_PRIORITIES.join(", ")}`);
    if (!isInWhitelist(safeStatus, ALLOWED_TASK_STATUSES))
      return badRequest(res, `Estado inválido. Permitidos: ${ALLOWED_TASK_STATUSES.join(", ")}`);

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        priority: safePriority,
        status: safeStatus,
        dueDate: dueDate || null,
        subjectId: subjectId || null,
        userId: req.userId,
      },
      include: { subject: { select: { id: true, name: true, colorIdx: true } } },
    });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, priority, status, dueDate, subjectId } = req.body;

    if (title !== undefined && !isValidString(title, { maxLen: 200, required: true }))
      return badRequest(res, "Título inválido (máximo 200 caracteres, no puede estar vacío)");
    if (priority !== undefined && !isInWhitelist(priority, ALLOWED_PRIORITIES))
      return badRequest(res, `Prioridad inválida. Permitidas: ${ALLOWED_PRIORITIES.join(", ")}`);
    if (status !== undefined && !isInWhitelist(status, ALLOWED_TASK_STATUSES))
      return badRequest(res, `Estado inválido. Permitidos: ${ALLOWED_TASK_STATUSES.join(", ")}`);

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (priority !== undefined) data.priority = priority;
    if (status !== undefined) data.status = status;
    if (dueDate !== undefined) data.dueDate = dueDate || null;
    if (subjectId !== undefined) data.subjectId = subjectId || null;

    const result = await prisma.task.updateMany({
      where: { id: Number(id), userId: req.userId },
      data,
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

    if (!status || !isInWhitelist(status, ALLOWED_TASK_STATUSES))
      return badRequest(res, `Estado inválido. Permitidos: ${ALLOWED_TASK_STATUSES.join(", ")}`);

    const result = await prisma.task.updateMany({
      where: { id: Number(id), userId: req.userId },
      data: { status },
    });
    if (!result.count) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json({ message: "Estado actualizado" });
  } catch (err) { next(err); }
};
