import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import {
  isValidEmail,
  isValidString,
  isInWhitelist,
  badRequest,
  ALLOWED_ROLES,
  ALLOWED_STATUSES,
} from "../middleware/validate.js";

const MIN_PASSWORD_LENGTH = 6;

export const updateMe = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = {};

    if (name !== undefined) {
      if (!isValidString(name, { maxLen: 100, required: true }))
        return badRequest(res, "Nombre inválido (máximo 100 caracteres, no puede estar vacío)");
      data.name = name.trim();
    }

    if (email !== undefined) {
      if (!isValidEmail(email)) return badRequest(res, "Formato de email inválido");
      const normalized = email.toLowerCase().trim();
      // Verificar unicidad antes de actualizar
      const existing = await prisma.user.findUnique({ where: { email: normalized } });
      if (existing && existing.id !== req.userId) {
        return res.status(409).json({ error: "El email ya está en uso por otra cuenta" });
      }
      data.email = normalized;
    }

    if (password) {
      if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH)
        return badRequest(res, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      data.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0)
      return badRequest(res, "No se proporcionaron datos para actualizar");

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, email: true, name: true, role: true, status: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !isInWhitelist(role, ALLOWED_ROLES))
      return badRequest(res, `Rol inválido. Permitidos: ${ALLOWED_ROLES.join(", ")}`);

    await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !isInWhitelist(status, ALLOWED_STATUSES))
      return badRequest(res, `Estado inválido. Permitidos: ${ALLOWED_STATUSES.join(", ")}`);

    await prisma.user.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.userId)
      return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
