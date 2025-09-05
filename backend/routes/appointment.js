import express from "express";
import Appointment from "../models/Appointment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/appointments
router.post("/", auth, async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;
    const appt = new Appointment({ doctorId, patientId });
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/appointments
router.get("/", auth, async (req, res) => {
  try {
    const role = req.user.role;
    const id = req.user.id;

    let appointments;
    if (role === "patient") {
      appointments = await Appointment.find({ patientId: id })
        .populate("doctorId", "name email");
    } else if (role === "doctor") {
      appointments = await Appointment.find({ doctorId: id })
        .populate("patientId", "name email");
    }

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
