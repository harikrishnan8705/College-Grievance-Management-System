const express = require("express");
const router = express.Router();

const {
  getAllComplaints,
  getAllStaffs,
  assignComplaintToStaff,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Admin APIs
router.get("/complaints", protect, adminOnly, getAllComplaints);
router.get("/staffs", protect, adminOnly, getAllStaffs);
router.put("/assign/:id", protect, adminOnly, assignComplaintToStaff);

module.exports = router;