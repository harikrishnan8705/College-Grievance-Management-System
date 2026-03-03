// const express = require("express");
// const router = express.Router();


// const Complaint = require("../models/Complaint");
// const User = require("../models/User");

// const {
//   getAllComplaints,
//   getAllStaffs,
//   assignComplaintToStaff,
// } = require("../controllers/adminController");

// const { protect, adminOnly } = require("../middleware/authMiddleware");

// //Admin APIs
// router.get("/complaints", protect, adminOnly, getAllComplaints);
// router.get("/staffs", protect, adminOnly, getAllStaffs);

// // Your assign route format
// router.put("/assign/:id", protect, adminOnly, assignComplaintToStaff);


// // ✅ Admin - Get All Complaints
// router.get("/complaints", protect, async (req, res) => {
//   try {
//     // check admin role
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied (Admin only)" });
//     }

//     const complaints = await Complaint.find()
//       .populate("studentId", "name email department")
//       .populate("assignedTo", "name email role")
//       .sort({ createdAt: -1 });

//     res.status(200).json(complaints);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ✅ Admin - Assign complaint to staff
// router.put("/assign/:id", protect, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied (Admin only)" });
//     }

//     const { staffId } = req.body;

//     if (!staffId) {
//       return res.status(400).json({ message: "staffId is required" });
//     }

//     // check complaint exists
//     const complaint = await Complaint.findById(req.params.id);
//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     // check staff exists and role is staff
//     const staff = await User.findById(staffId);
//     if (!staff || staff.role !== "staff") {
//       return res.status(400).json({ message: "Invalid staffId" });
//     }

//     complaint.assignedTo = staffId;
//     complaint.status = "In Progress"; // optional auto update
//     await complaint.save();

//     res.status(200).json({
//       message: "Complaint assigned to staff successfully ✅",
//       complaint,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ✅ Admin - Get all students
// router.get("/students", protect, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied (Admin only)" });
//     }

//     const { department } = req.query;

//     const filter = { role: "student" };

//     if (department) {
//       filter.department = department;
//     }

//     const students = await User.find(filter).select("-password");

//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ Admin - Get all staffs
// router.get("/staffs", protect, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied (Admin only)" });
//     }

//     const { department } = req.query;

//     const filter = { role: "staff" };

//     if (department) {
//       filter.department = department;
//     }

//     const staffs = await User.find(filter).select("-password");

//     res.status(200).json(staffs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// module.exports = router;

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






