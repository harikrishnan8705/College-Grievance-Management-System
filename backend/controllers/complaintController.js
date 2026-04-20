  const Complaint = require("../models/Complaint");
  const sendEmail = require("../utils/sendEmail");

  //  CREATE COMPLAINT
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
        message: "Complaint Created Successfully & Email Sent",
        complaint,
      });

  //    //  Safe email sending
       
    try {
         await sendEmail(
          req.user.email,
          "Complaint Submitted Successfully",
         `
  <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
    
    <h2 style="color: #2c3e50;">Complaint Submitted </h2>
    
    <p>Hello <b>${req.user.name}</b>,</p>
    
    <p>Your complaint has been successfully submitted. Our team will review it shortly.</p>
    
    <hr/>

    <h3>Complaint Details</h3>
    <p><b>Title:</b> ${title}</p>
    <p><b>Category:</b> ${category}</p>
    <p><b>Status:</b> <span style="color: orange;">Pending</span></p>

    <hr/>

    <p style="color: #555;">
      We will notify you once there is an update.
    </p>

    <p>Thank you,<br/><b>Grievance Support Team</b></p>
  </div>
  `
);
  } catch (emailError) {
    console.log("Email failed:", emailError.message);
  }
      

    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  const updateComplaintStatus = async (req, res) => {
    try {
      const complaintId = req.params.id;
      const { status } = req.body;
     
      console.log("Status received:", status);

      const complaint = await Complaint.findById(complaintId)
        .populate("studentId");

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      //  Only if status is "Resolved"
      complaint.status = status;
      await complaint.save();

      res.json({ message: "Status updated successfully" });

      if (status === "Resolved") {
        try {
          
          
          await sendEmail(
            complaint.studentId.email,
            "Complaint Resolved",
             `
  <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
    
    <h2 style="color: green;">Complaint Resolved </h2>
    
    <p>Hello <b>${complaint.studentId.name}</b>,</p>
    
    <p>Your complaint has been successfully resolved.</p>

    <hr/>

    <h3> Complaint Details</h3>
    <p><b>Title:</b> ${complaint.title}</p>
    <p><b>Category:</b> ${complaint.category}</p>
    <p><b>Status:</b> <span style="color: green;">Resolved</span></p>

    <hr/>

    <p>Thank you for your patience.</p>

    <p>Regards,<br/><b>Grievance Team</b></p>
  </div>
  `
);
        } catch (emailError) {
          console.log("Email failed:", emailError.message);
        }
      }

      

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

   // Feedback
  const giveFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({ message: "Feedback allowed only after resolution" });
    }

    if (complaint.feedback?.given) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    complaint.feedback = {
      rating,
      comment,
      given: true
    };

    await complaint.save();

    res.json({ message: "Feedback submitted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  //  2) Get My Complaints
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

  //  3) Get Complaint By ID
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
  module.exports = { createComplaint, getMyComplaints, getComplaintById, updateComplaintStatus , giveFeedback};

