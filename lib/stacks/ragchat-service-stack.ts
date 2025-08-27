// lib/stacks/ragchat-service-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';
import { CognitoConstruct } from '../constructs/cognito-construct';
import { StorageConstruct } from '../constructs/storage-construct';
import { CloudFrontConstruct } from '../constructs/cloudfront-construct';
import { IamRolesConstruct } from '../constructs/iam-roles-construct';
import { LambdaConstruct } from '../constructs/lambda-construct';
import { ApiGatewayConstruct } from '../constructs/api-gateway-construct';

export interface RagchatServiceStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  knowledgeBaseId?: string;
  knowledgeBaseRegion?: string;
}

export class RagchatServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RagchatServiceStackProps) {
    super(scope, id, props);

    const { config, knowledgeBaseId, knowledgeBaseRegion } = props;

    // Cognito
    const cognitoConstruct = new CognitoConstruct(this, 'Cognito', { config });

    // Storage
    const storageConstruct = new StorageConstruct(this, 'Storage', { config });

    // CloudFront
    const cloudFrontConstruct = new CloudFrontConstruct(this, 'CloudFront', {
      config,
      frontBucket: storageConstruct.frontBucket,
      domainName: config.domain?.domainName,
      certificateArn: config.domain?.certificateArn,
    });

    // IAM Roles
    const iamRolesConstruct = new IamRolesConstruct(this, 'IamRoles', {
      config,
      dynamoTable: storageConstruct.dynamoTable,
      userPool: cognitoConstruct.userPool,
    });

    // Lambda Functions
    const lambdaConstruct = new LambdaConstruct(this, 'Lambda', {
      config,
      knowledgeBaseId: knowledgeBaseId || config.bedrock.knowledgeBaseId,
      knowledgeBaseRegion: knowledgeBaseRegion || config.bedrock.knowledgeBaseRegion,
      dynamoTable: storageConstruct.dynamoTable,
      promptImagesBucket: storageConstruct.promptImagesBucket,
      roles: {
        lambdaGenerateRole: iamRolesConstruct.lambdaGenerateRole,
        lambdaGetChatRole: iamRolesConstruct.lambdaGetChatRole,
        lambdaPromptImagesRole: iamRolesConstruct.lambdaPromptImagesRole,
        lambdaS3ImagesRole: iamRolesConstruct.lambdaS3ImagesRole,
        lambdaCognitoSESRole: iamRolesConstruct.lambdaCognitoSESRole,
      },
    });

    // API Gateway
    const apiGatewayConstruct = new ApiGatewayConstruct(this, 'ApiGateway', {
      config,
      userPool: cognitoConstruct.userPool,
      userPoolClient: cognitoConstruct.userPoolClient,
      lambdaFunctions: {
        ragPromptImagesFunction: lambdaConstruct.ragPromptImagesFunction,
        s3ImagesFunction: lambdaConstruct.s3ImagesFunction,
        ragGetChatsFunction: lambdaConstruct.ragGetChatsFunction,
        searchChatsFunction: lambdaConstruct.searchChatsFunction,
        ragGetChatDetailFunction: lambdaConstruct.ragGetChatDetailFunction,
      },
    });

    // Stack Outputs
    new cdk.CfnOutput(this, 'CognitoUserPoolId', {
      description: 'Cognito User Pool ID',
      value: cognitoConstruct.userPool.userPoolId,
      exportName: `${this.stackName}-CognitoUserPoolId`,
    });

    new cdk.CfnOutput(this, 'CognitoUserPoolClientId', {
      description: 'Cognito User Pool Client ID',
      value: cognitoConstruct.userPoolClient.userPoolClientId,
      exportName: `${this.stackName}-CognitoUserPoolClientId`,
    });

    new cdk.CfnOutput(this, 'ApiGatewayHttpApiUrl', {
      description: 'API Gateway HTTP API URL',
      value: apiGatewayConstruct.httpApi.apiEndpoint,
      exportName: `${this.stackName}-ApiGatewayHttpApiUrl`,
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionUrl', {
      description: 'CloudFront Distribution URL',
      value: `https://${cloudFrontConstruct.distribution.distributionDomainName}`,
      exportName: `${this.stackName}-CloudFrontDistributionUrl`,
    });

    // Function URLの出力は実際のFunction URLを取得する必要があります
    // 現在は placeholder として API Gateway URLを使用
    new cdk.CfnOutput(this, 'RagGenerateImageFunctionUrl', {
      description: 'RAG Generate Image Function URL',
      value: 'Function URL will be generated after deployment',
      exportName: `${this.stackName}-RagGenerateImageFunctionUrl`,
    });

    new cdk.CfnOutput(this, 'RagSseStreamFunctionUrl', {
      description: 'RAG SSE Stream Function URL',
      value: 'Function URL will be generated after deployment',
      exportName: `${this.stackName}-RagSseStreamFunctionUrl`,
    });

    if (config.domain) {
      new cdk.CfnOutput(this, 'CustomDomainUrl', {
        description: 'Custom Domain URL',
        value: `https://${config.domain.domainName}`,
        exportName: `${this.stackName}-CustomDomainUrl`,
      });
    }

    // タグ設定
    Object.entries(config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });
  }
}