import prisma from "../config/db.js";
import { isValidString, badRequest } from "../middleware/validate.js";

export const createReport = async (req, res, next) => {
  try {
    const { subject, description } = req.body;
    const userId = req.userId;

    if (!isValidString(subject, { maxLen: 200, required: true }))
      return badRequest(res, "El asunto es obligatorio (máximo 200 caracteres)");
    if (!isValidString(description, { maxLen: 2000, required: true }))
      return badRequest(res, "La descripción es obligatoria (máximo 2000 caracteres)");

    const report = await prisma.report.create({
      data: {
        subject: subject.trim(),
        description: description.trim(),
        userId,
      },
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const userId = req.userId;
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};
