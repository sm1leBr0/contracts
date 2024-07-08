const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// Helper function to validate table names
const validateTable = (table) => {
  const validTables = ["protect", "aig"];
  return validTables.includes(table);
};

const getOrInsertCounterparty = async (counterparty) => {
  const result = await pool.query(
    "INSERT INTO counterparty (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
    [counterparty]
  );
  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    const selectResult = await pool.query(
      "SELECT id FROM counterparty WHERE name = $1",
      [counterparty]
    );
    return selectResult.rows[0].id;
  }
};

const getOrInsertPerformer = async (performer) => {
  const result = await pool.query(
    "INSERT INTO performers (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
    [performer]
  );
  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    const selectResult = await pool.query(
      "SELECT id FROM performers WHERE name = $1",
      [performer]
    );
    return selectResult.rows[0].id;
  }
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
    const counterparty_id = await getOrInsertCounterparty(counterparty);
    const performer_id = await getOrInsertPerformer(performers);

    const newContract = await pool.query(
      `INSERT INTO ${table} (title, description, counterparty_id, number, date, end_date, scope, performer_id, file_path) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title,
        description,
        counterparty_id,
        number,
        date,
        end_date,
        scope,
        performer_id,
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
      SELECT 
        ${table}.id, 
        ${table}.title, 
        ${table}.description, 
        counterparty.name AS counterparty, 
        ${table}.number, 
        TO_CHAR(${table}.date, 'YYYY.MM.DD') AS date, 
        TO_CHAR(${table}.end_date, 'YYYY.MM.DD') AS end_date,
        ${table}.scope, 
        performers.name AS performers, 
        ${table}.file_path, 
        TO_CHAR(${table}.created_at, 'YYYY-MM-DD') AS created_at 
      FROM ${table}
      LEFT JOIN counterparty ON ${table}.counterparty_id = counterparty.id
      LEFT JOIN performers ON ${table}.performer_id = performers.id
    `;
    const values = [];

    if (search) {
      baseQuery += `
        WHERE ${table}.title ILIKE $1 OR 
              ${table}.description ILIKE $1 OR 
              counterparties.name ILIKE $1 OR 
              ${table}.number ILIKE $1 OR 
              TO_CHAR(${table}.date, 'YYYY.MM.DD') ILIKE $1 OR 
              TO_CHAR(${table}.end_date, 'YYYY.MM.DD') ILIKE $1 OR 
              ${table}.scope ILIKE $1 OR 
              performers.name ILIKE $1
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
      `SELECT 
         ${table}.id, 
         ${table}.title, 
         ${table}.description, 
         counterparty.name AS counterparty, 
         ${table}.number, 
         TO_CHAR(${table}.date, 'YYYY.MM.DD') AS date, 
         TO_CHAR(${table}.end_date, 'YYYY.MM.DD') AS end_date,
         ${table}.scope, 
         performers.name AS performers, 
         ${table}.file_path, 
         TO_CHAR(${table}.created_at, 'YYYY.MM.DD') AS created_at 
      FROM ${table}
      LEFT JOIN counterparty ON ${table}.counterparty_id = counterparty.id
      LEFT JOIN performers ON ${table}.performer_id = performers.id
      WHERE ${table}.id = $1`,
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
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file", err);
          return res
            .status(500)
            .json({ error: "Failed to delete file from server" });
        }
        console.log("File deleted successfully");
      });
    } else {
      console.log("File not found, skipping deletion");
    }

    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update contract
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
    const counterparty_id = await getOrInsertCounterparty(counterparty);
    fieldsToUpdate.counterparty_id = counterparty_id;
    updateParams.push(counterparty_id);
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
    const performer_id = await getOrInsertPerformer(performers);
    fieldsToUpdate.performer_id = performer_id;
    updateParams.push(performer_id);
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
