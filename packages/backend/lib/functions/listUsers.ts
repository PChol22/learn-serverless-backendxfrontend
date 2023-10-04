import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { listUsersContract } from '../../../contracts';
import { getHandler } from '@swarmion/serverless-contracts';
import middy from "@middy/core";
import cors from "@middy/http-cors";

const client = new DynamoDBClient({});

const main = getHandler(
  listUsersContract,
  { validateInput: false, validateOutput: false, returnValidationErrors: false }
)(async () => {
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

  const users = (Items ?? []).map(item => ({
    email: item.SK.S ?? '',
    firstName: item.firstName.S ?? '',
    lastName: item.lastName.S ?? '',
  }));

  console.log({
    statusCode: 200,
    body: {
      users,
    },
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  return {
    statusCode: 200,
    body: {
      users,
    },
  };
});

export const handler = middy(main).use(cors());