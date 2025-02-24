const router = require("express").Router();

const appointmentController = require("../controllers/appointmentController");

router.get("/",appointmentController.getAppointments);

router.get("/:id",appointmentController.getAppointmentsById);

router.post("/",appointmentController.createAppointments);

router.put("/:id",appointmentController.editAppointments);

router.delete("/:id",appointmentController.deleteAppointments);

module.exports = router;