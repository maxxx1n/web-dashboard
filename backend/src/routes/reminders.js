import { Router } from "express";
import * as ctrl from "../controllers/reminderController.js";

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;
