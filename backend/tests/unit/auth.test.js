const {
  hashPassword,
  comparePassword,
  validateEmail,
  validatePassword,
} = require("../../utils/auth");

describe("Auth Utils", () => {
  describe("hashPassword", () => {
    test("should hash password correctly", async () => {
      const password = "testpassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    test("should generate different hashes for same password", async () => {
      const password = "testpassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    test("should return true for correct password", async () => {
      const password = "testpassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    test("should return false for incorrect password", async () => {
      const password = "testpassword123";
      const wrongPassword = "wrongpassword";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });
  });

  describe("validateEmail", () => {
    test("should return true for valid emails", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "admin@gharbazaar.com",
      ];

      validEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    test("should return false for invalid emails", () => {
      const invalidEmails = [
        "notanemail",
        "@domain.com",
        "user@",
        "user name@domain.com",
      ];

      invalidEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe("validatePassword", () => {
    test("should return valid for strong passwords", () => {
      const strongPasswords = ["password123", "myStrongPassword", "test123456"];

      strongPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
      });
    });

    test("should return invalid for weak passwords", () => {
      const weakPasswords = ["short", "12345", "", null, undefined];

      weakPasswords.forEach((password) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain("at least 6 characters");
      });
    });
  });
});
