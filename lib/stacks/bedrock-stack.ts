// lib/stacks/bedrock-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { BedrockConstruct } from '../constructs/bedrock-construct';
import { EnvironmentConfig } from '../config/environment-config';

export interface BedrockStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  cluster: rds.DatabaseCluster;
  masterSecret: secretsmanager.ISecret;
}

export class BedrockStack extends cdk.Stack {
  public readonly bedrockConstruct: BedrockConstruct;

  constructor(scope: Construct, id: string, props: BedrockStackProps) {
    super(scope, id, props);

    const { config, cluster, masterSecret } = props;

    // Bedrock Knowledge Base構築
    this.bedrockConstruct = new BedrockConstruct(this, 'Bedrock', {
      cluster,
      masterSecret,
      config,
    });

    // スタックレベルでの出力値
    new cdk.CfnOutput(this, 'KnowledgeBaseId', {
      value: this.bedrockConstruct.knowledgeBase.attrKnowledgeBaseId,
      description: 'Bedrock Knowledge Base ID',
      exportName: `${config.environment}-knowledge-base-id`,
    });

    new cdk.CfnOutput(this, 'KnowledgeBaseArn', {
      value: this.bedrockConstruct.knowledgeBase.attrKnowledgeBaseArn,
      description: 'Bedrock Knowledge Base ARN',
      exportName: `${config.environment}-knowledge-base-arn`,
    });

    new cdk.CfnOutput(this, 'DataSourceId', {
      value: this.bedrockConstruct.dataSource.attrDataSourceId,
      description: 'Bedrock Data Source ID',
      exportName: `${config.environment}-data-source-id`,
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: this.bedrockConstruct.s3Bucket.bucketName,
      description: 'S3 Bucket Name for Knowledge Base',
      exportName: `${config.environment}-kb-s3-bucket-name`,
    });

    new cdk.CfnOutput(this, 'BedrockServiceRoleArn', {
      value: this.bedrockConstruct.serviceRole.roleArn,
      description: 'Bedrock Knowledge Base Service Role ARN',
      exportName: `${config.environment}-bedrock-service-role-arn`,
    });

    // 共通タグ設定
    this.applyCommonTags(config.tags);
  }

  private applyCommonTags(tags: { [key: string]: string }): void {
    Object.entries(tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });
  }
}