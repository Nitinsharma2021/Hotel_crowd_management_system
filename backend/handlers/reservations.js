const DynamoDBService = require('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

const reservationsDB = new DynamoDBService(process.env.RESERVATIONS_TABLE);
const tablesDB = new DynamoDBService(process.env.TABLES_TABLE);
const customersDB = new DynamoDBService(process.env.CUSTOMERS_TABLE);

exports.create = async (event) => {
  try {
    const { customer_id, restaurant_id, table_id, reservation_time, party_size, special_requests = [] } = JSON.parse(event.body);
    
    if (!customer_id || !restaurant_id || !table_id || !reservation_time || !party_size) {
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

    // Check if table is available
    const existingReservations = await reservationsDB.query({
      KeyConditionExpression: 'restaurant_id = :restaurantId',
      FilterExpression: 'table_id = :tableId AND reservation_time = :time AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':restaurantId': restaurant_id,
        ':tableId': table_id,
        ':time': reservation_time,
        ':status': 'confirmed'
      }
    });

    if (existingReservations.length > 0) {
      return {
        statusCode: 409,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Table is not available at this time' })
      };
    }

    const reservationId = uuidv4();
    const reservation = {
      reservation_id: reservationId,
      customer_id,
      restaurant_id,
      table_id,
      reservation_time,
      party_size,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await reservationsDB.put(reservation);

    // Create special requests if any
    for (const request of special_requests) {
      const requestId = uuidv4();
      await new DynamoDBService(process.env.REQUESTS_TABLE).put({
        request_id: requestId,
        reservation_id: reservationId,
        note: request,
        priority: 'normal',
        created_at: new Date().toISOString()
      });
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        reservation
      })
    };

  } catch (error) {
    console.error('Error creating reservation:', error);
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
    
    const reservation = await reservationsDB.get({ reservation_id: id });
    
    if (!reservation) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ error: 'Reservation not found' })
      };
    }

    // Get additional details
    const [customer, table] = await Promise.all([
      customersDB.get({ customer_id: reservation.customer_id }),
      tablesDB.get({ table_id: reservation.table_id })
    ]);

    const reservationWithDetails = {
      ...reservation,
      customer,
      table
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        reservation: reservationWithDetails
      })
    };

  } catch (error) {
    console.error('Error getting reservation:', error);
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

exports.update = async (event) => {
  try {
    const { id } = event.pathParameters;
    const updateData = JSON.parse(event.body);
    
    const reservation = await reservationsDB.get({ reservation_id: id });
    
    if (!reservation) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS'
        },
        body: JSON.stringify({ error: 'Reservation not found' })
      };
    }

    const updatedReservation = {
      ...reservation,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    await reservationsDB.put(updatedReservation);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        reservation: updatedReservation
      })
    };

  } catch (error) {
    console.error('Error updating reservation:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

exports.cancel = async (event) => {
  try {
    const { id } = event.pathParameters;
    
    const reservation = await reservationsDB.get({ reservation_id: id });
    
    if (!reservation) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Reservation not found' })
      };
    }

    const updatedReservation = {
      ...reservation,
      status: 'cancelled',
      updated_at: new Date().toISOString()
    };

    await reservationsDB.put(updatedReservation);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Reservation cancelled successfully',
        reservation: updatedReservation
      })
    };

  } catch (error) {
    console.error('Error cancelling reservation:', error);
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

exports.getAvailableTables = async (event) => {
  try {
    const { restaurant_id, party_size, reservation_time } = event.queryStringParameters || {};
    
    if (!restaurant_id || !party_size || !reservation_time) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ error: 'restaurant_id, party_size, and reservation_time are required' })
      };
    }

    // Get all tables for the restaurant
    const tables = await tablesDB.query({
      KeyConditionExpression: 'restaurant_id = :restaurantId',
      ExpressionAttributeValues: {
        ':restaurantId': restaurant_id
      }
    });

    // Get existing reservations for the time slot
    const reservations = await reservationsDB.query({
      KeyConditionExpression: 'restaurant_id = :restaurantId',
      FilterExpression: 'reservation_time = :time AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':restaurantId': restaurant_id,
        ':time': reservation_time,
        ':status': 'confirmed'
      }
    });

    const reservedTableIds = new Set(reservations.map(r => r.table_id));
    
    // Find available tables that can accommodate the party
    const availableTables = tables.filter(table => 
      !reservedTableIds.has(table.table_id) && 
      table.seating_capacity >= parseInt(party_size)
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        availableTables,
        totalAvailable: availableTables.length
      })
    };

  } catch (error) {
    console.error('Error getting available tables:', error);
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