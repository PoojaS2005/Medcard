import express from "express";
import auth from "../middleware/auth.js";
import Prescription from "../models/Prescription.js";

const router = express.Router();

// GET all prescriptions for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    let prescriptions;

    if (role === "doctor") {
      prescriptions = await Prescription.find({ doctorId: id })
        .populate("patientId", "name email");
    } else {
      prescriptions = await Prescription.find({ patientId: id })
        .populate("doctorId", "name email");
    }

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// POST new prescription (Doctor only)
router.post("/", auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    if (role !== "doctor") return res.status(403).json({ msg: "Unauthorized" });

    const { patientId, diagnosis, notes } = req.body;
    const prescription = new Prescription({
      doctorId: id,
      patientId,
      diagnosis,
      notes,
    });

    await prescription.save();
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT update prescription (Doctor only)
router.put("/:id", auth, async (req, res) => {
  try {
    const { role, id: doctorId } = req.user;
    if (role !== "doctor") return res.status(403).json({ msg: "Unauthorized" });

    const { diagnosis, notes } = req.body;
    const updated = await Prescription.findOneAndUpdate(
      { _id: req.params.id, doctorId },
      { diagnosis, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Prescription not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE prescription (Doctor only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { role, id: doctorId } = req.user;
    if (role !== "doctor") return res.status(403).json({ msg: "Unauthorized" });

    const deleted = await Prescription.findOneAndDelete({ _id: req.params.id, doctorId });
    if (!deleted) return res.status(404).json({ msg: "Prescription not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
