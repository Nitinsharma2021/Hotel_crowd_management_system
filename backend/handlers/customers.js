const DynamoDBService = require('../utils/dynamodb');
const { v4: uuidv4 } = require('uuid');

const customersDB = new DynamoDBService(process.env.CUSTOMERS_TABLE);

exports.create = async (event) => {
  try {
    const { name, email, phone_number, preferences = {}, loyalty_status = 'bronze' } = JSON.parse(event.body);
    
    if (!name || !email || !phone_number) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Name, email, and phone number are required' })
      };
    }

    const customerId = uuidv4();
    const customer = {
      customer_id: customerId,
      name,
      email,
      phone_number,
      preferences,
      loyalty_status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await customersDB.put(customer);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        customer
      })
    };

  } catch (error) {
    console.error('Error creating customer:', error);
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
    
    const customer = await customersDB.get({ customer_id: id });
    
    if (!customer) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ error: 'Customer not found' })
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
        customer
      })
    };

  } catch (error) {
    console.error('Error getting customer:', error);
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
    
    const customer = await customersDB.get({ customer_id: id });
    
    if (!customer) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS'
        },
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }

    const updatedCustomer = {
      ...customer,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    await customersDB.put(updatedCustomer);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        customer: updatedCustomer
      })
    };

  } catch (error) {
    console.error('Error updating customer:', error);
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