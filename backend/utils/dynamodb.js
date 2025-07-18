const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

class DynamoDBService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async get(key) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: key
    });
    
    try {
      const response = await docClient.send(command);
      return response.Item;
    } catch (error) {
      console.error('Error getting item:', error);
      throw error;
    }
  }

  async put(item) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    });
    
    try {
      await docClient.send(command);
      return item;
    } catch (error) {
      console.error('Error putting item:', error);
      throw error;
    }
  }

  async query(params) {
    const command = new QueryCommand({
      TableName: this.tableName,
      ...params
    });
    
    try {
      const response = await docClient.send(command);
      return response.Items;
    } catch (error) {
      console.error('Error querying items:', error);
      throw error;
    }
  }

  async scan(params = {}) {
    const command = new ScanCommand({
      TableName: this.tableName,
      ...params
    });
    
    try {
      const response = await docClient.send(command);
      return response.Items;
    } catch (error) {
      console.error('Error scanning items:', error);
      throw error;
    }
  }

  async update(params) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      ...params
    });
    
    try {
      const response = await docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async delete(key) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: key
    });
    
    try {
      await docClient.send(command);
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}

module.exports = DynamoDBService; 