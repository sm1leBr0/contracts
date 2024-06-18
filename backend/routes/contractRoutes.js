const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const pool = require("../config/db"); // Import the pool object

const {
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  downloadContractFile,
} = require("../controllers/contractController");

// Route for adding a contract with file upload
router.post("/add", upload.single("file"), async (req, res) => {
  const { title, description } = req.body;
  const file_path = req.file.path;

  try {
    const result = await pool.query(
      "INSERT INTO contracts (title, description, file_path) VALUES ($1, $2, $3) RETURNING *",
      [title, description, file_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for search
router.get("/contracts", getContracts);

// Route for fetching all contracts
router.get("/", getContracts);

// Route for fetching a specific contract by ID
router.get("/:id", getContractById);

// Route for updating a contract
router.put("/:id", updateContract);

// Route for deleting a contract
router.delete("/:id", deleteContract);

// Route for downloading a contract file
router.get("/download/:id", downloadContractFile);

module.exports = router;
