const { DynamoDBClient, CreateTableCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const serviceName = 'restaurant-reservation-system';
const stage = process.env.STAGE || 'dev';

const tables = [
  {
    name: `${serviceName}-customers-${stage}`,
    keySchema: [{ AttributeName: 'customer_id', KeyType: 'HASH' }],
    attributeDefinitions: [{ AttributeName: 'customer_id', AttributeType: 'S' }]
  },
  {
    name: `${serviceName}-restaurants-${stage}`,
    keySchema: [{ AttributeName: 'restaurant_id', KeyType: 'HASH' }],
    attributeDefinitions: [{ AttributeName: 'restaurant_id', AttributeType: 'S' }]
  },
  {
    name: `${serviceName}-tables-${stage}`,
    keySchema: [{ AttributeName: 'table_id', KeyType: 'HASH' }],
    attributeDefinitions: [
      { AttributeName: 'table_id', AttributeType: 'S' },
      { AttributeName: 'restaurant_id', AttributeType: 'S' }
    ],
    globalSecondaryIndexes: [
      {
        IndexName: 'restaurant_id-index',
        KeySchema: [{ AttributeName: 'restaurant_id', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ]
  },
  {
    name: `${serviceName}-reservations-${stage}`,
    keySchema: [{ AttributeName: 'reservation_id', KeyType: 'HASH' }],
    attributeDefinitions: [
      { AttributeName: 'reservation_id', AttributeType: 'S' },
      { AttributeName: 'restaurant_id', AttributeType: 'S' }
    ],
    globalSecondaryIndexes: [
      {
        IndexName: 'restaurant_id-index',
        KeySchema: [{ AttributeName: 'restaurant_id', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ]
  },
  {
    name: `${serviceName}-requests-${stage}`,
    keySchema: [{ AttributeName: 'request_id', KeyType: 'HASH' }],
    attributeDefinitions: [
      { AttributeName: 'request_id', AttributeType: 'S' },
      { AttributeName: 'reservation_id', AttributeType: 'S' }
    ],
    globalSecondaryIndexes: [
      {
        IndexName: 'reservation_id-index',
        KeySchema: [{ AttributeName: 'reservation_id', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }
    ]
  }
];

const sampleData = {
  restaurants: [
    {
      restaurant_id: 'rest_001',
      name: 'Fine Dining Restaurant',
      location: '123 Main Street, Downtown',
      cuisine_type: 'Contemporary American',
      rating: 4.5,
      opening_hours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '11:00', close: '21:00' }
      },
      contact_info: {
        phone: '(555) 123-4567',
        email: 'info@finedining.com',
        website: 'https://finedining.com'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  tables: [
    { table_id: 'table_001', restaurant_id: 'rest_001', table_number: 'A1', seating_capacity: 2, location_type: 'indoor' },
    { table_id: 'table_002', restaurant_id: 'rest_001', table_number: 'A2', seating_capacity: 2, location_type: 'indoor' },
    { table_id: 'table_003', restaurant_id: 'rest_001', table_number: 'A3', seating_capacity: 4, location_type: 'indoor' },
    { table_id: 'table_004', restaurant_id: 'rest_001', table_number: 'A4', seating_capacity: 4, location_type: 'indoor' },
    { table_id: 'table_005', restaurant_id: 'rest_001', table_number: 'A5', seating_capacity: 6, location_type: 'indoor' },
    { table_id: 'table_006', restaurant_id: 'rest_001', table_number: 'A6', seating_capacity: 6, location_type: 'indoor' },
    { table_id: 'table_007', restaurant_id: 'rest_001', table_number: 'B1', seating_capacity: 2, location_type: 'outdoor' },
    { table_id: 'table_008', restaurant_id: 'rest_001', table_number: 'B2', seating_capacity: 4, location_type: 'outdoor' },
    { table_id: 'table_009', restaurant_id: 'rest_001', table_number: 'B3', seating_capacity: 4, location_type: 'outdoor' },
    { table_id: 'table_010', restaurant_id: 'rest_001', table_number: 'VIP1', seating_capacity: 8, location_type: 'indoor' },
    { table_id: 'table_011', restaurant_id: 'rest_001', table_number: 'VIP2', seating_capacity: 8, location_type: 'indoor' }
  ].map(table => ({
    ...table,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
};

async function createTable(tableConfig) {
  try {
    const command = new CreateTableCommand({
      TableName: tableConfig.name,
      KeySchema: tableConfig.keySchema,
      AttributeDefinitions: tableConfig.attributeDefinitions,
      GlobalSecondaryIndexes: tableConfig.globalSecondaryIndexes,
      BillingMode: 'PAY_PER_REQUEST'
    });

    await client.send(command);
    console.log(`✅ Created table: ${tableConfig.name}`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`ℹ️  Table already exists: ${tableConfig.name}`);
    } else {
      console.error(`❌ Error creating table ${tableConfig.name}:`, error.message);
    }
  }
}

async function insertSampleData() {
  try {
    // Insert sample restaurant
    for (const restaurant of sampleData.restaurants) {
      await docClient.send(new PutItemCommand({
        TableName: `${serviceName}-restaurants-${stage}`,
        Item: restaurant
      }));
    }
    console.log('✅ Inserted sample restaurant data');

    // Insert sample tables
    for (const table of sampleData.tables) {
      await docClient.send(new PutItemCommand({
        TableName: `${serviceName}-tables-${stage}`,
        Item: table
      }));
    }
    console.log('✅ Inserted sample table data');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
  }
}

async function setupDynamoDB() {
  console.log('🚀 Setting up DynamoDB tables...');
  
  // Create tables
  for (const tableConfig of tables) {
    await createTable(tableConfig);
  }

  // Wait a bit for tables to be created
  console.log('⏳ Waiting for tables to be ready...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Insert sample data
  console.log('📝 Inserting sample data...');
  await insertSampleData();

  console.log('🎉 DynamoDB setup completed!');
}

// Run the setup
setupDynamoDB().catch(console.error); 