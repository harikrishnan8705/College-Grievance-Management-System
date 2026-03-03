// /* eslint-disable react-hooks/set-state-in-effect */
// import { useEffect, useState } from "react";
// import API from "../api/axios";
// import "../student.css"

// export default function StudentDashboard() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("General");
//   const [priority, setPriority] = useState("Low");
//   const [activeTab, setActiveTab] = useState("create");

//   const [complaints, setComplaints] = useState([]);

//   const fetchMyComplaints = async () => {
//     try {
//       const res = await API.get("/api/complaints/my");
//       setComplaints(res.data);
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to fetch complaints ❌");
//     }
//   };

//   useEffect(() => {
//     fetchMyComplaints();
//   }, []);

//   const handleCreateComplaint = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await API.post("/api/complaints", {
//         title,
//         description,
//         category,
//         priority,
//       });
      
//       if (res.status === 200 || res.status === 201) {
//   alert("Complaint created successfully ✅");
// } else {
//   alert("Complaint create failed ❌");
// }

//       //alert(res.data.message || "Complaint created ✅");

//       setTitle("");
//       setDescription("");
//       setCategory("General");
//       setPriority("Low");

//       fetchMyComplaints();
//     } catch (err) {
//       alert(err.response?.data?.message || "Complaint create failed ❌");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     window.location.href = "/";
//   };

//   return (
//     <div className="student-container" style={{ padding: 20 }}>
      
//       <div className="Header">
//         <h2 className="student-text" >Student Dashboard</h2>
//       <button className="Logout-button" onClick={handleLogout}>Logout</button>
//       </div>

//       <hr />

//       <div className="complaint-section">

//       <h2 className="create-complaint-text" >Create Complaint</h2>

//       <form onSubmit={handleCreateComplaint}>
//         <input className="complaint-title"
//           placeholder="Complaint Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <br /><br />

//         <textarea className="complaint-description"
//           placeholder="Complaint Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           rows={4}
//         />
//         <br /><br />
       
//        <div className="category-priority">
//         <label className="category-text">Category:</label>
//         <select className="category-options" value={category} onChange={(e) => setCategory(e.target.value)}>
//           <option value="General">General</option>
//           <option value="Hostel">Hostel</option>
//           <option value="Classroom">Classroom</option>
//           <option value="Lab">Lab</option>
//           <option value="Library">Library</option>
//           <option value="Other">Other</option>
//         </select>

//         <br /><br />

//         <label className="category-text">Priority:</label>
//         <select className="category-options" value={priority} onChange={(e) => setPriority(e.target.value)}>
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>

//       </div>

//         <br /><br />

//         <button type="submit">Submit Complaint</button>
//       </form>

//       </div>

//       <hr />

//       <h3>My Complaints</h3>

//       {complaints.length === 0 ? (
//         <p>No complaints found.</p>
//       ) : (
//         complaints.map((c) => (
//           <div
//             key={c._id}
//             style={{
//               border: "1px solid gray",
//               padding: 10,
//               marginBottom: 10,
//             }}
//           >
//             <h4>{c.title}</h4>
//             <p>{c.description}</p>

//             <p>
//               <b>Category:</b> {c.category} | <b>Priority:</b> {c.priority}
//             </p>

//             <p>
//               <b>Status:</b> {c.status}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../student.css";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Low");
  const [username, setUsername] = useState("");

  const [complaints, setComplaints] = useState([]);

  const fetchMyComplaints = async () => {
    try {
      const res = await API.get("/api/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch complaints ❌");
    }
  };

  useEffect(() => {
  fetchMyComplaints();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    setUsername(storedUser.name);
  }
}, []);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/complaints", {
        title,
        description,
        category,
        priority,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Complaint created successfully ✅");
      } else {
        alert("Complaint create failed ❌");
      }

      setTitle("");
      setDescription("");
      setCategory("General");
      setPriority("Low");

      fetchMyComplaints();
      setActiveTab("my"); // automatically switch to My Complaints after submit
    } catch (err) {
      alert(err.response?.data?.message || "Complaint create failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="student-container">
      {/* Header */}
      <div className="Header">
       
         
         <p className="welcome-text">Welcome, {username} 👋</p>

         <button id="create-complaint-button"
          className={activeTab === "create" ? "active-tab" : ""}
          onClick={() => setActiveTab("create")}
        >
          Create Complaint
        </button>
        <button id="my-complaint-button"
          className={activeTab === "my" ? "active-tab" : ""}
          onClick={() => setActiveTab("my")}
        >
          My Complaints
        </button>
        <button className="Logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <hr />

      {/* Tabs */}
      <div className="dashboard-tabs">
       

        
      </div>

      {/* Create Complaint Section */}
      {activeTab === "create" && (
        <div className="complaint-section">
          <h3 className="create-complaint-text">Create Complaint</h3>

          <form onSubmit={handleCreateComplaint}>
            <input
              className="complaint-title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <br />

            <textarea
              className="complaint-description"
              placeholder="Complaint Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />

            <br />

            <div className="category-priority">
              <label className="category-text">Category:</label>
              <select className="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Hostel">Hostel</option>
                <option value="Classroom">Classroom</option>
                <option value="Lab">Lab</option>
                <option value="Library">Library</option>
                <option value="Other">Other</option>
              </select>

              <label className="category-text">Priority:</label>
              <select className="category-options"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button type="submit" className="submid-complaint-button">
              Submit
            </button>
          </form>
        </div>
      )}

      {/* My Complaints Section */}
      {activeTab === "my" && (
        <>
         <h3 className="my-complaint-text">My Complaints</h3>
        <div className="my-complaint-section">
         

          {complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            complaints.map((c) => (
              <div className="">
              <div key={c._id} className="complaint-card">
                <div className="my-complaint-content">
                <h2>{c.title}</h2>
                <p>{c.description}</p>

                <p>
                  <b>Category:</b> {c.category} | <b>Priority:</b>{" "}
                  {c.priority}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </p>
              </div>
              </div>
              </div> 
            ))
          )}
         
        </div>
        </>
      )}
    </div>
  );
}