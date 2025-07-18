const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_URL || 'https://6op1kbv0p2.execute-api.us-east-1.amazonaws.com/Prod';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testAPI() {
  console.log('🧪 Testing Restaurant Reservation API...\n');

  try {
    // Test 1: AI Agent
    console.log('1. Testing AI Agent...');
    const aiResponse = await api.post('/ai-agent', {
      prompt: 'book table for 3 persons today at 7 pm'
    });
    console.log('✅ AI Agent Response:', aiResponse.data);
    console.log('');

    // Test 2: Create Customer
    console.log('2. Testing Customer Creation...');
    const customerData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone_number: '(555) 123-4567',
      preferences: {
        dietary_restrictions: 'none',
        seating_preference: 'window'
      },
      loyalty_status: 'bronze'
    };
    const customerResponse = await api.post('/customers', customerData);
    console.log('✅ Customer Created:', customerResponse.data.customer.customer_id);
    console.log('');

    // Test 3: Create Restaurant
    console.log('3. Testing Restaurant Creation...');
    const restaurantData = {
      name: 'Test Restaurant',
      location: '123 Test Street',
      cuisine_type: 'Italian',
      rating: 4.5,
      opening_hours: {
        monday: { open: '11:00', close: '22:00' }
      },
      contact_info: {
        phone: '(555) 987-6543',
        email: 'info@testrestaurant.com'
      }
    };
    const restaurantResponse = await api.post('/restaurants', restaurantData);
    console.log('✅ Restaurant Created:', restaurantResponse.data.restaurant.restaurant_id);
    console.log('');

    // Test 4: Create Table
    console.log('4. Testing Table Creation...');
    const tableData = {
      restaurant_id: restaurantResponse.data.restaurant.restaurant_id,
      table_number: 'T1',
      seating_capacity: 4,
      location_type: 'indoor'
    };
    const tableResponse = await api.post('/tables', tableData);
    console.log('✅ Table Created:', tableResponse.data.table.table_id);
    console.log('');

    // Test 5: Create Reservation
    console.log('5. Testing Reservation Creation...');
    const reservationData = {
      customer_id: customerResponse.data.customer.customer_id,
      restaurant_id: restaurantResponse.data.restaurant.restaurant_id,
      table_id: tableResponse.data.table.table_id,
      reservation_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      party_size: 3,
      special_requests: ['Window seat preferred']
    };
    const reservationResponse = await api.post('/reservations', reservationData);
    console.log('✅ Reservation Created:', reservationResponse.data.reservation.reservation_id);
    console.log('');

    // Test 6: Get Available Tables
    console.log('6. Testing Available Tables...');
    const availableTablesResponse = await api.get('/reservations/available-tables', {
      params: {
        restaurant_id: restaurantResponse.data.restaurant.restaurant_id,
        party_size: 4,
        reservation_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // Day after tomorrow
      }
    });
    console.log('✅ Available Tables:', availableTablesResponse.data.availableTables.length, 'tables found');
    console.log('');

    // Test 7: Get Reservation
    console.log('7. Testing Get Reservation...');
    const getReservationResponse = await api.get(`/reservations/${reservationResponse.data.reservation.reservation_id}`);
    console.log('✅ Reservation Retrieved:', getReservationResponse.data.reservation.status);
    console.log('');

    console.log('🎉 All API tests passed successfully!');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('- AI Agent: ✅ Working');
    console.log('- Customer Management: ✅ Working');
    console.log('- Restaurant Management: ✅ Working');
    console.log('- Table Management: ✅ Working');
    console.log('- Reservation Management: ✅ Working');
    console.log('- Availability Checking: ✅ Working');

  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

// Run the test
testAPI(); 