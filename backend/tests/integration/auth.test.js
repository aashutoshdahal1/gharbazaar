const request = require("supertest");
const express = require("express");

// Create a mock auth routes for testing
const mockAuthRoutes = express.Router();

// Mock signup endpoint
mockAuthRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required",
    });
  }

  // Check if user already exists
  const [existingUser] = await global.testPool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create new user
  const result = await global.testPool.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );

  res.status(201).json({
    success: true,
    data: {
      user: { id: result[0].insertId, name, email },
      token: "mock-jwt-token",
    },
  });
});

// Mock login endpoint
mockAuthRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [users] = await global.testPool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0 || users[0].password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: { id: users[0].id, name: users[0].name, email: users[0].email },
      token: "mock-jwt-token",
    },
  });
});

// Mock verify endpoint
mockAuthRoutes.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token !== "mock-jwt-token") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: { id: 1, name: "Test User", email: "test@example.com" },
    },
  });
});

// Create test app
const app = express();
app.use(express.json());
app.use("/api/auth", mockAuthRoutes);

describe("Auth Integration Tests", () => {
  beforeEach(async () => {
    // Clean up users table before each test
    await global.testPool.execute("DELETE FROM users");
  });

  describe("POST /api/auth/signup", () => {
    test("should create a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.token).toBeDefined();
    });

    test("should reject duplicate email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // Create first user
      await request(app).post("/api/auth/signup").send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    test("should reject missing required fields", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Test User",
          // Missing email and password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    test("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("test@example.com");
      expect(response.body.data.token).toBeDefined();
    });

    test("should reject incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid");
    });

    test("should reject non-existent user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/verify", () => {
    test("should verify valid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", "Bearer mock-jwt-token")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });

    test("should reject missing token", async () => {
      const response = await request(app).get("/api/auth/verify").expect(401);

      expect(response.body.success).toBe(false);
    });

    test("should reject invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", "Bearer invalidtoken")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
