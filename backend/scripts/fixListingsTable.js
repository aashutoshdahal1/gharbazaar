const mysql = require("mysql2/promise");

async function fixListingsTable() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "gharbazaar",
    });

    console.log("Connected to MySQL database");

    // Disable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    // First, backup existing data
    console.log("📦 Backing up existing listings data...");
    const [existingListings] = await connection.execute(
      "SELECT * FROM listings"
    );

    // Drop the table
    console.log("🗑️ Dropping listings table...");
    await connection.execute("DROP TABLE IF EXISTS listings");

    // Recreate with correct schema
    console.log("🏗️ Creating listings table with phone_number field...");
    await connection.execute(`
      CREATE TABLE listings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        property_type ENUM('land', 'room', 'flat', 'house') NOT NULL,
        purpose ENUM('rent', 'buy', 'sell') NOT NULL,
        price DECIMAL(12, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        area VARCHAR(100),
        phone_number VARCHAR(20),
        images TEXT,
        latitude DECIMAL(10, 8) NULL,
        longitude DECIMAL(11, 8) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Restore existing data
    if (existingListings.length > 0) {
      console.log(
        `📥 Restoring ${existingListings.length} existing listings...`
      );

      for (const listing of existingListings) {
        await connection.execute(
          `
          INSERT INTO listings 
          (id, user_id, title, description, property_type, purpose, price, location, area, phone_number, images, latitude, longitude, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            listing.id,
            listing.user_id,
            listing.title,
            listing.description,
            listing.property_type,
            listing.purpose,
            listing.price,
            listing.location,
            listing.area,
            null, // phone_number (will be null for existing listings)
            listing.images,
            listing.latitude,
            listing.longitude,
            listing.created_at,
          ]
        );
      }
    }

    // Re-enable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Successfully fixed listings table with phone_number field");

    // Verify the fix
    const [columns] = await connection.execute("DESCRIBE listings");
    console.log("\n📋 Updated table structure:");
    columns.forEach((col) => {
      if (col.Field === "phone_number") {
        console.log(
          `✅ ${col.Field.padEnd(20)} | ${col.Type.padEnd(
            15
          )} | ${col.Null.padEnd(5)}`
        );
      }
    });
  } catch (error) {
    console.error("❌ Error fixing listings table:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixListingsTable();
