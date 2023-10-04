import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getHandler } from '@swarmion/serverless-contracts';
import { createUserContract } from '../../../contracts';
import middy from "@middy/core";
import cors from "@middy/http-cors";

const client = new DynamoDBClient({});

const main = getHandler(
  createUserContract,
  { validateInput: false, validateOutput: false, returnValidationErrors: false }
)(async (event) => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error('Missing TABLE_NAME');
  }
  
  const { email, firstName, lastName } = event.body;

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
    body: {
      message: 'User created',
    },
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };
});

export const handler = middy(main).use(cors());