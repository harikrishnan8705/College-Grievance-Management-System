const Complaint = require("../models/Complaint");
const User = require("../models/User");

// ✅ GET ALL COMPLAINTS (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "name email department year role")
      .populate("assignedTo", "name email department role")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL STAFFS (Admin)
exports.getAllStaffs = async (req, res) => {
  try {
    // Case-insensitive match in case some users were saved as "Staff"
    const staffs = await User.find({
      role: { $regex: /^staff$/i },
    }).select("name email department year role");

    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ASSIGN COMPLAINT TO STAFF (Admin)
// exports.assignComplaintToStaff = async (req, res) => {
//   try {
//     const complaintId = req.params.id;
//     const { staffId } = req.body;

//     const complaint = await Complaint.findById(complaintId);

    

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found ❌" });
//     }

//     complaint.assignedTo = staffId;
//     // When admin assigns, automatically move complaint to "In Progress"
//     complaint.status = "In Progress";

//     await complaint.save();

//     res.json({ message: "Complaint assigned successfully ✅" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// ✅ ASSIGN COMPLAINT TO STAFF (Admin)
exports.assignComplaintToStaff = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { staffId } = req.body;

    // Get complaint with student details
    const complaint = await Complaint.findById(complaintId)
      .populate("studentId");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found ❌" });
    }

    // Get staff details
    const staff = await User.findById(staffId);

    if (!staff || staff.role !== "staff") {
      return res.status(404).json({ message: "Staff not found ❌" });
    }

    // ✅ Check Department Match
    if (complaint.studentId.department !== staff.department) {
      return res.status(400).json({
        message: "Department mismatch ❌",
      });
    }

    // ✅ Check Year Match
    if (complaint.studentId.year !== staff.year) {
      return res.status(400).json({
        message: "Year mismatch ❌",
      });
    }

    // ✅ If both match → Assign
    complaint.assignedTo = staffId;
    complaint.status = "In Progress";

    await complaint.save();

    res.json({ message: "Complaint assigned successfully ✅" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};