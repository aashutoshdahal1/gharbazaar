const mysql = require("mysql2/promise");

async function checkTableStructure() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "gharbazaar",
    });

    console.log("Connected to MySQL database");

    // Show table structure
    const [columns] = await connection.execute(`
      DESCRIBE listings
    `);

    console.log("\n📋 Current listings table structure:");
    console.log("=====================================");
    columns.forEach((col) => {
      console.log(
        `${col.Field.padEnd(20)} | ${col.Type.padEnd(15)} | ${col.Null.padEnd(
          5
        )} | ${col.Key.padEnd(5)} | ${col.Default || "NULL"}`
      );
    });

    // Check specific phone column variants
    const phoneColumns = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'gharbazaar' 
      AND TABLE_NAME = 'listings' 
      AND COLUMN_NAME LIKE '%phone%'
    `);

    console.log("\n📞 Phone-related columns found:");
    phoneColumns[0].forEach((col) => {
      console.log(`- ${col.COLUMN_NAME}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTableStructure();
