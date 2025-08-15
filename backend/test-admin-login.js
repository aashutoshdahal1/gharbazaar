const fetch = require("node-fetch");

async function testAdminLogin() {
  try {
    console.log("Testing admin login endpoint...");

    const response = await fetch("http://localhost:5001/api/auth/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@gharbazaar.com",
        password: "admin123",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Admin login successful!");
      console.log("Token:", data.data.token);
      console.log("Admin user:", data.data.user);

      // Test admin protected route
      const adminResponse = await fetch(
        "http://localhost:5001/api/admin/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${data.data.token}`,
          },
        }
      );

      const adminData = await adminResponse.json();

      if (adminResponse.ok) {
        console.log("✅ Admin dashboard access successful!");
        console.log("Dashboard stats:", adminData.data);
      } else {
        console.log("❌ Admin dashboard access failed:", adminData);
      }
    } else {
      console.log("❌ Admin login failed:", data);
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

testAdminLogin();
