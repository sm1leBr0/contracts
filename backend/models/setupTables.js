const pool = require("../config/db");

const createTables = async () => {
  try {
    // Create counterparties table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counterparties (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Create performers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS performers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    // Drop existing protect table
    await pool.query(`DROP TABLE IF EXISTS protect`);

    // Create updated protect table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS protect (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        counterparty_id INTEGER REFERENCES counterparties(id),
        number VARCHAR(50) NOT NULL,
        date DATE,
        end_date DATE,
        scope TEXT,
        performer_id INTEGER REFERENCES performers(id),
        file_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Drop existing aig table
    await pool.query(`DROP TABLE IF EXISTS aig`);

    // Create updated aig table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS aig (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        counterparty_id INTEGER REFERENCES counterparties(id),
        number VARCHAR(50) NOT NULL,
        date DATE,
        end_date DATE,
        scope TEXT,
        performer_id INTEGER REFERENCES performers(id),
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
