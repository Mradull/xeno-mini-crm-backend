// src/server.js
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const campaignRoutes = require("./routes/campaignRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
require("./auth/googleStrategy");

const authRoutes = require("./auth/authRoutes");

const app = express();



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
