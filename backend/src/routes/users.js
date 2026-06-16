import { Router } from "express";
import * as ctrl from "../controllers/userController.js";
import adminMiddleware from "../middleware/admin.js";

const router = Router();

router.put("/me", ctrl.updateMe);
router.get("/", adminMiddleware, ctrl.getAll);
router.patch("/:id/role", adminMiddleware, ctrl.updateRole);
router.patch("/:id/status", adminMiddleware, ctrl.updateStatus);
router.delete("/:id", adminMiddleware, ctrl.remove);

export default router;
