import { useNavigate } from "react-router-dom";
import "../loginselect.css"
import clglogo from "../assets/clg logo.png"

export default function LoginSelect() {
  const navigate = useNavigate();
  console.log(import.meta.env.VITE_API_URL);

  return (
    
    <div className="home-wrapper">
    <div className="home-container">
      <img  className="clglogo" src={clglogo} alt="" />
      <h1>College Grievance System</h1>

      <button className="btn1" onClick={() => navigate("/student-login")}>
        Student Login
      </button>

      <br /><br />

      <button className="btn2" onClick={() => navigate("/staff-login")}>
        Staff Login
      </button>
    </div>
    </div>
  );
}