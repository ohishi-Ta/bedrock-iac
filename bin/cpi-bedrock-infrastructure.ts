// bin/cpi-bedrock-infrastructure.ts

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { BedrockStack } from '../lib/stacks/bedrock-stack';
import { createConfig, getValidEnvironment } from '../lib/config/environment-config';

const app = new cdk.App();

// 環境を取得（CDKコンテキスト > 環境変数 > デフォルト）
const environmentValue = app.node.tryGetContext('environment') || process.env.ENVIRONMENT || 'dev';
const environment = getValidEnvironment(environmentValue);

console.log(`Deploying for environment: ${environment}`);

// 環境別の設定を生成
const config = createConfig(environment);

// 共通のスタックプロパティ
const stackProps: cdk.StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
  },
  description: `Infrastructure for ${environment} environment`,
};

// ネットワークスタック
const networkStack = new NetworkStack(app, `${environment}-ragchat-network-stack`, {
  ...stackProps,
  config,
});

// データベーススタック
const databaseStack = new DatabaseStack(app, `${environment}-ragchat-database-stack`, {
  ...stackProps,
  config,
  vpc: networkStack.networkConstruct.vpc,
  auroraSecurityGroup: networkStack.networkConstruct.auroraSecurityGroup,
  lambdaSecurityGroup: networkStack.networkConstruct.lambdaSecurityGroup,
});

// Bedrockスタック
const bedrockStack = new BedrockStack(app, `${environment}-ragchat-bedrock-stack`, {
  ...stackProps,
  config,
  cluster: databaseStack.auroraConstruct.cluster,
  masterSecret: databaseStack.auroraConstruct.masterSecret,
});

// 依存関係設定
databaseStack.addDependency(networkStack);
bedrockStack.addDependency(databaseStack);

// スタックレベルのタグを追加
cdk.Tags.of(app).add('Environment', environment);
cdk.Tags.of(app).add('ManagedBy', 'CDK');
cdk.Tags.of(app).add('Project', 'ragchat-app');