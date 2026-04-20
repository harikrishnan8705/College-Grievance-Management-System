const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        department: "CSE",
      });

      console.log(" Admin account created: admin@gmail.com / admin123");
    } else {
      // Ensure existing admin has a valid department and a hashed password
      const allowedDepartments = ["CSE", "AIDS", "ECE", "MECH", "CIVIL", "EEE"];
      if (!allowedDepartments.includes(adminExists.department)) {
        adminExists.department = "CSE";
      }

      const looksHashed =
        adminExists.password && adminExists.password.length > 20;

      if (!looksHashed) {
        const salt = await bcrypt.genSalt(10);
        adminExists.password = await bcrypt.hash("admin123", salt);
        await adminExists.save();
        console.log(" Existing admin fixed: department + hashed password");
      } else {
        console.log("Admin already exists");
      }
    }
    // Ensure at least one default staff user exists so admin can assign
    const staffExists = await User.findOne({ role: { $regex: /^staff$/i } });
    if (!staffExists) {
      const salt = await bcrypt.genSalt(10);
      const staffPassword = await bcrypt.hash("staff123", salt);

      await User.create({
        name: "Default Staff",
        email: "staff@gmail.com",
        password: staffPassword,
        role: "staff",
        department: "CSE",
        year: "First year",
      });

      console.log(" Default staff created: staff@gmail.com / staff123");
    }
  } catch (error) {
    console.log(" Admin seeding failed:", error.message);
  }
};

module.exports = seedAdmin;
