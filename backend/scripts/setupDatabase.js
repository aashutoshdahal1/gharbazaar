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
module.exports = setupDatabase;
