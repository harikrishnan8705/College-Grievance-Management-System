import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../staff.css"

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [username, setUsername] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const fetchStaffComplaints = async () => {
    try {
      // Use dedicated staff API so the URL matches the backend
      const res = await API.get("/api/staff/complaints");

      // Backend already returns the complaints we want to show
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "STAFF API ERROR:",
        err.response?.data?.message || err.message || "Failed to load complaints "
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

    if (loadingId) return; // prevent multiple clicks

      setLoadingId(id);

    try {
      const res = await API.put(`/api/staff/complaints/${id}/status`, {
        status,
      });

      toast.success(res.data.message || "Status updated ");
      fetchStaffComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div  className="staff-container" >
      <div className="header-tab">
      <p className="Welcome-text">Welcome, {username} 👋</p>
      <button className="Logout-Button" onClick={handleLogout}>Logout</button>
      </div>
      

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
            <h3>{c.title}</h3>
            <p>{c.description}</p>

            <p>
              <b>Priority:</b> {c.priority} | <b>Status:</b> {c.status}
            </p>

            <select className="assign-complaint"
              value={c.status}
              onChange={(e) => updateStatus(c._id, e.target.value)}
              disabled={loadingId === c._id}
            >
              
              <option className="progress" value="In Progress">In Progress</option>
              
              <option className="resolved" value="Resolved">Resolved</option>
              
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
