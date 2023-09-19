import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event: { body: string }): Promise<{ statusCode: number; body: string; headers?: Record<string, string> }> => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error('Missing TABLE_NAME');
  }
  
  const { email, firstName, lastName } = JSON.parse(event.body) as { email: string; firstName: string; lastName: string};

  if (!email || !firstName || !lastName) {
    return {
      statusCode: 400,
      body: 'Missing parameters',
    };
  }

  await client.send(new PutItemCommand({
    TableName: tableName,
    Item: {
      PK: { S: 'USER' },
      SK: { S: email },
      firstName: { S: firstName },
      lastName: { S: lastName },
    },
  }));

  return {
    statusCode: 200,
    body: 'User created',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
}