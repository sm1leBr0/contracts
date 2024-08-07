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
  searchCounterparty,
  searchPerformer,
  deletePerformer,
  deleteCounterparty,
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
// Route for searching counterparty
router.get("/:table/counterparty/search", searchCounterparty);
// Route for searching performer
router.get("/:table/performer/search", searchPerformer);
// Define routes for deleting performers and counterparties
router.delete("/aig/performer/:id", deletePerformer);
router.delete("/aig/counterparty/:id", deleteCounterparty);
router.post("/aig/performer/add", addPerformer);
router.post("/aig/counterparty/add", addCounterparty);

module.exports = router;
