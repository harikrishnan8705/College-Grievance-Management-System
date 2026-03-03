const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ✅ REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, year } = req.body;

    // check all fields
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

    // hash password
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
      message: "User registered successfully ✅",
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

// ✅ LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful ✅",
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
