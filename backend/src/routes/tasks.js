const { Router } = require("express");
const ctrl = require("../controllers/taskController");

const router = Router();

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.patch("/:id/status", ctrl.updateStatus);

module.exports = router;
