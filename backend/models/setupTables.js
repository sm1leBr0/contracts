const pool = require("../config/db");

const createTables = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL
    );`);

    await pool.query(`DROP TABLE IF EXISTS counterparty CASCADE`);
    await pool.query(`CREATE TABLE IF NOT EXISTS counterparty (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );`);

    await pool.query(`DROP TABLE IF EXISTS performers CASCADE`);
    await pool.query(`CREATE TABLE IF NOT EXISTS performers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );`);

    await pool.query(`DROP TABLE IF EXISTS protect`);
    await pool.query(`CREATE TABLE IF NOT EXISTS protect (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      counterparty_id INTEGER REFERENCES counterparty(id) ON DELETE SET NULL,
      number VARCHAR(50) NOT NULL,
      date DATE,
      end_date DATE,
      condition TEXT,
      performer_id INTEGER REFERENCES performers(id),
      file_path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    await pool.query(`DROP TABLE IF EXISTS aig`);
    await pool.query(`CREATE TABLE IF NOT EXISTS aig (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      counterparty_id INTEGER REFERENCES counterparty(id) ON DELETE SET NULL,
      number VARCHAR(50) NOT NULL,
      date DATE,
      end_date DATE,
      condition TEXT,
      performer_id INTEGER REFERENCES performers(id),
      file_path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    pool.end();
  }
};

createTables();
