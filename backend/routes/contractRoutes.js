const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeAdmin = require("../middleware/authorizeAdmin");

const {
  getContracts,
  getContractById,
  addContract,
  updateContract,
  deleteContract,
  downloadContractFile,
} = require("../controllers/contractController");

// Route for adding a contract with file upload
router.post("/add", upload.single("file"), addContract);

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
