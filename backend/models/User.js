const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      
    },

    department: { 
      type: String ,
        enum: ["CSE", "AIDS", "ECE", "MECH", "CIVIL","EEE"],
    },

    year:{
      type: String,
       enum: ["First year","Second year","Third year", "Fourth year"]
    },
       
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
