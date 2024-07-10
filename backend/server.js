const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const contractRoutes = require("./routes/contractRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const adminUsername = "admin";
const adminPassword = "password";

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === adminUsername && password === adminPassword) {
    res.status(200).json({ token: "admin-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

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
