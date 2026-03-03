const Complaint = require("../models/Complaint");

// ✅ CREATE COMPLAINT
const createComplaint = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = await Complaint.create({
      studentId: req.user._id, // from token
      title,
      category,
      description,
    });

    res.status(201).json({
      message: "Complaint Created Successfully ✅",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ✅ 2) Get My Complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 3) Get Complaint By ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "studentId",
      "name email department"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { createComplaint, getMyComplaints, getComplaintById };

