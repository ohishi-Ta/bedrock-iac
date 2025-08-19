// bin/cpi-bedrock-infrastructure.ts

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { BedrockStack } from '../lib/stacks/bedrock-stack';
import { devConfig } from '../lib/config/dev-config';

const app = new cdk.App();

// 環境設定
const config = devConfig;
const stackProps: cdk.StackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
};

// ネットワークスタック
const networkStack = new NetworkStack(app, `${config.environment}-network-stack`, {
  ...stackProps,
  config,
});

// データベーススタック
const databaseStack = new DatabaseStack(app, `${config.environment}-database-stack`, {
  ...stackProps,
  config,
  vpc: networkStack.networkConstruct.vpc,
  auroraSecurityGroup: networkStack.networkConstruct.auroraSecurityGroup,
  lambdaSecurityGroup: networkStack.networkConstruct.lambdaSecurityGroup,
});

// Bedrockスタック
const bedrockStack = new BedrockStack(app, `${config.environment}-bedrock-stack`, {
  ...stackProps,
  config,
  cluster: databaseStack.auroraConstruct.cluster,
  masterSecret: databaseStack.auroraConstruct.masterSecret,
});

// 依存関係設定
databaseStack.addDependency(networkStack);
bedrockStack.addDependency(databaseStack);