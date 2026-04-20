// // const express = require("express");
// // const cors = require("cors");
// // const dotenv = require("dotenv").config();;
// // const connectDB = require("./config/db");
// // const authRoutes = require("./routes/authRoutes");
// // const complaintRoutes = require("./routes/complaintRoutes");
// // const adminRoutes = require("./routes/adminRoutes");
// // const staffRoutes = require("./routes/staffRoutes");
// // const seedAdmin = require("./utils/seedAdmin");



// // connectDB();
// // seedAdmin();

// // const app = express();


// // app.use(express.json());
// // app.use("/api/auth", authRoutes);
// // app.use("/api/complaints", complaintRoutes);
// // app.use("/api/admin", adminRoutes);
// // app.use("/api/staff", staffRoutes);




// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "https://college-grievance-management-system.vercel.app"
// // ];

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true
// // }));

// // app.get("/", (req, res) => {
// //   res.send("API is running... ");
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const complaintRoutes = require("./routes/complaintRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const staffRoutes = require("./routes/staffRoutes");
// const seedAdmin = require("./utils/seedAdmin");

// connectDB();
// seedAdmin();

// const app = express();

// // ✅ MOVE CORS HERE (TOP)
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://college-grievance-management-system.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

// // ✅ THEN JSON
// app.use(express.json());

// // ✅ THEN ROUTES
// app.use("/api/auth", authRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/staff", staffRoutes);

// // root route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require("./routes/staffRoutes");
const seedAdmin = require("./utils/seedAdmin");

console.log("EMAIL:", process.env.EMAIL_USER); 
const app = express();


// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://college-grievance-management-system.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ JSON
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Connect DB first, then seed, then start server
const startServer = async () => {
  try {
    await connectDB();      // wait for DB
    await seedAdmin();      // then seed admin
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server start failed:", error.message);
  }
};

startServer();