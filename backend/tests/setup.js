// In-memory mock database for testing
const mockDatabase = {
  users: [],
  listings: [],
  favorites: [],
  nextUserId: 1,
  nextListingId: 1,
  nextFavoriteId: 1,
};

// Mock database pool with basic operations
const mockPool = {
  execute: async (query, params = []) => {
    // Handle DELETE operations
    if (query.includes("DELETE FROM users")) {
      mockDatabase.users = [];
      return [{ affectedRows: mockDatabase.users.length }];
    }
    if (query.includes("DELETE FROM listings")) {
      mockDatabase.listings = [];
      return [{ affectedRows: mockDatabase.listings.length }];
    }
    if (query.includes("DELETE FROM favorites")) {
      mockDatabase.favorites = [];
      return [{ affectedRows: mockDatabase.favorites.length }];
    }

    // Handle test queries
    if (query.includes("SELECT 1 as test")) {
      return [[{ test: 1 }]];
    }

    // Handle INSERT operations
    if (query.includes("INSERT INTO users")) {
      const user = {
        id: mockDatabase.nextUserId++,
        name: params[0] || "Test User",
        email: params[1] || "test@example.com",
        password: params[2] || "hashedpassword",
        role: "user",
        created_at: new Date(),
      };
      mockDatabase.users.push(user);
      return [{ insertId: user.id, affectedRows: 1 }];
    }

    if (query.includes("INSERT INTO properties")) {
      const property = {
        id: mockDatabase.nextListingId++,
        title: params[0] || "Test Property",
        description: params[1] || "Test Description",
        price: params[2] || 100000,
        location: params[3] || "Test City",
        type: params[4] || "sale",
        user_id: params[5] || 1,
        created_at: new Date(),
      };
      mockDatabase.listings.push(property);
      return [{ insertId: property.id, affectedRows: 1 }];
    }

    // Handle SELECT operations
    if (query.includes("SELECT * FROM users WHERE email")) {
      const email = params[0];
      const user = mockDatabase.users.find((u) => u.email === email);
      return [user ? [user] : []];
    }

    if (query.includes("SELECT * FROM users WHERE id")) {
      const id = params[0];
      const user = mockDatabase.users.find((u) => u.id === id);
      return [user ? [user] : []];
    }

    // Default empty result
    return [[]];
  },

  getConnection: async () => ({
    beginTransaction: async () => {},
    execute: mockPool.execute,
    rollback: async () => {},
    commit: async () => {},
    release: () => {},
  }),
};

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.DB_NAME = "gharbazaar_test";

// Setup before all tests
beforeAll(async () => {
  // Make mock pool available globally
  global.testPool = mockPool;
});

// Clean up data before each test
beforeEach(async () => {
  mockDatabase.users = [];
  mockDatabase.listings = [];
  mockDatabase.favorites = [];
  mockDatabase.nextUserId = 1;
  mockDatabase.nextListingId = 1;
  mockDatabase.nextFavoriteId = 1;
});

// Cleanup after all tests
afterAll(async () => {
  // Reset mock database
  mockDatabase.users = [];
  mockDatabase.listings = [];
  mockDatabase.favorites = [];
});
