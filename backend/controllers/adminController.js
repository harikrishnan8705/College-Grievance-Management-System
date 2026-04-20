const sendEmail = require("../utils/sendEmail");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

//  GET ALL COMPLAINTS (Admin)
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

//  GET ALL STAFFS (Admin)
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


//  ASSIGN COMPLAINT TO STAFF (Admin)
exports.assignComplaintToStaff = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { staffId } = req.body;

    // Get complaint with student details
    const complaint = await Complaint.findById(complaintId)
      .populate("studentId");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found " });
    }

    // Get staff details
    const staff = await User.findById(staffId);

    if (!staff || staff.role !== "staff") {
      return res.status(404).json({ message: "Staff not found " });
    }

    //  Check Department Match
    if (complaint.studentId.department !== staff.department) {
      return res.status(400).json({
        message: "Department mismatch ",
      });
    }

    //  Check Year Match
    if (complaint.studentId.year !== staff.year) {
      return res.status(400).json({
        message: "Year mismatch ",
      });
    }

    //  If both match → Assign
    complaint.assignedTo = staffId;
    complaint.status = "In Progress";

    await complaint.save();

//  Send response immediately
res.json({ message: "Complaint assigned successfully " });

//  Send emails in background (NO await)
sendEmail(
  complaint.studentId.email,
  "Complaint Assigned",
   `
    <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      
      <h2 style="color: #3498db;">Complaint Assigned </h2>
      
      <p>Hello <b>${complaint.studentId.name}</b>,</p>
      
      <p>Your complaint has been assigned to a staff member.</p>
      
      <hr/>

      <h3> Staff Details</h3>
      <p><b>Name:</b> ${staff.name}</p>
      <p><b>Department:</b> ${staff.department}</p>

      <p><b>Status:</b> <span style="color: orange;">In Progress</span></p>

      <hr/>

      <p>We will update you once it is resolved.</p>

      <p>Thank you,<br/><b>Grievance Team</b></p>
    </div>
    `
).catch(err => console.log("Email error:", err));

sendEmail(
  staff.email,
  "New Complaint Assigned",
    `
    <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      
      <h2 style="color: #2c3e50;">New Complaint Assigned </h2>
      
      <p>Hello <b>${staff.name}</b>,</p>
      
      <p>You have been assigned a new complaint.</p>

      <hr/>

      <h3> Student Details</h3>
      <p><b>Name:</b> ${complaint.studentId.name}</p>
      <p><b>Department:</b> ${complaint.studentId.department}</p>

      <hr/>

      <p>Please check the system for full details.</p>

      <p>Regards,<br/><b>Grievance System</b></p>
    </div>
    `
)}
catch(err){
  console.log("Email error:", err);
}
}
  