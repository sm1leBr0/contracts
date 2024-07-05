const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const {
  getContracts,
  getContractById,
  addContract,
  updateContract,
  deleteContract,
  downloadContractFile,
  getCounterpartySuggestions,
  getPerformerSuggestions,
  addCounterparty,
  addPerformer,
} = require("../controllers/contractController");

// Route for adding a contract with file upload
router.post("/:table/add", upload.single("file"), addContract);
// Route for fetching all contracts
router.get("/:table/contracts", getContracts);
// Route for fetching a specific contract by ID
router.get("/:table/:id", getContractById);
// Route for updating a contract
router.put("/:table/update/:id", upload.single("file"), updateContract);

// Route for deleting a contract
router.delete("/:table/:id", deleteContract);

// Route for downloading a contract file
router.get("/:table/download/:id", downloadContractFile);

router.get("/counterparty/suggest", getCounterpartySuggestions);
// Route for adding a counterparty
router.post("/counterparty", addCounterparty);
// Route for getting performer suggestions
router.get("/performers/suggest", getPerformerSuggestions);
// Route for adding a performer
router.post("/performers", addPerformer);

module.exports = router;
