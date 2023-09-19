import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new cdk.aws_apigateway.RestApi(this, 'RestApi', {
    });

    const users = api.root.addResource('users');
    users.addCorsPreflight({
      allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
      allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
      allowHeaders: cdk.aws_apigateway.Cors.DEFAULT_HEADERS,
    });

    const table = new cdk.aws_dynamodb.Table(this, 'UsersTable', {
      partitionKey: {
        name: 'PK',
        type: cdk.aws_dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: cdk.aws_dynamodb.AttributeType.STRING
      },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const listUsers = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'ListUsers', {
      entry: join(__dirname, 'functions', 'listUsers.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
      bundling: {
        minify: true,
        externalModules: ['@aws-sdk/client-dynamodb']
      },
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    });

    table.grantReadData(listUsers);
    users.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(listUsers));

    const createUser = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'CreateUser', {
      entry: join(__dirname, 'functions', 'createUser.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
      bundling: {
        minify: true,
        externalModules: ['@aws-sdk/client-dynamodb']
      },
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    });

    table.grantWriteData(createUser);
    users.addMethod('POST', new cdk.aws_apigateway.LambdaIntegration(createUser));
  }
}
