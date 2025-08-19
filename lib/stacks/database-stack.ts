// lib/stacks/database-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { AuroraConstruct } from '../constructs/aurora-construct';
import { DbInitializerConstruct } from '../constructs/db-initializer-construct';
import { EnvironmentConfig } from '../config/environment-config';

export interface DatabaseStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
  auroraSecurityGroup: ec2.ISecurityGroup;
  lambdaSecurityGroup: ec2.ISecurityGroup;
}

export class DatabaseStack extends cdk.Stack {
  public readonly auroraConstruct: AuroraConstruct;
  public readonly dbInitializerConstruct: DbInitializerConstruct;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { config, vpc, auroraSecurityGroup, lambdaSecurityGroup } = props;

    // Aurora構築
    this.auroraConstruct = new AuroraConstruct(this, 'Aurora', {
      vpc,
      securityGroup: auroraSecurityGroup,
      config,
    });

    // データベース初期化（pgvector有効化、スキーマ・テーブル作成）
    this.dbInitializerConstruct = new DbInitializerConstruct(this, 'DbInitializer', {
      vpc,
      lambdaSecurityGroup,
      cluster: this.auroraConstruct.cluster,
      masterSecret: this.auroraConstruct.masterSecret,
      config,
    });

    // スタックレベルでの出力値
    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: this.auroraConstruct.cluster.clusterEndpoint.hostname,
      description: 'Aurora Cluster Endpoint',
      exportName: `${config.environment}-aurora-endpoint`,
    });

    new cdk.CfnOutput(this, 'ClusterArn', {
      value: this.auroraConstruct.cluster.clusterArn,
      description: 'Aurora Cluster ARN',
      exportName: `${config.environment}-aurora-arn`,
    });

    new cdk.CfnOutput(this, 'MasterSecretArn', {
      value: this.auroraConstruct.masterSecret.secretArn,
      description: 'Master User Secret ARN',
      exportName: `${config.environment}-master-secret-arn`,
    });

    new cdk.CfnOutput(this, 'DatabaseName', {
      value: config.aurora.databaseName,
      description: 'Database Name',
      exportName: `${config.environment}-database-name`,
    });

    new cdk.CfnOutput(this, 'DbInitializationStatus', {
      value: 'Initialized with pgvector and Bedrock Knowledge Base schema',
      description: 'Database Initialization Status',
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