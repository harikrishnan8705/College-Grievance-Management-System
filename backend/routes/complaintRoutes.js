const express = require("express");
const router = express.Router();
const { getMyComplaints} = require("../controllers/complaintController")
const { getComplaintById} = require("../controllers/complaintController")
 
const {protect} = require("../middleware/authMiddleware");
const { createComplaint } = require("../controllers/complaintController");

// ✅ Student creates complaint
router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);



module.exports = router;
