const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// Get user's favorites
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [favorites] = await pool.execute(
      `
      SELECT f.*, l.*, u.name as owner_name
      FROM favorites f
      JOIN listings l ON f.listing_id = l.id
      JOIN users u ON l.user_id = u.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `,
      [userId]
    );

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching favorites",
    });
  }
});

// Add to favorites
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listing_id } = req.body;

    if (!listing_id) {
      return res.status(400).json({
        success: false,
        message: "Listing ID is required",
      });
    }

    // Check if listing exists
    const [listings] = await pool.execute(
      "SELECT id FROM listings WHERE id = ?",
      [listing_id]
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if already favorited
    const [existing] = await pool.execute(
      "SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Listing already in favorites",
      });
    }

    // Add to favorites
    await pool.execute(
      "INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)",
      [userId, listing_id]
    );

    res.json({
      success: true,
      message: "Added to favorites successfully",
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to favorites",
    });
  }
});

// Remove from favorites
router.delete("/:listing_id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listing_id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM favorites WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.json({
      success: true,
      message: "Removed from favorites successfully",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from favorites",
    });
  }
});

// Check if listing is favorited by user
router.get("/check/:listing_id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listing_id } = req.params;

    const [favorites] = await pool.execute(
      "SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    res.json({
      success: true,
      isFavorited: favorites.length > 0,
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking favorite status",
    });
  }
});

module.exports = router;
