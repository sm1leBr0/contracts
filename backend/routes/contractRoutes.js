const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { body, param, query, validationResult } = require("express-validator");

const {
  getContracts,
  getContractById,
  addContract,
  updateContract,
  deleteContract,
  downloadContractFile,
  searchCounterparty,
  searchPerformer,
} = require("../controllers/contractController");

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route for adding a contract with file upload
router.post(
  "/:table/add",
  [
    param("table").trim().escape(),
    upload.single("file"),
    body("contractData").trim().escape(),
  ],
  validate,
  addContract
);

// Route for fetching all contracts
router.get(
  "/:table/contracts",
  [param("table").trim().escape()],
  validate,
  getContracts
);

// Route for fetching a specific contract by ID
router.get(
  "/:table/:id",
  [param("table").trim().escape(), param("id").isInt().toInt()],
  validate,
  getContractById
);

// Route for updating a contract
router.put(
  "/:table/update/:id",
  [
    param("table").trim().escape(),
    param("id").isInt().toInt(),
    upload.single("file"),
    body("contractData").trim().escape(),
  ],
  validate,
  updateContract
);

// Route for deleting a contract
router.delete(
  "/:table/:id",
  [param("table").trim().escape(), param("id").isInt().toInt()],
  validate,
  deleteContract
);

// Route for downloading a contract file
router.get(
  "/:table/download/:id",
  [param("table").trim().escape(), param("id").isInt().toInt()],
  validate,
  downloadContractFile
);

// Route for searching counterparty
router.get(
  "/:table/counterparty/search",
  [param("table").trim().escape(), query("q").trim().escape()],
  validate,
  searchCounterparty
);

// Route for searching performer
router.get(
  "/:table/performer/search",
  [param("table").trim().escape(), query("q").trim().escape()],
  validate,
  searchPerformer
);

module.exports = router;
