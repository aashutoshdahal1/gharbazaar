const express = require("express");
const { pool } = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Get all properties
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let query = `
      SELECT 
        l.*,
        u.name as owner_name,
        u.email as owner_email
      FROM listings l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
    `;

    // Add limit if specified
    if (limit && !isNaN(limit)) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const [properties] = await pool.execute(query);

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get properties by user
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Ensure user can only get their own properties (unless admin)
    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const [properties] = await pool.execute(
      "SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Get user properties error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get my properties (for logged in user)
router.get("/my-listings", authenticateToken, async (req, res) => {
  try {
    const [properties] = await pool.execute(
      "SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Get my properties error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create new property with image upload
router.post(
  "/",
  authenticateToken,
  upload.array("images", 10),
  async (req, res) => {
    const {
      title,
      price,
      propertyType,
      address,
      description,
      purpose,
      area,
      phoneNumber,
      latitude,
      longitude,
    } = req.body;

    try {
      // Validate input
      if (!title || !price || !propertyType || !address) {
        return res.status(400).json({
          success: false,
          message: "Title, price, property type, and address are required",
        });
      }

      // Process uploaded files
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          // Store relative path for database
          imageUrls.push(`/uploads/properties/${file.filename}`);
        });
      }

      // Insert new property using listings table structure
      const [result] = await pool.execute(
        `INSERT INTO listings 
       (user_id, title, description, property_type, purpose, price, location, area, phone_number, images, latitude, longitude, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          req.user.id,
          title,
          description || null,
          propertyType,
          purpose || "rent",
          price,
          address,
          area || null,
          phoneNumber || null,
          JSON.stringify(imageUrls),
          latitude || null,
          longitude || null,
        ]
      );

      // Get the created property
      const [newProperty] = await pool.execute(
        "SELECT * FROM listings WHERE id = ?",
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: "Property listed successfully",
        data: newProperty[0],
      });
    } catch (error) {
      console.error("Create property error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Get single property
router.get("/:id", async (req, res) => {
  try {
    const [property] = await pool.execute(
      `
      SELECT 
        l.*,
        u.name as owner_name,
        u.email as owner_email
      FROM listings l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `,
      [req.params.id]
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property[0],
    });
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update property with image upload
router.put(
  "/:id",
  authenticateToken,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const propertyId = req.params.id;
      const {
        title,
        price,
        propertyType,
        address,
        description,
        purpose,
        area,
        phoneNumber,
        latitude,
        longitude,
        existingImages,
      } = req.body;

      // Check if property exists and belongs to user
      const [existingProperty] = await pool.execute(
        "SELECT * FROM listings WHERE id = ?",
        [propertyId]
      );

      if (existingProperty.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      if (
        existingProperty[0].user_id !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Process uploaded files
      const newImageUrls = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          // Store relative path for database
          newImageUrls.push(`/uploads/properties/${file.filename}`);
        });
      }

      // Combine existing images with new ones
      let existingImageUrls = [];
      let coverIndex = 0;

      if (existingImages) {
        const parsedImages = JSON.parse(existingImages);
        // Handle both old format (array of strings) and new format (array of objects)
        existingImageUrls = parsedImages.map((img, index) => {
          if (typeof img === "string") {
            return img;
          } else {
            // New format with cover info
            if (img.isCover) {
              coverIndex = index;
            }
            return img.url;
          }
        });
      }

      // Add new images to existing ones
      const allImages = [...existingImageUrls, ...newImageUrls];

      // If we have a coverImageIndex from request body, use it
      if (req.body.coverImageIndex !== undefined) {
        coverIndex = parseInt(req.body.coverImageIndex);
      }

      // Create final image array with cover information
      const finalImages = allImages.map((imageUrl, index) => ({
        url: imageUrl,
        isCover: index === coverIndex,
      }));

      // Update property
      await pool.execute(
        `UPDATE listings 
       SET title = ?, description = ?, property_type = ?, purpose = ?, price = ?, location = ?, area = ?, phone_number = ?, images = ?, latitude = ?, longitude = ?
       WHERE id = ?`,
        [
          title,
          description,
          propertyType,
          purpose || "rent",
          price,
          address,
          area || null,
          phoneNumber || null,
          JSON.stringify(finalImages),
          latitude || null,
          longitude || null,
          propertyId,
        ]
      );

      // Get updated property
      const [updatedProperty] = await pool.execute(
        "SELECT * FROM listings WHERE id = ?",
        [propertyId]
      );

      res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: updatedProperty[0],
      });
    } catch (error) {
      console.error("Update property error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Delete property
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Check if property exists and belongs to user
    const [existingProperty] = await pool.execute(
      "SELECT * FROM listings WHERE id = ?",
      [propertyId]
    );

    if (existingProperty.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (
      existingProperty[0].user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Delete property
    await pool.execute("DELETE FROM listings WHERE id = ?", [propertyId]);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
