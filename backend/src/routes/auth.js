import { Router } from "express";
import * as ctrl from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", authMiddleware, ctrl.me);

export default router;
