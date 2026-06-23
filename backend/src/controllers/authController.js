import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { isValidEmail, isValidString, badRequest } from "../middleware/validate.js";

const MIN_PASSWORD_LENGTH = 6;

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) return badRequest(res, "Email y contraseña requeridos");
    if (!isValidEmail(email)) return badRequest(res, "Formato de email inválido");
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH)
      return badRequest(res, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    if (!isValidString(name, { maxLen: 100 }))
      return badRequest(res, "El nombre no puede exceder 100 caracteres");

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (exists) return res.status(409).json({ error: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: email.toLowerCase().trim(), password: hashed, name: name?.trim() || null },
    });

    res.status(201).json({
      token: generateToken(user.id),
      user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
    });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return badRequest(res, "Email y contraseña requeridos");
    if (!isValidEmail(email)) return badRequest(res, "Formato de email inválido");

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

    if (user.status === "Inactivo") return res.status(403).json({ error: "Cuenta inactiva" });
    res.json({
      token: generateToken(user.id),
      user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
    });
  } catch (err) { next(err); }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) { next(err); }
};
