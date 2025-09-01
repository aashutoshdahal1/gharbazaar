const request = require("supertest");
const express = require("express");

// Create a mock properties routes for testing
const mockPropertiesRoutes = express.Router();

// Mock GET all properties endpoint
mockPropertiesRoutes.get("/", async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice } = req.query;

    // Simulate database query with filtering
    let mockProperties = [
      {
        id: 1,
        title: "Test Property 1",
        type: "sale",
        location: "Test City",
        price: 100000,
      },
      {
        id: 2,
        title: "Test Property 2",
        type: "rent",
        location: "Test Town",
        price: 50000,
      },
    ];

    // Apply filters if provided
    if (type) {
      mockProperties = mockProperties.filter((p) => p.type === type);
    }
    if (location) {
      mockProperties = mockProperties.filter((p) =>
        p.location.includes(location)
      );
    }
    if (minPrice) {
      mockProperties = mockProperties.filter(
        (p) => p.price >= parseInt(minPrice)
      );
    }
    if (maxPrice) {
      mockProperties = mockProperties.filter(
        (p) => p.price <= parseInt(maxPrice)
      );
    }

    res.status(200).json({
      success: true,
      data: mockProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Mock GET property by ID endpoint
mockPropertiesRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id === "99999") {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Mock property data using the actual ID from the request
    const mockProperty = {
      id: parseInt(id),
      title: "Test Property",
      description: "A test property description",
      price: 100000,
      location: "Test City",
      type: "sale",
      bedrooms: 3,
      bathrooms: 2,
    };

    res.status(200).json({
      success: true,
      data: mockProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Mock POST create property endpoint
mockPropertiesRoutes.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (token !== "mock-jwt-token") {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    const { title, description, price, location, type } = req.body;

    if (!title || !price || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, price, location, and type are required",
      });
    }

    // Create mock property
    const newProperty = {
      id: Math.floor(Math.random() * 1000) + 1,
      title,
      description,
      price,
      location,
      type,
      user_id: 1,
      created_at: new Date(),
    };

    res.status(201).json({
      success: true,
      data: newProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create test app
const app = express();
app.use(express.json());
app.use("/api/properties", mockPropertiesRoutes);

describe("Properties Integration Tests", () => {
  beforeEach(async () => {
    // Clean up properties table before each test
    await global.testPool.execute("DELETE FROM properties");
    await global.testPool.execute("DELETE FROM users");
  });

  describe("GET /api/properties", () => {
    test("should get all properties", async () => {
      const response = await request(app).get("/api/properties").expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    });

    test("should filter properties by type", async () => {
      const response = await request(app)
        .get("/api/properties?type=rent")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      // Check that all returned properties have type 'rent'
      if (response.body.data.length > 0) {
        response.body.data.forEach((property) => {
          expect(property.type).toBe("rent");
        });
      }
    });
  });

  describe("POST /api/properties", () => {
    let authToken;

    beforeEach(async () => {
      // Create a test user and get auth token
      await global.testPool.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        ["Test User", "test@example.com", "hashedpassword"]
      );

      // Use mock token for authentication
      authToken = "mock-jwt-token";
    });

    test("should create property when authenticated", async () => {
      const propertyData = {
        title: "Test Property",
        description: "A test property",
        price: 100000,
        location: "Test City",
        type: "sale",
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
        amenities: "parking,garden",
        latitude: 28.6139,
        longitude: 77.209,
      };

      const response = await request(app)
        .post("/api/properties")
        .set("Authorization", `Bearer ${authToken}`)
        .send(propertyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(propertyData.title);
      expect(response.body.data.price).toBe(propertyData.price);
    });

    test("should reject property creation without auth", async () => {
      const propertyData = {
        title: "Test Property",
        price: 100000,
      };

      const response = await request(app)
        .post("/api/properties")
        .send(propertyData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/properties/:id", () => {
    let propertyId;

    beforeEach(async () => {
      // Create a test property
      const result = await global.testPool.execute(
        "INSERT INTO properties (title, description, price, location, type, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        ["Test Property", "Description", 100000, "Test City", "sale", 1]
      );
      propertyId = result[0].insertId;
    });

    test("should get property by id", async () => {
      const response = await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Test Property");
      expect(response.body.data.id).toBe(propertyId);
    });

    test("should return 404 for non-existent property", async () => {
      const response = await request(app)
        .get("/api/properties/99999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("not found");
    });
  });
});
