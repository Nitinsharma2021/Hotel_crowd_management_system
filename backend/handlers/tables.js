const DynamoDBService = require('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

const tablesDB = new DynamoDBService(process.env.TABLES_TABLE);

exports.create = async (event) => {
  try {
    const { restaurant_id, table_number, seating_capacity, location_type } = JSON.parse(event.body);
    
    if (!restaurant_id || !table_number || !seating_capacity || !location_type) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'All fields are required' })
      };
    }

    const tableId = uuidv4();
    const table = {
      table_id: tableId,
      restaurant_id,
      table_number,
      seating_capacity,
      location_type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await tablesDB.put(table);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        table
      })
    };

  } catch (error) {
    console.error('Error creating table:', error);
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

exports.list = async (event) => {
  try {
    const { restaurant_id } = event.queryStringParameters || {};
    
    let tables;
    if (restaurant_id) {
      tables = await tablesDB.query({
        KeyConditionExpression: 'restaurant_id = :restaurantId',
        ExpressionAttributeValues: {
          ':restaurantId': restaurant_id
        }
      });
    } else {
      tables = await tablesDB.scan();
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
        tables,
        count: tables.length
      })
    };

  } catch (error) {
    console.error('Error listing tables:', error);
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