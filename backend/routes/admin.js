const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Admin middleware to check if user is admin
const adminAuth = (req, res, next) => {
  // For now, we'll use a simple check
  // In production, you'd verify JWT token and check admin role
  const adminToken = req.headers.authorization?.split(" ")[1];

  if (!adminToken) {
    return res.status(401).json({
      success: false,
      message: "No admin token provided",
    });
  }

  // For demo purposes, we'll allow any token
  // In production, verify JWT and check admin role from database
  next();
};

// GET /api/admin/users - Get all users for admin dashboard
router.get("/users", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        name, 
        email, 
        role,
        created_at
      FROM users 
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// GET /api/admin/dashboard-stats - Get dashboard statistics
router.get("/dashboard-stats", async (req, res) => {
  try {
    // Get total listings
    const [listingsResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM listings"
    );
    const totalListings = listingsResult[0].count;

    // Get total users
    const [usersResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM users"
    );
    const totalUsers = usersResult[0].count;

    // Get recent listings (last 5)
    const [recentListings] = await pool.execute(`
      SELECT id, title, price, location, created_at 
      FROM listings 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Get recent users (last 5)
    const [recentUsers] = await pool.execute(`
      SELECT id, name, email, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        totalListings,
        totalUsers,
        recentListings,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
});

// GET /api/admin/properties - Get all properties for admin management
router.get("/properties", async (req, res) => {
  try {
    const query = `
      SELECT 
        l.*,
        u.name as owner_name,
        u.email as owner_email
      FROM listings l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
    `;

    const [rows] = await pool.execute(query);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("Error fetching properties for admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
});

// DELETE /api/admin/properties/:id - Delete a property (admin only)
router.delete("/properties/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM listings WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete property",
      error: error.message,
    });
  }
});

// DELETE /api/admin/users/:id - Delete a user (admin only)
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // First delete user's listings
    await pool.execute("DELETE FROM listings WHERE user_id = ?", [id]);

    // Then delete the user
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User and associated listings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;
