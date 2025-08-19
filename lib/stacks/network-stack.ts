// lib/stacks/network-stack.ts

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class NetworkStack extends cdk.Stack {
  public readonly networkConstruct: {
    vpc: ec2.Vpc;
    auroraSecurityGroup: ec2.SecurityGroup;
    lambdaSecurityGroup: ec2.SecurityGroup;
  };

  constructor(scope: Construct, id: string, props: cdk.StackProps & { config: any }) {
    super(scope, id, props);

    // VPC作成
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0, // NAT Gatewayは不要
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // セキュリティグループ作成
    const auroraSecurityGroup = new ec2.SecurityGroup(this, 'AuroraSecurityGroup', {
      vpc,
      description: 'Security group for Aurora PostgreSQL',
      allowAllOutbound: false,
    });

    const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true, // AWSサービスへのアクセスを許可
    });

    // Aurora用のインバウンドルール
    auroraSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow Lambda to connect to Aurora PostgreSQL'
    );

    // VPCエンドポイント用のセキュリティグループ
    const vpcEndpointSecurityGroup = new ec2.SecurityGroup(this, 'VpcEndpointSecurityGroup', {
      vpc,
      description: 'Security group for VPC endpoints',
      allowAllOutbound: false,
    });

    // VPCエンドポイントへのHTTPSアクセスを許可
    vpcEndpointSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(443),
      'Allow Lambda to access VPC endpoints'
    );

    // Secrets Manager VPCエンドポイント
    new ec2.InterfaceVpcEndpoint(this, 'SecretsManagerEndpoint', {
      vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: {
        subnets: vpc.isolatedSubnets,
      },
      securityGroups: [vpcEndpointSecurityGroup],
      privateDnsEnabled: true,
    });

    // S3 VPCエンドポイント（ゲートウェイタイプ）
    new ec2.GatewayVpcEndpoint(this, 'S3Endpoint', {
      vpc,
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnets: vpc.isolatedSubnets,
        },
      ],
    });

    // 出力
    this.networkConstruct = {
      vpc,
      auroraSecurityGroup,
      lambdaSecurityGroup,
    };
  }
}