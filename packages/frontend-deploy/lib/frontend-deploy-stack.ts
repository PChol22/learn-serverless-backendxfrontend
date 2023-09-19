import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';

export class FrontendDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticSiteBucket = new cdk.aws_s3.Bucket(this, 'StaticSiteBucket', {
      websiteIndexDocument: 'index.html',
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      publicReadAccess: true,
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'DeployStaticSite', {
      sources: [cdk.aws_s3_deployment.Source.asset(join(__dirname, '../..', 'frontend', 'dist'))],
      destinationBucket: staticSiteBucket,
    });

    new cdk.aws_cloudfront.Distribution(this, 'StaticSiteDistribution', {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(staticSiteBucket),
        viewerProtocolPolicy: cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
  }
}
