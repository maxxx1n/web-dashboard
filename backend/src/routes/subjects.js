const { Router } = require("express");
const ctrl = require("../controllers/subjectController");

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// Sub-recurso: horarios de una materia
router.post("/:id/schedules", ctrl.addSchedule);
router.delete("/:id/schedules/:scheduleId", ctrl.removeSchedule);

module.exports = router;
