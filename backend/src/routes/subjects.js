import { Router } from "express";
import * as ctrl from "../controllers/subjectController.js";

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// Sub-recurso: horarios de una materia
router.post("/:id/schedules", ctrl.addSchedule);
router.delete("/:id/schedules/:scheduleId", ctrl.removeSchedule);

export default router;
