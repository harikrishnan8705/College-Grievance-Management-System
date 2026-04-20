const express = require("express");
const router = express.Router();


const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  giveFeedback,
} = require("../controllers/complaintController");

const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/authMiddleware");

// Student creates complaint
  router.post("/", protect, createComplaint);

// Get complaints
router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);
router.put("/:id", protect, updateComplaintStatus);
router.post("/feedback/:id", giveFeedback);

// Delete complaint
router.delete("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found " });
    }

    if (complaint.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized " });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint deleted successfully " });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;