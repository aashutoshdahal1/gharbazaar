const express = require("express");
const { pool } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all conversations for the logged-in user
router.get("/conversations", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // First, get all unique conversations
    const [conversations] = await pool.execute(
      `
      SELECT DISTINCT
        l.id as listing_id,
        l.title as listing_title,
        l.location as listing_location,
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END as other_user_id,
        CASE 
          WHEN m.sender_id = ? THEN u_receiver.name
          ELSE u_sender.name
        END as other_user_name,
        CASE 
          WHEN m.sender_id = ? THEN u_receiver.email
          ELSE u_sender.email
        END as other_user_email
      FROM messages m
      JOIN listings l ON m.listing_id = l.id
      JOIN users u_sender ON m.sender_id = u_sender.id
      JOIN users u_receiver ON m.receiver_id = u_receiver.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
    `,
      [userId, userId, userId, userId, userId]
    );

    // Now get the last message and unread count for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const [lastMessage] = await pool.execute(
          `
          SELECT message, created_at
          FROM messages
          WHERE listing_id = ? 
          AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
          ORDER BY created_at DESC
          LIMIT 1
        `,
          [
            conversation.listing_id,
            userId,
            conversation.other_user_id,
            conversation.other_user_id,
            userId,
          ]
        );

        const [unreadCount] = await pool.execute(
          `
          SELECT COUNT(*) as count
          FROM messages
          WHERE receiver_id = ? 
          AND sender_id = ? 
          AND listing_id = ? 
          AND is_read = FALSE
        `,
          [userId, conversation.other_user_id, conversation.listing_id]
        );

        return {
          ...conversation,
          last_message: lastMessage[0]?.message || "",
          last_message_time: lastMessage[0]?.created_at || new Date(),
          unread_count: unreadCount[0]?.count || 0,
        };
      })
    );

    // Sort by last message time
    conversationsWithDetails.sort(
      (a, b) => new Date(b.last_message_time) - new Date(a.last_message_time)
    );

    res.status(200).json({
      success: true,
      data: conversationsWithDetails,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get messages for a specific conversation (listing + other user)
router.get(
  "/conversation/:listingId/:otherUserId",
  authenticateToken,
  async (req, res) => {
    try {
      const { listingId, otherUserId } = req.params;
      const userId = req.user.id;

      // Check if user has access to this conversation
      const [listing] = await pool.execute(
        "SELECT user_id FROM listings WHERE id = ?",
        [listingId]
      );

      if (listing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      // User can only see messages if they are either:
      // 1. The owner of the listing, OR
      // 2. One of the participants in the conversation (sender or receiver)
      const isListingOwner = listing[0].user_id === userId;
      const isParticipant = parseInt(otherUserId) === userId;

      // Check if there are any messages between these users for this listing
      const [existingMessages] = await pool.execute(
        `
      SELECT COUNT(*) as count 
      FROM messages 
      WHERE listing_id = ? 
      AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
    `,
        [listingId, userId, otherUserId, otherUserId, userId]
      );

      const hasMessageHistory = existingMessages[0].count > 0;

      if (!isListingOwner && !isParticipant && !hasMessageHistory) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Get messages for this conversation
      const [messages] = await pool.execute(
        `
      SELECT 
        m.*,
        l.title as listing_title,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN listings l ON m.listing_id = l.id
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.listing_id = ? 
      AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
      ORDER BY m.created_at ASC
    `,
        [listingId, userId, otherUserId, otherUserId, userId]
      );

      // Mark messages as read
      await pool.execute(
        `
      UPDATE messages 
      SET is_read = TRUE 
      WHERE receiver_id = ? AND sender_id = ? AND listing_id = ? AND is_read = FALSE
    `,
        [userId, otherUserId, listingId]
      );

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error("Get conversation messages error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Get all messages for the logged-in user (both sent and received)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [messages] = await pool.execute(
      `
      SELECT 
        m.*,
        l.title as listing_title,
        l.id as listing_id,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN listings l ON m.listing_id = l.id
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC
    `,
      [userId, userId]
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get messages for a specific listing (only for listing owner)
router.get("/listing/:listingId", authenticateToken, async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    // Check if user is the owner of the listing
    const [listing] = await pool.execute(
      "SELECT user_id FROM listings WHERE id = ?",
      [listingId]
    );

    if (listing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Only the listing owner can see messages for their listing
    if (listing[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only the listing owner can view messages for this listing.",
      });
    }

    const [messages] = await pool.execute(
      `
      SELECT 
        m.*,
        l.title as listing_title,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN listings l ON m.listing_id = l.id
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.listing_id = ?
      ORDER BY m.created_at ASC
    `,
      [listingId]
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get listing messages error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Send a new message
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { receiver_id, listing_id, message } = req.body;
    const sender_id = req.user.id;

    // Validate input
    if (!receiver_id || !listing_id || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID, listing ID, and message are required",
      });
    }

    // Check if listing exists and get owner
    const [listing] = await pool.execute(
      "SELECT user_id, title FROM listings WHERE id = ?",
      [listing_id]
    );

    if (listing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if receiver exists
    const [receiver] = await pool.execute(
      "SELECT id, name FROM users WHERE id = ?",
      [receiver_id]
    );

    if (receiver.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Insert the message
    const [result] = await pool.execute(
      `
      INSERT INTO messages (sender_id, receiver_id, listing_id, message, subject)
      VALUES (?, ?, ?, ?, ?)
    `,
      [sender_id, receiver_id, listing_id, message, `Re: ${listing[0].title}`]
    );

    // Get the created message with details
    const [newMessage] = await pool.execute(
      `
      SELECT 
        m.*,
        l.title as listing_title,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN listings l ON m.listing_id = l.id
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.id = ?
    `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage[0],
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Mark message as read
router.patch("/:messageId/read", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user has access to it
    const [message] = await pool.execute(
      "SELECT * FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)",
      [messageId, userId, userId]
    );

    if (message.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Mark as read
    await pool.execute("UPDATE messages SET is_read = TRUE WHERE id = ?", [
      messageId,
    ]);

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark message read error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete a message
router.delete("/:messageId", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and user is the sender
    const [message] = await pool.execute(
      "SELECT * FROM messages WHERE id = ? AND sender_id = ?",
      [messageId, userId]
    );

    if (message.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or access denied",
      });
    }

    // Delete the message
    await pool.execute("DELETE FROM messages WHERE id = ?", [messageId]);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
