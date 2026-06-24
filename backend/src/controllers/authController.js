import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "../config/db.js";
import { isValidEmail, badRequest } from "../middleware/validate.js";

const MIN_PASSWORD_LENGTH = 6;
const RESET_CODE_EXPIRY_MINUTES = 15;

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Gmail SMTP transporter ────────────────────────────────────────
let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password)
      return badRequest(res, "Email y contraseña requeridos");
    if (!isValidEmail(email))
      return badRequest(res, "Formato de email inválido");
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH)
      return badRequest(
        res,
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      );

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (exists)
      return res.status(409).json({ error: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashed,
        name: name?.trim() || null,
      },
    });

    res.status(201).json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return badRequest(res, "Email y contraseña requeridos");
    if (!isValidEmail(email))
      return badRequest(res, "Formato de email inválido");

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Credenciales inválidas" });

    if (user.status === "Inactivo")
      return res.status(403).json({ error: "Cuenta inactiva" });
    res.json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ── Forgot Password ────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email))
      return badRequest(res, "Email inválido");

    const normalized = email.toLowerCase().trim();

    // Always respond 200 to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user) {
      return res.json({
        message: "Si el email existe, recibirás un código de recuperación.",
      });
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(
      Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000,
    );

    // Invalidate previous codes for this email
    await prisma.passwordReset.updateMany({
      where: { email: normalized, used: false },
      data: { used: true },
    });

    // Save new code
    await prisma.passwordReset.create({
      data: { email: normalized, code, expiresAt },
    });

    // Send email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mail = getTransporter();
      await mail.sendMail({
        from: `"Organizador de Estudio" <${process.env.SMTP_USER}>`,
        to: normalized,
        subject: "Código de recuperación de contraseña",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #1a1a2e; border-radius: 16px; padding: 40px; color: #e0e0e0;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #8b7cf7, #6c5ce7); border-radius: 12px; line-height: 48px; font-size: 24px; color: #fff;">✓</div>
            </div>
            <h2 style="color: #fff; text-align: center; margin-bottom: 8px; font-size: 22px;">Recuperá tu contraseña</h2>
            <p style="text-align: center; color: #a0a0b0; font-size: 14px; margin-bottom: 32px;">Usá el siguiente código para restablecer tu contraseña. Expira en ${RESET_CODE_EXPIRY_MINUTES} minutos.</p>
            <div style="background: #252547; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px; border: 1px solid rgba(139,124,247,0.2);">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #8b7cf7;">${code}</span>
            </div>
            <p style="text-align: center; color: #707080; font-size: 12px;">Si no solicitaste este cambio, ignorá este email.</p>
          </div>
        `,
      });
    } else {
      console.warn(
        "[WARN] SMTP not configured — reset code for",
        normalized,
        "is:",
        code,
      );
    }

    res.json({
      message: "Si el email existe, recibirás un código de recuperación.",
    });
  } catch (err) {
    next(err);
  }
};

// ── Reset Password ─────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    if (!email || !isValidEmail(email))
      return badRequest(res, "Email inválido");
    if (!code) return badRequest(res, "Código requerido");
    if (
      !password ||
      typeof password !== "string" ||
      password.length < MIN_PASSWORD_LENGTH
    )
      return badRequest(
        res,
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      );

    const normalized = email.toLowerCase().trim();

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        email: normalized,
        code: code.trim(),
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetRecord) {
      return res.status(400).json({ error: "Código inválido o expirado" });
    }

    // Mark code as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // Update password
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: normalized },
      data: { password: hashed },
    });

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    next(err);
  }
};
