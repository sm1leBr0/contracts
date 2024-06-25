const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// Helper function to validate table names
const validateTable = (table) => {
  const validTables = ["protect", "aig"];
  return validTables.includes(table);
};

// Download a contract file
exports.downloadContractFile = (req, res) => {
  const { table, id } = req.params;
  if (!validateTable(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

  pool.query(
    `SELECT file_path FROM ${table} WHERE id = $1`,
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
  const { table } = req.params;
  if (!validateTable(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

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
      `INSERT INTO ${table} (title, description, counterparty, number, date, end_date, scope, performers, file_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
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
  const { table } = req.params;
  if (!validateTable(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

  try {
    const { search } = req.query;
    let baseQuery = `
      SELECT id, title, description, counterparty, number, 
             TO_CHAR(date, 'YYYY-MM-DD') AS date, 
             TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
             scope, performers, file_path, 
             TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at 
      FROM ${table}
    `;
    const values = [];

    if (search) {
      baseQuery += `
        WHERE title ILIKE $1 OR 
              description ILIKE $1 OR 
              counterparty ILIKE $1 OR 
              number ILIKE $1 OR 
              TO_CHAR(date, 'YYYY-MM-DD') ILIKE $1 OR 
              TO_CHAR(end_date, 'YYYY-MM-DD') ILIKE $1 OR 
              scope ILIKE $1 OR 
              performers ILIKE $1
      `;
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
  const { table, id } = req.params;
  if (!validateTable(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

  try {
    const contract = await pool.query(
      `SELECT id, title, description, counterparty, number, 
             TO_CHAR(date, 'YYYY-MM-DD') AS date, 
             TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
             scope, performers, file_path, 
             TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at 
      FROM ${table} WHERE id = $1`,
      [id]
    );
    if (contract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }
    res.status(200).json(contract.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a contract
exports.deleteContract = async (req, res) => {
  const { table, id } = req.params;
  if (!validateTable(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

  try {
    const result = await pool.query(
      `SELECT file_path FROM ${table} WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }

    const filePath = result.rows[0].file_path;

    const deletedContract = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
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

exports.updateContract = async (req, res) => {
  const { table, id } = req.params;
  if (!validateTable(table)) {
    return res.status(400).json({ error: "Invalid table name" });
  }

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

  const fieldsToUpdate = {};
  const updateParams = [];
  let paramIndex = 1;

  // Prepare fields and params to update
  if (title !== undefined) {
    fieldsToUpdate.title = title;
    updateParams.push(title);
  }
  if (description !== undefined) {
    fieldsToUpdate.description = description;
    updateParams.push(description);
  }
  if (counterparty !== undefined) {
    fieldsToUpdate.counterparty = counterparty;
    updateParams.push(counterparty);
  }
  if (number !== undefined) {
    fieldsToUpdate.number = number;
    updateParams.push(number);
  }
  if (date !== undefined) {
    fieldsToUpdate.date = date;
    updateParams.push(date);
  }
  if (end_date !== undefined) {
    fieldsToUpdate.end_date = end_date;
    updateParams.push(end_date);
  }
  if (scope !== undefined) {
    fieldsToUpdate.scope = scope;
    updateParams.push(scope);
  }
  if (performers !== undefined) {
    fieldsToUpdate.performers = performers;
    updateParams.push(performers);
  }

  // Handle file upload if included in the request
  if (req.file) {
    const file_path = req.file.path;
    fieldsToUpdate.file_path = file_path;
    updateParams.push(file_path);
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update" });
  }

  updateParams.push(id); // Push id for WHERE clause

  try {
    const setClause = Object.keys(fieldsToUpdate)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const updateContract = await pool.query(
      `UPDATE ${table} SET ${setClause} WHERE id = $${updateParams.length} RETURNING *`,
      updateParams
    );

    if (updateContract.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }

    res.status(200).json(updateContract.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
