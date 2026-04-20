import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { Navigate } from "react-router-dom";
import "../student.css";

export default function StudentDashboard() {
  
  
const feedbackRefs = useRef({});
const cardRefs = useRef({});

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  const [activeTab, setActiveTab] = useState("create");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Low");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [complaints, setComplaints] = useState([]);

  const fetchMyComplaints = async () => {
    try {
      const res = await API.get("/api/complaints/my");
      setComplaints(res.data);
       console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch complaints ");
    }
  };

  const openFeedback = (id) => {
  setSelectedComplaint(id);
};

const submitFeedback = async () => {

  //  Validate first
  if (!rating || rating < 1 || rating > 5) {
    alert("Please select a valid rating (1-5)");
    return;
  }

  if (!comment || comment.trim() === "") {
    alert("Please enter your feedback");
    return;
  }
  try {
    await API.post(`/api/complaints/feedback/${selectedComplaint}`, {
      rating,
      comment
    });

    alert("Feedback submitted ");
    setSelectedComplaint(null);
    fetchMyComplaints();

  } catch (err) {
    alert(err.response?.data?.message || "Error");
  }
};



  useEffect(() => {
  fetchMyComplaints();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && storedUser.name) {
    setUsername(storedUser.name);
  }
}, []);

useEffect(() => {
  fetch("https://college-grievance-management-system-p2vd.onrender.com");
}, []);

useEffect(() => {
  if (selectedComplaint) {
    setTimeout(() => {
      const feedback = feedbackRefs.current[selectedComplaint];

      if (feedback) {
        feedback.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }, 100); // 🔥 small delay
  }
}, [selectedComplaint]);


  const handleCreateComplaint = async (e) => {

    console.log("FORM SUBMITTED");

    e.preventDefault();

    if (loading) return; 

  setLoading(true);

    try {
      const res = await API.post("/api/complaints", {
        title,
        description,
        category,
        priority,
      });

      toast.success("Complaint created successfully ");

      

      setTitle("");
      setDescription("");
      setCategory("General");
      setPriority("Low");

      fetchMyComplaints();
      setActiveTab("my"); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Complaint create failed ");
    }
    finally {
    setLoading(false); 
  }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };


  const handleDelete = (c) => {

  // Block if feedback not given
  if (c.status === "Resolved" && !c.feedback?.given) {
    alert("Please fill the feedback before deleting.");
    return;
  }

  //  If feedback given → call your existing function
  deleteComplaint(c._id);
};
  const deleteComplaint = async (id) => {
  if (!window.confirm("Are you sure you want to delete this complaint?")) {
    return;
  }



  try {
    const res = await API.delete(`/api/complaints/${id}`);

    toast.success(res.data.message || "Complaint deleted ");

    fetchMyComplaints(); // refresh list
  } catch (err) {
    toast.error(err.response?.data?.message || "Delete failed ");
  }
};

  return (
    <div className="student-container">
     
     
      {/* Header */}

      <div className="Header">
        
         <p className="welcome-text">Welcome, {username} 👋</p>
         
         <div className="header-buttons">
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

              <label className="priority-text">Priority:</label>
              <select className="priority-options"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button type="submit"
             className="submid-complaint-button"
             disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
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
            <p className="no-complaint-text">No complaints found.</p>
          ) : (
            complaints.map((c) => (
              <div  key={c._id} className="">

              <div className="complaint-card" ref={(el) => (cardRefs.current[c._id] = el)}>
                <div className="my-complaint-content">
                <h3>{c.title}</h3>
                <p>{c.description}</p>

                <p>
                  <b>Category:</b> {c.category} | <b>Priority:</b>{" "}
                  {c.priority}
                </p>

                <p>
                  <b className="status">Status:</b>{" "}
                  <span className={`status ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                  
                </p>
              


                 {/* <button className="delete-button"
                    onClick={() => handleDelete(c)}>   
                  Delete
                  </button> */}
                 
                 {(c.status === "Pending" || c.status === "Resolved") && (
  <button
    className="delete-button"
    onClick={() => handleDelete(c)}
  >
    Delete
  </button>
)}

                 {c.status === "Resolved" && (
  <>
    {!c.feedback?.given ? (
      <button
        className="feedback-btn"
        onClick={() => openFeedback(c._id)}
      >
        Give Feedback
      </button>
    ) : (
      <p className="feedback-done"> Feedback Submitted</p>
    )}
  </>
)}
         
         {selectedComplaint == c._id && (
  <div className="feedback-box"  ref={(el) => (feedbackRefs.current[c._id] = el)}>

    <h3 className="feedback-text">Give Feedback</h3>


   <textarea className="feedback-textarea"
      placeholder="Write your feedback..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
     <br />

    <label className="rating">Rating:</label>
    <select value={rating} onChange={(e) => setRating(e.target.value)}className="rating-options">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>

    

    <button className="feedback-submit" onClick={submitFeedback}>Submit</button>
    <button className="feedback-cancel" onClick={() => {setSelectedComplaint(null);
                                                       setComment("");     
                                                       setRating(5);  }
                                                   }>
                                                    Cancel</button>
                                                 </div>
)}
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