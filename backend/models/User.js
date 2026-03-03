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
       enum: ["first year","second year","third year", "fourth year"]
    },
       
  },
  { timestamps: true }
);

// ✅ Hash password before saving
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) {
//       return next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // ✅ Compare password method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("User", userSchema);
