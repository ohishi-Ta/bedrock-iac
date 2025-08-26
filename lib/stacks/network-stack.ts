// lib/stacks/network-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkConstruct } from '../constructs/network-construct';
import { EnvironmentConfig } from '../config/environment-config';

export interface NetworkStackProps extends cdk.StackProps {
 config: EnvironmentConfig;
}

export class NetworkStack extends cdk.Stack {
 public readonly networkConstruct: NetworkConstruct;

 constructor(scope: Construct, id: string, props: NetworkStackProps) {
   super(scope, id, props);

   const { config } = props;

   // NetworkConstructを使用してネットワークリソースを作成
   this.networkConstruct = new NetworkConstruct(this, 'Network', {
     config,
   });

   // スタックレベルでの出力値
   new cdk.CfnOutput(this, 'VpcId', {
     value: this.networkConstruct.vpc.vpcId,
     description: 'VPC ID',
     exportName: `${config.environment}-vpc-id`,
   });

   new cdk.CfnOutput(this, 'VpcCidr', {
     value: this.networkConstruct.vpc.vpcCidrBlock,
     description: 'VPC CIDR Block',
     exportName: `${config.environment}-vpc-cidr`,
   });

   new cdk.CfnOutput(this, 'AuroraSecurityGroupId', {
     value: this.networkConstruct.auroraSecurityGroup.securityGroupId,
     description: 'Aurora Security Group ID',
     exportName: `${config.environment}-aurora-sg-id`,
   });

   new cdk.CfnOutput(this, 'LambdaSecurityGroupId', {
     value: this.networkConstruct.lambdaSecurityGroup.securityGroupId,
     description: 'Lambda Security Group ID',
     exportName: `${config.environment}-lambda-sg-id`,
   });

   // プライベートサブネットのIDを出力
   this.networkConstruct.vpc.privateSubnets.forEach((subnet, index) => {
     new cdk.CfnOutput(this, `PrivateSubnet${index}Id`, {
       value: subnet.subnetId,
       description: `Private Subnet ${index} ID`,
       exportName: `${config.environment}-private-subnet-${index}-id`,
     });
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