const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// Get reviews for a listing
router.get("/listing/:listing_id", async (req, res) => {
  try {
    const { listing_id } = req.params;

    const [reviews] = await pool.execute(
      `
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.listing_id = ?
      ORDER BY r.created_at DESC
    `,
      [listing_id]
    );

    // Calculate average rating
    const [avgResult] = await pool.execute(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE listing_id = ?",
      [listing_id]
    );

    const avgRating = avgResult[0].avg_rating || 0;
    const totalReviews = avgResult[0].total_reviews || 0;

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: parseFloat(avgRating).toFixed(1),
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
});

// Add or update a review
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listing_id, rating, review_text } = req.body;

    if (!listing_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Listing ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if listing exists
    const [listings] = await pool.execute(
      "SELECT id, user_id FROM listings WHERE id = ?",
      [listing_id]
    );

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Prevent users from reviewing their own listings
    if (listings[0].user_id === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot review your own listing",
      });
    }

    // Check if user already reviewed this listing
    const [existing] = await pool.execute(
      "SELECT id FROM reviews WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    if (existing.length > 0) {
      // Update existing review
      await pool.execute(
        "UPDATE reviews SET rating = ?, review_text = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND listing_id = ?",
        [rating, review_text || null, userId, listing_id]
      );

      res.json({
        success: true,
        message: "Review updated successfully",
      });
    } else {
      // Create new review
      await pool.execute(
        "INSERT INTO reviews (user_id, listing_id, rating, review_text) VALUES (?, ?, ?, ?)",
        [userId, listing_id, rating, review_text || null]
      );

      res.json({
        success: true,
        message: "Review added successfully",
      });
    }
  } catch (error) {
    console.error("Error adding/updating review:", error);
    res.status(500).json({
      success: false,
      message: "Error processing review",
    });
  }
});

// Delete a review
router.delete("/:listing_id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listing_id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM reviews WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
    });
  }
});

// Get user's review for a specific listing
router.get("/user/:listing_id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { listing_id } = req.params;

    const [reviews] = await pool.execute(
      "SELECT * FROM reviews WHERE user_id = ? AND listing_id = ?",
      [userId, listing_id]
    );

    res.json({
      success: true,
      data: reviews.length > 0 ? reviews[0] : null,
    });
  } catch (error) {
    console.error("Error fetching user review:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user review",
    });
  }
});

module.exports = router;
