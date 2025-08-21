const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// POST /api/contact/submit - Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Insert contact submission
    const [result] = await pool.execute(
      "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: {
        id: result.insertId,
        name,
        email,
        subject,
        message,
      },
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit message. Please try again.",
      error: error.message,
    });
  }
});

// GET /api/contact/submissions - Get all contact submissions (admin only)
router.get("/submissions", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        name, 
        email, 
        subject, 
        message, 
        status,
        created_at,
        updated_at
      FROM contact_submissions 
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query);

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact submissions",
      error: error.message,
    });
  }
});

// PUT /api/contact/submissions/:id/status - Update submission status (admin only)
router.put("/submissions/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    const [result] = await pool.execute(
      "UPDATE contact_submissions SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact submission status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
});

// DELETE /api/contact/submissions/:id - Delete contact submission (admin only)
router.delete("/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM contact_submissions WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    res.json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact submission",
      error: error.message,
    });
  }
});

module.exports = router;
