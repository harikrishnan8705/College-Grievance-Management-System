/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../staff.css"

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [username, setUsername] = useState("");

  const fetchStaffComplaints = async () => {
    try {
      // Use dedicated staff API so the URL matches the backend
      const res = await API.get("/api/staff/complaints");

      // Backend already returns the complaints we want to show
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "STAFF API ERROR:",
        err.response?.data?.message || err.message || "Failed to load complaints ❌"
      );
      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchStaffComplaints();
    const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    setUsername(storedUser.name);
  }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/api/staff/complaints/${id}/status`, {
        status,
      });

      alert(res.data.message || "Status updated ✅");
      fetchStaffComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div  className="staff-container" style={{ padding: 20 }}>
      <div className="header-tab">
      <p className="Welcome-text">Welcome, {username} 👋</p>
      <button className="Logout-Button" onClick={handleLogout}>Logout</button>
      </div>
      <hr />

      <p className="assingned-complaint-text">Assigned Complaints</p>
      <div className="Complaint-section">
      {complaints.length === 0 ? (
        <p className="no-assigned-text">No assigned complaints...</p>
      ) : (
        complaints.map((c) => (
          <div className="Complaint-card"
            key={c._id}
            
          >
            <div className="Complaint-content">
            <h2>{c.title}</h2>
            <p>{c.description}</p>

            <p>
              <b>Priority:</b> {c.priority} | <b>Status:</b> {c.status}
            </p>

            <select className="assign-complaint"
              value={c.status}
              onChange={(e) => updateStatus(c._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            </div>
          </div>
        ))
      )
      }
      </div>
    </div>
  );
}
