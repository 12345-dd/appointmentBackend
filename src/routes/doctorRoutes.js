const router = require("express").Router();
const doctorController = require("../controllers/doctorController")

router.get("/",doctorController.getAllDoctors);

router.get("/:id/slots",doctorController.getDoctorSlots);

module.exports = router;