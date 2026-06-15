const prisma = require("../config/db");

exports.getAll = async (req, res, next) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.userId },
      orderBy: { date: "asc" },
    });
    res.json(reminders);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, date, time, description } = req.body;
    if (!title?.trim() || !date) return res.status(400).json({ error: "Título y fecha requeridos" });

    const reminder = await prisma.reminder.create({
      data: { title, date, time, description, userId: req.userId },
    });
    res.status(201).json(reminder);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, date, time, description } = req.body;

    const result = await prisma.reminder.updateMany({
      where: { id: Number(id), userId: req.userId },
      data: { title, date, time, description },
    });
    if (!result.count) return res.status(404).json({ error: "Recordatorio no encontrado" });

    const updated = await prisma.reminder.findUnique({ where: { id: Number(id) } });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.reminder.deleteMany({ where: { id: Number(id), userId: req.userId } });
    if (!deleted.count) return res.status(404).json({ error: "Recordatorio no encontrado" });
    res.json({ message: "Recordatorio eliminado" });
  } catch (err) { next(err); }
};
