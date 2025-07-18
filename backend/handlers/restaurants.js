const DynamoDBService = require('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

const restaurantsDB = new DynamoDBService(process.env.RESTAURANTS_TABLE);

exports.create = async (event) => {
  try {
    const { name, location, cuisine_type, rating, opening_hours, contact_info } = JSON.parse(event.body);
    
    if (!name || !location || !cuisine_type) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Name, location, and cuisine type are required' })
      };
    }

    const restaurantId = uuidv4();
    const restaurant = {
      restaurant_id: restaurantId,
      name,
      location,
      cuisine_type,
      rating: rating || 0,
      opening_hours: opening_hours || {},
      contact_info: contact_info || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await restaurantsDB.put(restaurant);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        restaurant
      })
    };

  } catch (error) {
    console.error('Error creating restaurant:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

exports.get = async (event) => {
  try {
    const { id } = event.pathParameters;
    
    const restaurant = await restaurantsDB.get({ restaurant_id: id });
    
    if (!restaurant) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ error: 'Restaurant not found' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        restaurant
      })
    };

  } catch (error) {
    console.error('Error getting restaurant:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 