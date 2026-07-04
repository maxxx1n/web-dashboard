import { Router } from "express";
import * as ctrl from "../controllers/subjectController.js";
import * as gradeCtrl from "../controllers/gradeController.js";

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// Sub-recurso: horarios de una materia
router.post("/:id/schedules", ctrl.addSchedule);
router.delete("/:id/schedules/:scheduleId", ctrl.removeSchedule);

// Sub-recurso: notas de una materia
router.get("/:id/grades", gradeCtrl.getBySubject);
router.post("/:id/grades", gradeCtrl.addGrade);
router.put("/:id/grades/:gradeId", gradeCtrl.updateGrade);
router.delete("/:id/grades/:gradeId", gradeCtrl.removeGrade);

// Estado académico
router.patch("/:id/academic-status", gradeCtrl.updateAcademicStatus);

export default router;
