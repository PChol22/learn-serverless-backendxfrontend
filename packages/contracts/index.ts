import { ApiGatewayContract } from '@swarmion/serverless-contracts';

export const createUserContract = new ApiGatewayContract({
  id: 'createUser',
  path: '/users',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
    additionalProperties: false,
    required: ['email', 'firstName', 'lastName'],
  } as const,
  outputSchemas: {
    [200]: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      additionalProperties: false,
      required: ['message'],
    } as const,
  },
});

export const listUsersContract = new ApiGatewayContract({
  id: 'listUsers',
  path: '/users',
  method: 'GET',
  integrationType: 'restApi',
  outputSchemas: {
    [200]: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
            },
            required: ['firstName', 'lastName', 'email'],
            additionalProperties: false,
          },
        },
      },
      required: ['users'],
      additionalProperties: false,
    } as const,
  },
});
