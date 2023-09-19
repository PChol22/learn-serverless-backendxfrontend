import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (): Promise<{ statusCode: number; body: string; headers: Record<string, string> }> => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error('Missing TABLE_NAME');
  }
  
  const { Items } = await client.send(new QueryCommand({
    TableName: tableName,
    KeyConditions: {
      PK: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: 'USER' }],
      },
    },
    }
  ));

  return {
    statusCode: 200,
    body: JSON.stringify(Items?.map(item => ({
      email: item.SK.S,
      firstName: item.firstName.S,
      lastName: item.lastName.S,
    }))),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
}