const DynamoDBService = require('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

const requestsDB = new DynamoDBService(process.env.REQUESTS_TABLE);

exports.create = async (event) => {
  try {
    const { reservation_id, note, priority = 'normal' } = JSON.parse(event.body);
    
    if (!reservation_id || !note) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Reservation ID and note are required' })
      };
    }

    const requestId = uuidv4();
    const request = {
      request_id: requestId,
      reservation_id,
      note,
      priority,
      created_at: new Date().toISOString()
    };

    await requestsDB.put(request);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        request
      })
    };

  } catch (error) {
    console.error('Error creating request:', error);
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