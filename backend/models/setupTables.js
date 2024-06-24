const pool = require("../config/db");

const createTables = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS protect;

      CREATE TABLE IF NOT EXISTS protect (
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
       DROP TABLE IF EXISTS aig;

      CREATE TABLE IF NOT EXISTS aig (
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

    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    pool.end();
  }
};

createTables();
