const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

//  REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, year } = req.body;
     
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    

    //check all fields
    if (!name || !email || !password || !role || !department || !year) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // normalize role to match schema/guards
    const normalizedRole = role.toLowerCase();

    

    //hash password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      department,
      year,
    });
    await user.save();
    console.log("User count:", await User.countDocuments());
    console.log("Saved User:", user);

    res.status(201).json({
      message: "User registered successfully ",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year
      },
    });
  } catch (error) {
  console.log("REGISTER ERROR:", error);
  res.status(500).json({
    message: error.message,
  });
}
};



const loginUser = async (req, res) => {
  try {
    const { username, email, password, dob } = req.body;

    let user;

    //  Find user by username OR email
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: "Username or Email is required" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //  STUDENT LOGIN (DOB)
    if (user.role.toLowerCase() === "student") {
      if (!dob) {
        return res.status(400).json({ message: "DOB is required" });
      }

      const isMatch = await bcrypt.compare(dob, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid DOB" });
      }
    }

    //  STAFF + ADMIN LOGIN (PASSWORD)
    else {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
    }

    //  SUCCESS
    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        department: user.department,
      },
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {  loginUser };
