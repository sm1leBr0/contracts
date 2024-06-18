const pool = require("../config/db");

const createTables = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS contracts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
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
