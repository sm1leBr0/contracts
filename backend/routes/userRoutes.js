const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const router = express.Router();

// Fetch the current user role
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const { username } = req.user;
    const result = await pool.query(
      "SELECT role FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      const { role } = result.rows[0];
      res.status(200).json({ role });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new user
router.post("/add", authenticateToken, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
      [
        username,
        hashedPassword,
        role || "user", // Default to 'user' role
      ]
    );
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding user" });
  }
});

// Delete a user
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Get all users
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
