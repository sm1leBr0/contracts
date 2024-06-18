const pool = require("../config/db");

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
  const { title, description, file_path } = req.body;
  try {
    const newContract = await pool.query(
      "INSERT INTO contracts (title, description, file_path) VALUES ($1, $2, $3) RETURNING *",
      [title, description, file_path]
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
      baseQuery += " WHERE title ILIKE $1 OR description ILIKE $1";
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

exports.updateContract = async (req, res) => {
  const { id } = req.params;
  const { title, description, file_path } = req.body;
  try {
    const updatedContract = await pool.query(
      "UPDATE contracts SET title = $1, description = $2, file_path = $3 WHERE id = $4 RETURNING *",
      [title, description, file_path, id]
    );
    if (updatedContract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.status(200).json(updatedContract.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContract = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContract = await pool.query(
      "DELETE FROM contracts WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedContract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
