import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

export const updateMe = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);

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
