const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAdminEndpoints() {
  console.log('Testing Admin Endpoints...\n');

  try {
    // Test 1: Get dashboard stats
    console.log('1. Testing GET /api/admin/dashboard-stats');
    const statsResponse = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
    const statsData = await statsResponse.json();
    console.log('Status:', statsResponse.status);
    console.log('Response:', JSON.stringify(statsData, null, 2));
    console.log('---\n');

    // Test 2: Get all users
    console.log('2. Testing GET /api/admin/users');
    const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
    const usersData = await usersResponse.json();
    console.log('Status:', usersResponse.status);
    console.log('Response:', JSON.stringify(usersData, null, 2));
    console.log('---\n');

    // Test 3: Get all properties
    console.log('3. Testing GET /api/admin/properties');
    const propertiesResponse = await fetch(`${API_BASE_URL}/admin/properties`);
    const propertiesData = await propertiesResponse.json();
    console.log('Status:', propertiesResponse.status);
    console.log('Response:', JSON.stringify(propertiesData, null, 2));
    console.log('---\n');

    // Test 4: Create a new user (this will fail without proper auth, but we can see the endpoint exists)
    console.log('4. Testing POST /api/admin/users (will fail without auth)');
    const createUserResponse = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      })
    });
    const createUserData = await createUserResponse.json();
    console.log('Status:', createUserResponse.status);
    console.log('Response:', JSON.stringify(createUserData, null, 2));
    console.log('---\n');

  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

// Run the tests
testAdminEndpoints();
