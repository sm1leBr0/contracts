const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const contractRoutes = require("./routes/contractRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const adminUsername = process.env.ST_ADMIN;
const adminPassword = process.env.ST_PASS;
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.use("/api/users", userRoutes);

// Contract routes
app.use("/api", contractRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
