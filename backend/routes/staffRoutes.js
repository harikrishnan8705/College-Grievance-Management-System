const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); 
const { updateComplaintStatus } = require("../controllers/complaintController");
const { protect, staffOnly } = require("../middleware/authMiddleware");
const Complaint = require("../models/Complaint");

//  View all complaints (accessible to any logged-in user for simplicity)

router.get("/complaints", protect, staffOnly, async (req, res) => {
  try {

    const complaints = await Complaint.find({
      assignedTo: req.user._id,
      status: { $ne: "Resolved" }   // hide resolved complaints
    })
      .populate("studentId", "name email department year")
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Staff - Update complaint status
router.put("/complaints/:id/status", protect, staffOnly, updateComplaintStatus)

module.exports = router;
