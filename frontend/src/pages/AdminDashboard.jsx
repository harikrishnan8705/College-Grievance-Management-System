import { useEffect, useState } from "react";
import API from "../api/axios";
import "../admin.css"

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [staffs, setStaffs] = useState([]);

  // Fetch all complaints
  const fetchAllComplaints = async () => {
    try {
      const res = await API.get("/api/admin/complaints");
      setComplaints(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load complaints ");
    }
  };

  // Fetch all staff
  const fetchAllStaff = async () => {
    try {
      const res = await API.get("/api/admin/staffs");
      setStaffs(res.data);
    } catch (err) {
      // Staff list failing should not block complaints view
      console.error("Failed to load staffs:", err.response?.data || err.message);
      setStaffs([]);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
    fetchAllStaff();
  }, []);

  // Assign complaint to staff
  const assignComplaint = async (complaintId, staffId) => {
    try {
      const res = await API.put(`/api/admin/assign/${complaintId}`, {
        staffId,
      });

      alert(res.data.message || "Assigned successfully ");
      fetchAllComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Assign failed ");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="navbar">
      <h2 className="admin-text">Welcome, Admin</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

     

      <p className="allcomplaint-text" >All Complaints</p>

      <div className="complaints">
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((c) => (
          <div className="complain-card"
            key={c._id}
            
          >
            <div className="complaint-content">
            <h3>{c.title}</h3>
            <p>{c.description}</p>

            

            <p>
              <b>Priority:</b> {c.priority} | <b>Status: </b> 
                <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                </span>
           </p>

            <p>
              <b>Student:</b> {c.studentId?.name} ({c.studentId?.department},{c.studentId?.year})
            </p>

            <p>
              <b>Assigned Staff:</b>{" "}
              {c.assignedTo ? c.assignedTo.name : "Not Assigned"}
            </p>
           

            {c.status !== "Resolved" && c.status !== "In Progress" && (
  <>
    <label>Assign to Staff: </label>
    <select
      className="selectstaff-button"
      defaultValue=""
      onChange={(e) => assignComplaint(c._id, e.target.value)}
    >
      <option value="" disabled>
        Select Staff
      </option>

      {staffs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.department}) ({s.year})
                </option>
              ))}
            </select>
    
  </>
)}

              
              

              

            
                {c.feedback?.given && (
    <div className="feedback-display">
      <p><b>Feedback:</b></p>
      <p><b> Rating: </b>{c.feedback.rating}</p>
      <p> <b>Comment:</b> {c.feedback.comment}</p>
    </div>
  )}
            </div>
            
          </div>
        ))
      )}
      </div>
    </div>
  );
}
