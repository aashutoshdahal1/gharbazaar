const mysql = require("mysql2/promise");

async function addPhoneColumn() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "gharbazaar",
    });

    console.log("Connected to MySQL database");

    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'gharbazaar' 
      AND TABLE_NAME = 'listings' 
      AND COLUMN_NAME = 'phone_number'
    `);

    if (columns.length > 0) {
      console.log("phone_number column already exists");
      return;
    }

    // Add the phone_number column
    await connection.execute(`
      ALTER TABLE listings 
      ADD COLUMN phone_number VARCHAR(20)
    `);

    console.log("✅ Successfully added phone_number column to listings table");

    // Verify the column was added
    const [newColumns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'gharbazaar' 
      AND TABLE_NAME = 'listings' 
      AND COLUMN_NAME = 'phone_number'
    `);

    if (newColumns.length > 0) {
      console.log("✅ Verified: phone_number column exists in listings table");
    }
  } catch (error) {
    console.error("❌ Error adding phone_number column:", error.message);
    console.error("Full error:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

addPhoneColumn();
