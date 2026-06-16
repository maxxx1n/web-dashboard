import prisma from "../config/db.js";

/**
 * Middleware de autorización para Administradores.
 * Debe ejecutarse después de authMiddleware (donde se asigna req.userId).
 */
export default async function adminMiddleware(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });

    if (!user || user.role !== "Administrador") {
      return res
        .status(403)
        .json({
          error: "Acceso denegado: Se requieren permisos de administrador.",
        });
    }

    next();
  } catch (error) {
    next(error);
  }
}
