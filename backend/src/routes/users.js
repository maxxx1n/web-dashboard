import { Router } from "express";
import * as ctrl from "../controllers/userController.js";

const router = Router();

router.put("/me", ctrl.updateMe);
router.get("/", ctrl.getAll);
router.patch("/:id/role", ctrl.updateRole);
router.patch("/:id/status", ctrl.updateStatus);
router.delete("/:id", ctrl.remove);

export default router;
