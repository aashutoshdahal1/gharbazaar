const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

async function createAdmin() {
  try {
    // Admin credentials
    const adminEmail = "admin@gharbazaar.com";
    const adminPassword = "admin123";
    const adminName = "Admin User";

    // Check if admin already exists
    const [existingAdmin] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existingAdmin.length > 0) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Insert admin user
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [adminName, adminEmail, hashedPassword, "admin"]
    );

    console.log("Admin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("User ID:", result.insertId);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit();
  }
}

// Run the script if called directly
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
