const express = require("express");
const router = express.Router();

const { protect, staffOnly } = require("../middleware/authMiddleware");
const Complaint = require("../models/Complaint");

// ✅ View all complaints (accessible to any logged-in user for simplicity)
router.get("/complaints", protect, staffOnly, async (req, res) => {
  try {
    console.log("Logged staff id:", req.user._id);

    const complaints = await Complaint.find({
      assignedTo: req.user._id   // 🔥 FILTER HERE
    })
      .populate("studentId", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Staff - Update complaint status
router.put("/complaints/:id/status", protect, staffOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "In Progress",
      "Resolved",
      
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({
      message: "Complaint status updated successfully ✅",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
