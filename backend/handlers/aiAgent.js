const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const DynamoDBService = require('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });
const customersDB = new DynamoDBService(process.env.CUSTOMERS_TABLE);
const restaurantsDB = new DynamoDBService(process.env.RESTAURANTS_TABLE);
const tablesDB = new DynamoDBService(process.env.TABLES_TABLE);
const reservationsDB = new DynamoDBService(process.env.RESERVATIONS_TABLE);

const SYSTEM_PROMPT = `You are an intelligent restaurant reservation assistant. Your role is to:

1. Understand customer reservation requests from natural language
2. Check table availability based on party size, time, and preferences
3. Suggest optimal table assignments considering restaurant layout and customer preferences
4. Handle special requests and dietary restrictions
5. Provide personalized recommendations

Available actions:
- check_availability: Check if tables are available for given criteria
- create_reservation: Create a new reservation
- suggest_alternatives: Suggest alternative times or tables
- handle_special_request: Process special requests

Always respond in JSON format with the following structure:
{
  "action": "action_name",
  "parameters": {},
  "response": "Human readable response",
  "confidence": 0.95
}`;

async function invokeBedrock(prompt) {
  const input = {
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    contentType: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error('Bedrock invocation error:', error);
    throw error;
  }
}

async function checkTableAvailability(partySize, reservationTime, restaurantId) {
  try {
    // Get all tables for the restaurant
    const tables = await tablesDB.query({
      KeyConditionExpression: 'restaurant_id = :restaurantId',
      ExpressionAttributeValues: {
        ':restaurantId': restaurantId
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
        ':restaurantId': restaurantId,
        ':time': reservationTime,
        ':status': 'confirmed'
      }
    });

    const reservedTableIds = new Set(reservations.map(r => r.table_id));
    
    // Find available tables that can accommodate the party
    const availableTables = tables.filter(table => 
      !reservedTableIds.has(table.table_id) && 
      table.seating_capacity >= partySize
    );

    return availableTables;
  } catch (error) {
    console.error('Error checking table availability:', error);
    throw error;
  }
}

async function createReservation(customerId, restaurantId, tableId, reservationTime, partySize, specialRequests = []) {
  try {
    const reservationId = uuidv4();
    const reservation = {
      reservation_id: reservationId,
      customer_id: customerId,
      restaurant_id: restaurantId,
      table_id: tableId,
      reservation_time: reservationTime,
      party_size: partySize,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await reservationsDB.put(reservation);

    // Create special requests if any
    for (const request of specialRequests) {
      const requestId = uuidv4();
      await new DynamoDBService(process.env.REQUESTS_TABLE).put({
        request_id: requestId,
        reservation_id: reservationId,
        note: request,
        priority: 'normal',
        created_at: new Date().toISOString()
      });
    }

    return reservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body);
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Create context for the AI
    const context = `
Current restaurant data:
- Restaurant ID: rest_001
- Available tables: Various sizes (2-8 seats)
- Operating hours: 11:00 AM - 11:00 PM

Customer request: "${prompt}"

Please analyze this request and provide the appropriate action.
`;

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${context}`;
    
    // Get AI response
    const aiResponse = await invokeBedrock(fullPrompt);
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      // If AI response is not valid JSON, create a fallback response
      parsedResponse = {
        action: 'check_availability',
        parameters: {
          partySize: 2,
          time: new Date().toISOString(),
          restaurantId: 'rest_001'
        },
        response: aiResponse,
        confidence: 0.7
      };
    }

    // Execute the action based on AI response
    let result;
    switch (parsedResponse.action) {
      case 'check_availability':
        const availableTables = await checkTableAvailability(
          parsedResponse.parameters.partySize || 2,
          parsedResponse.parameters.time || new Date().toISOString(),
          parsedResponse.parameters.restaurantId || 'rest_001'
        );
        result = {
          available: availableTables.length > 0,
          tables: availableTables,
          message: `Found ${availableTables.length} available tables`
        };
        break;

      case 'create_reservation':
        result = await createReservation(
          parsedResponse.parameters.customerId || 'cust_001',
          parsedResponse.parameters.restaurantId || 'rest_001',
          parsedResponse.parameters.tableId,
          parsedResponse.parameters.time,
          parsedResponse.parameters.partySize,
          parsedResponse.parameters.specialRequests || []
        );
        break;

      default:
        result = { message: parsedResponse.response };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        aiResponse: parsedResponse,
        result: result
      })
    };

  } catch (error) {
    console.error('Handler error:', error);
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