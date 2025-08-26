// lib/constructs/network-construct.ts

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../config/environment-config';

export interface NetworkConstructProps {
  config: EnvironmentConfig;
}

export class NetworkConstruct extends Construct {
  public readonly vpc: ec2.Vpc;
  public readonly auroraSecurityGroup: ec2.SecurityGroup;
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: NetworkConstructProps) {
    super(scope, id);

    const { config } = props;

    // VPC作成
    this.vpc = new ec2.Vpc(this, config.network.naming.vpcName, {
      vpcName: config.network.naming.vpcName,
      ipAddresses: ec2.IpAddresses.cidr(config.network.vpcCidr),
      availabilityZones: config.network.availabilityZones,
      restrictDefaultSecurityGroup: true,
      
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: config.network.naming.privateSubnetName,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      
      natGateways: 0,
    });

    // サブネットに名前タグを追加
    this.vpc.privateSubnets.forEach((subnet, index) => {
      cdk.Tags.of(subnet).add('Name', `${config.network.naming.privateSubnetName}-${index + 1}`);
    });

    // ルートテーブルに名前タグを追加
    this.vpc.node.children.forEach(child => {
      if (child.node.defaultChild?.constructor.name === 'CfnRouteTable') {
        cdk.Tags.of(child).add('Name', `${config.environment}-ragchat-route-table`);
      }
    });

    // Aurora用セキュリティグループ
    this.auroraSecurityGroup = new ec2.SecurityGroup(this, 'AuroraSG', {
      vpc: this.vpc,
      securityGroupName: config.network.naming.auroraSecurityGroupName,
      description: 'Security group for Aurora Serverless v2',
      allowAllOutbound: true,
    });

    // 自分自身からのアクセスを許可
    this.auroraSecurityGroup.addIngressRule(
      this.auroraSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow access from same security group'
    );

    // Lambda用セキュリティグループ
    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSG', {
      vpc: this.vpc,
      securityGroupName: config.network.naming.lambdaSecurityGroupName,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });

    // Lambda → Aurora接続許可
    this.auroraSecurityGroup.addIngressRule(
      this.lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow access from Lambda'
    );

    // S3 VPCエンドポイント
    const s3Endpoint = this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });
    cdk.Tags.of(s3Endpoint).add('Name', `${config.environment}-ragchat-s3-endpoint`);

    // Secrets Manager VPCエンドポイント
    const secretsEndpoint = this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      privateDnsEnabled: true,
    });
    cdk.Tags.of(secretsEndpoint).add('Name', `${config.environment}-ragchat-secrets-endpoint`);
  }
}