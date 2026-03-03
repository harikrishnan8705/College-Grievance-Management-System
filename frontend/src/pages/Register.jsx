import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../register.css";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("role");
  

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" ,
    department: "CSE",
    year: "first year",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/register", formData);
      alert(res.data.message || "Registered successfully ✅");
      navigate("/");
    } catch (err) {
  console.log("REGISTER ERROR:", err);
  console.log("BACKEND RESPONSE:", err.response?.data);
  alert(err.response?.data?.message || err.message || "Register failed ❌");
}
  };

  return (
    <>
    
    <div className="register-container" style={{ padding: 20 }}>
      <div className="bordered-box">
      <div className="register-form">
      <div><h2 className="register-text">Register</h2></div>

      <form onSubmit={handleRegister}>
        <input className="input-box"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input className="input-box"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br /><br />

        <input className="input-box"
          placeholder="Password"
         type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          
        />
         <button className="toggle-password-button" type="button" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? "🔓" : "🔒"}
  </button>
        

       {/* <label className="selection-field" >Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>  */}

        <br /><br />

         {/* <input type="text" placeholder="role" className="input-box" />
         <input type="text" placeholder="department" className="input-box" />
         <input type="number" placeholder="year" className="input-box" /> */}

        <select placeholder="kjhg" className="input-box2" name="role" value={formData.role} onChange={handleChange} >
          <option value="student">Student</option>
         <option value="staff">Staff</option>
         <option value="admin">Admin</option>
       </select>

       <br /><br />

       <select className="input-box2" name="department"
          value={formData.department}
          onChange={handleChange}>
       
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="AIDS">AIDS</option>
       </select>

       <br /><br />

       <select className="input-box2" name="year" value={formData.year} onChange={handleChange}>
         
          <option value="First year">First Year</option>
          <option value="Second year">Second Year</option>
          <option value="Third year">Third Year</option>
          <option value="Fourth year">Fourth Year</option>
      </select>
 

        {/* <label className="selection-field">Department:</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="CSE">CSE</option>
          <option value="AIDS">AIDS</option>
          <option value="ECE">ECE</option>
        </select>

        <br /><br />

        <label className="selection-field">Year:</label>
        <select name="year" value={formData.year} onChange={handleChange}>
          <option value="first year">first Year</option>
          <option value="second year">second Year</option>
          <option value="third year">third Year</option>
          <option value="fourth year">fourth Year</option>
        </select>

        <br /><br /> */}
        
        {/* <label className="selection-field" >Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select> */}

       <br />

        <button className="register-button" type="submit"><p></p>Submit</button>
      </form>
    </div>
    </div>
    </div>
    </>
  );
}
