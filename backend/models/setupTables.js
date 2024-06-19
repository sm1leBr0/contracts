const pool = require("../config/db");

const createTables = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS contracts;

      CREATE TABLE IF NOT EXISTS contracts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        counterparty VARCHAR(100),
        number VARCHAR(50) NOT NULL,
        date DATE,
        end_date DATE,
        scope TEXT,
        performers TEXT,
        file_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
       DROP TABLE IF EXISTS users;

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin'))
      )
    `);

    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    pool.end();
  }
};

createTables();
