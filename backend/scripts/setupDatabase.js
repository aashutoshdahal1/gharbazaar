const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  let connection;

  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      port: process.env.DB_PORT || 3306,
    });

    console.log("Connected to MySQL server");

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || "gharbazaar";
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Create tables from SQL file
    const fs = require("fs");
    const path = require("path");
    const sqlFilePath = path.join(__dirname, "../../database.sql");

    if (fs.existsSync(sqlFilePath)) {
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      // Split SQL statements and execute them
      const statements = sqlContent
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0);

      for (const statement of statements) {
        try {
          await connection.query(statement);
          console.log("✅ Executed SQL statement successfully");
        } catch (error) {
          if (error.code === "ER_TABLE_EXISTS_ERROR") {
            console.log("⚠️  Table already exists, skipping...");
          } else {
            console.error("❌ Error executing statement:", error.message);
          }
        }
      }

      console.log("🎉 Database setup completed successfully!");

      // Check and add missing columns
      await ensureRequiredColumns(connection);
    } else {
      console.error("❌ SQL file not found:", sqlFilePath);
    }
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

async function ensureRequiredColumns(connection) {
  console.log("🔍 Checking for missing columns...");

  try {
    // Define required columns for each table
    const requiredColumns = {
      listings: {
        phone_number: "VARCHAR(20)",
        area: "VARCHAR(100)",
        latitude: "DECIMAL(10, 8)",
        longitude: "DECIMAL(11, 8)",
      },
      users: {
        role: "ENUM('user', 'admin') DEFAULT 'user'",
      },
    };

    for (const [tableName, columns] of Object.entries(requiredColumns)) {
      console.log(`📋 Checking table: ${tableName}`);

      // Get existing columns
      const [existingColumns] = await connection.execute(
        `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
      `,
        [tableName]
      );

      const existingColumnNames = existingColumns.map((col) => col.COLUMN_NAME);

      // Check each required column
      for (const [columnName, columnDefinition] of Object.entries(columns)) {
        if (!existingColumnNames.includes(columnName)) {
          console.log(`➕ Adding missing column: ${tableName}.${columnName}`);

          try {
            await connection.execute(`
              ALTER TABLE ${tableName} 
              ADD COLUMN ${columnName} ${columnDefinition}
            `);
            console.log(`✅ Successfully added ${tableName}.${columnName}`);
          } catch (error) {
            console.error(
              `❌ Error adding ${tableName}.${columnName}:`,
              error.message
            );
          }
        } else {
          console.log(`✅ Column ${tableName}.${columnName} already exists`);
        }
      }
    }

    console.log("🎉 Column verification completed!");
  } catch (error) {
    console.error("❌ Error checking columns:", error.message);
  }
}
module.exports = setupDatabase;
