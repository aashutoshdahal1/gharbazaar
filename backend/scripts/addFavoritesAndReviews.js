const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "gharbazaar",
};

async function addFavoritesAndReviews() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database");

    // Create favorites table
    const createFavoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        listing_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_favorite (user_id, listing_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
      );
    `;

    // Create reviews table
    const createReviewsTable = `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        listing_id INT NOT NULL,
        user_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_review (listing_id, user_id),
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await connection.execute(createFavoritesTable);
    console.log("✅ Favorites table created successfully");

    await connection.execute(createReviewsTable);
    console.log("✅ Reviews table created successfully");

    console.log("🎉 Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addFavoritesAndReviews();
