import prisma from "../config/db.js";

export const createReport = async (req, res, next) => {
  try {
    const { subject, description } = req.body;
    const userId = req.userId;

    if (!subject || !description) {
      return res.status(400).json({ error: "El asunto y la descripción son obligatorios." });
    }

    const report = await prisma.report.create({
      data: {
        subject,
        description,
        userId
      }
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
      orderBy: { createdAt: "desc" }
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};
