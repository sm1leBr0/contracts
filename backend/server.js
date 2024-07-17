const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");

const contractRoutes = require("./routes/contractRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const adminUsername = process.env.ST_ADMIN;
const adminPassword = process.env.ST_PASS;
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Check for admin login
  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({ token });
  }

  // Check for regular user login
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign(
          { username, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({ token });
      }
    }
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("Error logging in user", err);
    res.status(500).json({ error: "Internal server error" });
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
