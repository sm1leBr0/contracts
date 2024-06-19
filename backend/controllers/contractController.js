const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// Download a contract file
exports.downloadContractFile = (req, res) => {
  const { id } = req.params;
  pool.query(
    "SELECT file_path FROM contracts WHERE id = $1",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Contract not found" });
      }
      const filePath = result.rows[0].file_path;
      res.download(path.resolve(filePath));
    }
  );
};

// Add a contract
exports.addContract = async (req, res) => {
  const {
    title,
    description,
    counterparty,
    number,
    date,
    end_date,
    scope,
    performers,
  } = req.body;
  const file_path = req.file.path;
  try {
    const newContract = await pool.query(
      "INSERT INTO contracts (title, description, counterparty, number, date, end_date, scope, performers, file_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        title,
        description,
        counterparty,
        number,
        date,
        end_date,
        scope,
        performers,
        file_path,
      ]
    );
    res.status(201).json(newContract.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all contracts
exports.getContracts = async (req, res) => {
  try {
    const { search } = req.query;
    let baseQuery = "SELECT * FROM contracts";
    const values = [];

    if (search) {
      baseQuery +=
        " WHERE title ILIKE $1 OR description ILIKE $1 OR counterparty ILIKE $1 OR number ILIKE $1 OR date::text ILIKE $1 OR end_date::text ILIKE $1 OR scope ILIKE $1 OR performers ILIKE $1";
      values.push(`%${search}%`);
    }

    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get a specific contract by ID
exports.getContractById = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await pool.query("SELECT * FROM contracts WHERE id = $1", [
      id,
    ]);
    if (contract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.status(200).json(contract.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a contract
exports.updateContract = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    counterparty,
    number,
    date,
    end_date,
    scope,
    performers,
    file_path,
  } = req.body;
  try {
    const updatedContract = await pool.query(
      "UPDATE contracts SET title = $1, description = $2, counterparty = $3, number = $4, date = $5, end_date = $6, scope = $7, performers = $8, file_path = $9 WHERE id = $10 RETURNING *",
      [
        title,
        description,
        counterparty,
        number,
        date,
        end_date,
        scope,
        performers,
        file_path,
        id,
      ]
    );
    if (updatedContract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.status(200).json(updatedContract.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a contract
exports.deleteContract = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT file_path FROM contracts WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }

    const filePath = result.rows[0].file_path;

    const deletedContract = await pool.query(
      "DELETE FROM contracts WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedContract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file", err);
        return res
          .status(500)
          .json({ error: "Failed to delete file from server" });
      }
      console.log("File deleted successfully");
    });
    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
