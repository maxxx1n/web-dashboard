import prisma from "../config/db.js";
import { isValidString, isValidDate, isValidTime, badRequest } from "../middleware/validate.js";

export const getAll = async (req, res, next) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.userId },
      orderBy: { date: "asc" },
    });
    res.json(reminders);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { title, date, time, description } = req.body;

    if (!isValidString(title, { maxLen: 200, required: true }))
      return badRequest(res, "Título requerido (máximo 200 caracteres)");
    if (!isValidDate(date, { required: true }))
      return badRequest(res, "Fecha requerida en formato YYYY-MM-DD");
    if (!isValidTime(time))
      return badRequest(res, "Hora debe estar en formato HH:mm");
    if (!isValidString(description, { maxLen: 1000 }))
      return badRequest(res, "Descripción demasiado larga (máximo 1000 caracteres)");

    const reminder = await prisma.reminder.create({
      data: {
        title: title.trim(),
        date,
        time: time || null,
        description: description?.trim() || null,
        userId: req.userId,
      },
    });
    res.status(201).json(reminder);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, date, time, description } = req.body;

    if (title !== undefined && !isValidString(title, { maxLen: 200, required: true }))
      return badRequest(res, "Título inválido (máximo 200 caracteres, no puede estar vacío)");
    if (date !== undefined && !isValidDate(date, { required: true }))
      return badRequest(res, "Fecha debe estar en formato YYYY-MM-DD");
    if (time !== undefined && !isValidTime(time))
      return badRequest(res, "Hora debe estar en formato HH:mm");
    if (description !== undefined && !isValidString(description, { maxLen: 1000 }))
      return badRequest(res, "Descripción demasiado larga (máximo 1000 caracteres)");

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (date !== undefined) data.date = date;
    if (time !== undefined) data.time = time || null;
    if (description !== undefined) data.description = description?.trim() || null;

    const result = await prisma.reminder.updateMany({
      where: { id: Number(id), userId: req.userId },
      data,
    });
    if (!result.count) return res.status(404).json({ error: "Recordatorio no encontrado" });

    const updated = await prisma.reminder.findUnique({ where: { id: Number(id) } });
    res.json(updated);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.reminder.deleteMany({ where: { id: Number(id), userId: req.userId } });
    if (!deleted.count) return res.status(404).json({ error: "Recordatorio no encontrado" });
    res.json({ message: "Recordatorio eliminado" });
  } catch (err) { next(err); }
};
